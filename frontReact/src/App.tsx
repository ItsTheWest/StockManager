import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Dashboard } from './pages/dashboard';
import { Products } from './pages/products';
import { Inventory } from './pages/inventory';
import { Categorias } from './pages/categories';
import { Providers } from './pages/providers';
import { AddProviders } from './pages/addproviders';
import { EditProducts } from './pages/editproducts';
import { EditProviders } from './pages/editproviders';
import { Notifications } from './pages/notifications';
import { Billing } from './pages/billing';
import { Chatbot } from './pages/chatbot';
import { Estadistics } from './pages/estadistics';

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
        <Route path="/editproducts" element={<EditProducts />} />
        <Route path="/editproviders" element={<EditProviders />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/estadistics" element={<Estadistics />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;