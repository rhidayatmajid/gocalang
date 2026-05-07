import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import OutletDetail from './pages/OutletDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/outlet/:id" element={<OutletDetail />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
