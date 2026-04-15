import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Signup from './auth/SignUp';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';
import './App.css';
import AdminSignup from './auth/AdminSignUp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminSignup />} />


        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/adminDashboard" element={
            <ProtectedRoute >
              <AdminDashboard />
            </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;