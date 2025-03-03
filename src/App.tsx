// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Generator } from './pages/Generator';
import { Login } from './pages/Login';
import { AuthProvider } from './firebase/AuthContext';
import { ProtectedRoute } from './firebase/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/generator" 
            element={
              <ProtectedRoute>
                <Generator />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;