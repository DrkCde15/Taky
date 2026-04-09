import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import AdminPanel from './pages/AdminPanel';
import Invite from './pages/Invite';
import CalendarView from './pages/CalendarView';



function PrivateRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  return user?.role === 'admin' ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/invite" element={<Invite />} />

        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/teams" 
          element={
            <PrivateRoute>
              <Teams />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <PrivateRoute>
              <CalendarView />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
