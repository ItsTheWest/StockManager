import  {BrowserRouter, Route, Routes,  } from 'react-router-dom';
import {login} from './assets/pages/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<login/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;