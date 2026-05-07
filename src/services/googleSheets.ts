import type { Outlet, MenuItem } from '@/types';

const SHEET_ID = '1MenS48HpbfVlqhqiR5vA7CQnJU1GJRPcr_nPbxBlRVI';

// ─── GViz Types ───────────────────────────────────────────────────────────────

interface GVizCell { v: string | number | boolean | null; f?: string; }
interface GVizRow { c: (GVizCell | null)[]; }
interface GVizTable {
  cols: { id: string; label: string; type: string }[];
  rows: GVizRow[];
}

// ─── Core fetch — returns null on any failure ────────────────────────────────

async function tryFetchSheet(sheetName: string): Promise<Record<string, string>[] | null> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const text = await res.text();
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+?)\);\s*$/);
    if (!match?.[1]) return null;

    const parsed = JSON.parse(match[1]);
    if (parsed.status === 'error') {
      console.warn(`[GViz] Sheet "${sheetName}" error:`, parsed.errors?.[0]?.detailed_message ?? parsed.errors);
      return null;
    }

    const { table }: { table: GVizTable } = parsed;
    if (!table?.cols || !table?.rows) return null;

    const headers = table.cols.map((c) => (c.label || c.id).trim());
    console.log(`[GViz] "${sheetName}" headers:`, headers);

    return table.rows
      // Keep any row that has at least one non-empty cell
      .filter((row) => row.c?.some((cell) => cell?.v != null && String(cell.v).trim() !== ''))
      .map((row) => {
        const obj: Record<string, string> = {};
        row.c?.forEach((cell, i) => {
          const header = headers[i];
          if (!header) return;
          // Use formatted value (f) when available — handles dropdowns/chips
          const val = (cell?.f ?? (cell?.v != null ? String(cell.v) : '')).trim();
          // Store under original header and several normalized variants
          obj[header]                                            = val;
          obj[header.toLowerCase()]                              = val;
          obj[header.toLowerCase().replace(/[\s_]+/g, '')]      = val;
          obj[header.toLowerCase().replace(/[\s]+/g, '_')]       = val;
        });
        return obj;
      });
  } catch (e) {
    console.error(`[GViz] Fetch exception for "${sheetName}":`, e);
    return null;
  }
}

// ─── Auto-discover sheet by trying multiple name variants ─────────────────────

async function fetchSheetData(primaryName: string, ...aliases: string[]): Promise<{
  rows: Record<string, string>[];
  foundName: string;
}> {
  const candidates = [primaryName, ...aliases];
  for (const name of candidates) {
    const rows = await tryFetchSheet(name);
    if (rows !== null) {
      console.log(`[GViz] ✓ "${name}" → ${rows.length} rows`);
      return { rows, foundName: name };
    }
  }
  throw new Error(
    `Sheet tidak ditemukan. Nama yang dicoba: ${candidates.map((c) => `"${c}"`).join(', ')}.\n` +
    `Pastikan nama tab sheet benar dan dibagikan sebagai "Anyone with link → Viewer".`
  );
}

// ─── Flexible column picker ───────────────────────────────────────────────────

function pick(row: Record<string, string>, ...keys: string[]): string {
  for (const k of keys) {
    const variants = [
      k,
      k.toLowerCase(),
      k.toLowerCase().replace(/[\s_]+/g, ''),
      k.toLowerCase().replace(/\s+/g, '_'),
    ];
    for (const v of variants) {
      if (row[v] !== undefined && row[v] !== '') return row[v];
    }
  }
  return '';
}

// ─── Image utilities ──────────────────────────────────────────────────────────

function extractDriveId(url: string): string | null {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]{10,})/,
    /\/d\/([a-zA-Z0-9_-]{10,})(?:\/|$)/,
    /[?&]id=([a-zA-Z0-9_-]{10,})/,
    /open\?id=([a-zA-Z0-9_-]{10,})/,
    /\/uc\?.*id=([a-zA-Z0-9_-]{10,})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

export function normalizeImageUrl(url: string): string {
  if (!url?.trim()) return '';
  url = url.trim();
  if (url.startsWith('http') && !url.includes('drive.google.com') && !url.includes('docs.google.com')) return url;
  const id = extractDriveId(url);
  if (id) return `https://lh3.googleusercontent.com/d/${id}=w800`;
  return url;
}

export function buildImageFallbacks(url: string): string[] {
  if (!url?.trim()) return [];
  const id = extractDriveId(url.trim());
  if (!id) return [url.trim()];
  return [
    `https://lh3.googleusercontent.com/d/${id}=w800`,
    `https://drive.google.com/thumbnail?id=${id}&sz=w600`,
    `https://drive.google.com/uc?export=view&id=${id}`,
  ];
}

function parseImageUrls(raw: string): string[] {
  if (!raw?.trim()) return [];
  return raw.split(/[,;\n]+/).map((u) => normalizeImageUrl(u.trim())).filter(Boolean);
}

// ─── Outlets ──────────────────────────────────────────────────────────────────

export async function fetchOutlets(): Promise<Outlet[]> {
  const { rows, foundName } = await fetchSheetData(
    'Outlets', 'outlets', 'OUTLETS', 'Outlet', 'outlet',
    'Data Outlet', 'Daftar Outlet', 'Table1', 'Sheet1'
  );
  console.log(`[Outlets] sheet="${foundName}" rows=${rows.length}`);
  if (rows[0]) console.log('[Outlets] sample row:', rows[0]);

  return rows
    .filter((row) => pick(row, 'ID', 'id'))
    .map((row) => {
      const rawImageField = pick(row,
        'Image', 'image', 'image_url', 'imageurl',
        'Gambar', 'Foto', 'Photo', 'photo', 'Foto Outlet',
        'Images', 'images', 'Gallery', 'gallery'
      );
      // Support multiple comma/newline-separated URLs in the image cell
      const allImageUrls = rawImageField
        .split(/[,;\n]+/)
        .map((u: string) => u.trim())
        .filter(Boolean);
      const primaryRaw = allImageUrls[0] ?? '';
      const galleryImages = allImageUrls.map((raw: string) => ({
        src: normalizeImageUrl(raw),
        fallbacks: buildImageFallbacks(raw),
      }));

      // Parse menus_url — separate column for food/menu photos
      const rawMenusField = pick(row,
        'menus_url', 'menusurl', 'Menus URL', 'menus_image', 'menu_photos',
        'Menu Images', 'menu_images', 'Foto Menu Outlet', 'MenusURL'
      );
      const menuGalleryImages = rawMenusField
        .split(/[,;\n]+/)
        .map((u: string) => u.trim())
        .filter(Boolean)
        .map((raw: string) => ({
          src: normalizeImageUrl(raw),
          fallbacks: buildImageFallbacks(raw),
        }));

      return {
        id: pick(row, 'ID', 'id'),
        name: pick(row, 'Name', 'name', 'Nama', 'Nama Outlet', 'outlet_name', 'outletname'),
        city: pick(row, 'City', 'city', 'Kota'),
        address: pick(row, 'Address', 'address', 'Alamat'),
        phone: pick(row, 'Phone', 'phone', 'Telepon', 'Telp', 'No Hp', 'No HP', 'No. HP', 'phone_number'),
        image: normalizeImageUrl(primaryRaw),
        imageFallbacks: buildImageFallbacks(primaryRaw),
        galleryImages,
        menuGalleryImages,
        mapsUrl: pick(row, 'Maps URL', 'maps_url', 'mapsurl', 'Maps', 'Google Maps', 'Lokasi', 'maps_link'),
        waNumber: pick(row,
          'WA Number', 'wa_number', 'wanumber', 'WA', 'Whatsapp', 'No WA',
          'WhatsApp', 'Nomor WA', 'No. WA', 'wa', 'whatsapp_number'
        ).replace(/\D/g, ''),
        bankInfo: pick(row,
          'Bank Info', 'bank_info', 'bankinfo', 'Bank', 'Rekening',
          'Info Bank', 'No Rekening', 'Rekening Bank', 'bank_account'
        ),
        category: pick(row,
          'Category', 'category', 'Kategori', 'Tipe', 'Type', 'Jenis',
          'outlet_category', 'outletcategory'
        ),
      };
    });
}

// ─── Menu Items ───────────────────────────────────────────────────────────────

// Exact columns confirmed from screenshot:
// outlet_id | category | item_name | price | description | image_url

let _menuSheetFoundName = '';
export function getMenuSheetFoundName() { return _menuSheetFoundName; }

export async function fetchMenuItems(outletId?: string): Promise<MenuItem[]> {
  const { rows, foundName } = await fetchSheetData(
    'Menu', 'menu', 'MENU', 'Menus', 'menus',
    'Daftar Menu', 'Data Menu', 'Table2', 'Sheet2', 'Sheet3'
  );

  _menuSheetFoundName = foundName;
  console.log(`[Menu] sheet="${foundName}" rows=${rows.length}`);
  if (rows[0]) console.log('[Menu] sample row:', rows[0]);

  const items = rows
    // Very permissive filter: keep any row that has item_name or name
    .filter((row) => {
      const name = pick(row,
        'item_name', 'itemname', 'Name', 'name', 'Nama', 'Nama Menu',
        'Menu', 'Item', 'menu_name', 'menuname'
      );
      return name.trim() !== '';
    })
    .map((row, idx) => {
      const rawImages = pick(row,
        'image_url', 'imageurl', 'Image', 'image', 'Images', 'images',
        'Gambar', 'Foto', 'Foto Menu', 'photo', 'photo_url'
      );
      return {
        // No dedicated ID column → use row index
        id: pick(row, 'ID', 'id') || String(idx),
        // ← exact column name from screenshot
        outletId: pick(row,
          'outlet_id', 'outletid', 'OutletID', 'outletId', 'Outlet ID',
          'ID Outlet', 'id_outlet', 'Outlet', 'outlet'
        ).trim(),
        // "Makanan Utama", "Minuman", "Camilan" etc — keep full label
        category: pick(row,
          'category', 'Category', 'Kategori', 'Tipe', 'Jenis'
        ) || 'Lainnya',
        // ← exact column name from screenshot
        name: pick(row,
          'item_name', 'itemname', 'Name', 'name', 'Nama', 'Nama Menu',
          'Menu', 'Item', 'menu_name'
        ),
        description: pick(row,
          'description', 'Description', 'Deskripsi', 'Keterangan', 'Ket', 'DESC', 'desc'
        ),
        price: parseFloat(
          pick(row, 'price', 'Price', 'Harga', 'harga').replace(/[^0-9.]/g, '')
        ) || 0,
        // ← exact column name from screenshot
        images: parseImageUrls(rawImages),
      };
    });

  if (!outletId) return items;

  const target = outletId.trim().toLowerCase();
  const matched = items.filter((i) => i.outletId.trim().toLowerCase() === target);

  console.log(`[Menu] filter outletId="${outletId}" → ${matched.length}/${items.length}`);
  if (matched.length === 0 && items.length > 0) {
    console.warn('[Menu] Available outletIds:', [...new Set(items.map((i) => `"${i.outletId}"`))]);
  }
  return matched;
}

// ─── Formatters ───────────────────────────────────────────────────────────────

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(price);
}

export function buildWhatsAppUrl(waNumber: string, outletName: string, orderText?: string): string {
  const clean = waNumber.replace(/\D/g, '');
  const message = orderText
    ? `Halo ${outletName}, saya ingin memesan:\n\n${orderText}\n\nMohon konfirmasi ketersediaan & harga. Terima kasih! 🙏`
    : `Halo ${outletName}, saya ingin informasi lebih lanjut. Terima kasih!`;
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
