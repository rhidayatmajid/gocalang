# MAXIM Calang Foodie 🍜

Direktori kuliner premium untuk Calang, Aceh.  
**Live:** https://gocalang.my.id

---

## 🚀 Deploy ke gocalang.my.id via GitHub CI/CD + cPanel AwanData

### Langkah 1 — Push project ke GitHub

```bash
# Di folder project
git init
git add .
git commit -m "first commit"

# Buat repo baru di github.com lalu:
git remote add origin https://github.com/USERNAME/maxim-calang-foodie.git
git push -u origin main
```

---

### Langkah 2 — Dapatkan info FTP dari cPanel AwanData

1. Login ke **cPanel AwanData** → [awandata.com](https://awandata.com) → **cPanel**
2. Buka **FTP Accounts**
3. Buat akun FTP baru (atau gunakan akun utama):
   - **Username:** misal `gocalang@gocalang.my.id`
   - **Password:** buat password kuat
   - **Directory:** `/public_html` (root domain) atau `/public_html/gocalang.my.id`
4. Catat:
   - **FTP Server** → biasanya `gocalang.my.id` atau IP server
   - **Username** → username FTP lengkap
   - **Password** → password FTP
   - **Remote Directory** → path folder di server (lihat step 3 dibawah)

---

### Langkah 3 — Cari path direktori domain di cPanel

1. Di cPanel → **Addon Domains** atau **Domains**
2. Cari `gocalang.my.id`
3. Lihat kolom **Document Root** — biasanya:
   - `/public_html/` (jika domain utama)
   - `/public_html/gocalang.my.id/` (jika addon domain)
4. Tambahkan trailing slash: `public_html/` atau `public_html/gocalang.my.id/`

---

### Langkah 4 — Set GitHub Secrets

1. Buka repo GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Klik **New repository secret** untuk masing-masing:

| Secret Name | Isi | Contoh |
|---|---|---|
| `FTP_SERVER` | Hostname/IP FTP | `gocalang.my.id` |
| `FTP_USERNAME` | Username FTP lengkap | `gocalang@gocalang.my.id` |
| `FTP_PASSWORD` | Password FTP | `P@ssw0rd123` |
| `FTP_REMOTE_DIR` | Folder tujuan di server | `public_html/` |

---

### Langkah 5 — Trigger Deploy Pertama

```bash
# Setelah secrets diset, push commit apapun ke branch main:
git commit --allow-empty -m "trigger deploy"
git push origin main
```

Atau manual: **GitHub repo** → **Actions** → **Deploy to gocalang.my.id** → **Run workflow**

---

### Langkah 6 — Pantau progress

1. Buka tab **Actions** di GitHub repo
2. Klik workflow run yang berjalan
3. Lihat tiap step: Install → Build → Deploy

Deploy selesai dalam ±2-3 menit.  
Buka **https://gocalang.my.id** — selesai! 🎉

---

### Troubleshooting

**❌ FTP connection refused**
- Pastikan port 21 tidak diblokir
- Coba ganti `protocol: ftp` ke `ftps` di `deploy.yml` jika cPanel support FTPS
- Cek firewall cPanel: WHM → Firewall → pastikan port 21 buka

**❌ 404 saat refresh halaman**
- File `.htaccess` harus ikut ter-upload ke server
- Pastikan `public/.htaccess` ada di project (sudah include)
- Di cPanel → File Manager → cek `public_html/.htaccess` ada

**❌ Halaman blank / putih**
- Buka DevTools → Console → cek error
- Mungkin `base` URL salah di `vite.config.ts`
- Pastikan `FTP_REMOTE_DIR` diakhiri slash: `public_html/`

**❌ Image Google Drive tidak muncul**
- Pastikan file Drive di-share: **Anyone with link → Viewer**
- Cek browser Console untuk error CORS

---

## 🗂️ Google Sheets Schema

### Sheet: `Outlets`
| Kolom | Keterangan |
|---|---|
| `ID` | ID unik outlet (angka atau teks) |
| `Name` | Nama outlet |
| `City` | Kota / area |
| `Address` | Alamat lengkap |
| `Phone` | Nomor telepon |
| `image_url` | URL foto (Google Drive). Pisahkan dengan koma untuk banyak foto |
| `Maps URL` | Link Google Maps |
| `WA Number` | Nomor WhatsApp (akan dibersihkan otomatis) |
| `Bank Info` | Info rekening bank |
| `Category` | Kategori outlet: Makanan / Minuman / Western / dll |

### Sheet: `Menu`
| Kolom | Keterangan |
|---|---|
| `outlet_id` | Harus sama persis dengan ID di sheet Outlets |
| `category` | Kategori menu: Makanan Utama / Minuman / Camilan / dll |
| `item_name` | Nama menu |
| `price` | Harga (angka saja, tanpa Rp) |
| `description` | Deskripsi singkat |
| `image_url` | URL foto menu (Google Drive). Bisa beberapa, pisah koma |

---

## 💻 Development Lokal

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # build production
npm run preview    # preview build lokal
```
