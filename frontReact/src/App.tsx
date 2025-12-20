import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Dashboard } from './pages/dashboard';
import { Products } from './pages/products';
import { Inventory } from './pages/inventory';
import { Categorias } from './pages/categories';
import { Providers } from './pages/providers';
import { AddProviders } from './pages/addproviders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addproducts" element={<Products />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/categories" element={<Categorias />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/addproviders" element={<AddProviders />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;