import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Login'
import Register from './components/Register'
import GroupList from './components/GroupList'
import ChatLayout from './components/ChatLayout'
import './App.css'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function RootRedirect() {
  const { user } = useAuth()
  return <Navigate to={user ? '/groups' : '/login'} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/groups" element={<PrivateRoute><GroupList /></PrivateRoute>} />
      <Route path="/chat/:type/:id" element={<PrivateRoute><ChatLayout /></PrivateRoute>} />
      <Route path="/" element={<RootRedirect />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
