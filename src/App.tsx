// src/App.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Generator } from './pages/Generator';
import  Login  from '../src/components/Login';
import Signup from '../src/components/Signup'
import { AuthProvider } from '../src/contexts/AuthContext'
import PrivateRoutes from '../src/components/PrivateRoutes'
import ForgotPassword from '../src/components/ForgotPassword'
import UpdateProfile from '../src/components/UpdateProfile'
import Projects from '../src/components/Projects'
import { ToastProvider } from '../src/contexts/ToastContext'
import { ApiProvider } from '../src/contexts/ApiContext'
import AppContextProviders from '../src/contexts/AppContextProvider'







function App() {
  const providers = [ToastProvider, AuthProvider, ApiProvider]
  return (
    <Router>
      <AppContextProviders components={providers}>
        <Routes>
        <Route element={<PrivateRoutes />}>
          
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="projects" element={<Projects />} />
        </Route>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </AppContextProviders>
    </Router>
  );
}

export default App;