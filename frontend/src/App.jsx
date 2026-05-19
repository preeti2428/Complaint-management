import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import MainLayout from './layout/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ComplaintForm from './pages/ComplaintForm'
import ComplaintList from './pages/ComplaintList'
import ComplaintDetail from './pages/ComplaintDetail'
import AiAssistant from './pages/AiAssistant'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/complaints" element={<ComplaintList />} />
              <Route path="/complaints/new" element={<ComplaintForm />} />
              <Route path="/complaints/:id" element={<ComplaintDetail />} />
              <Route path="/assistant" element={<AiAssistant />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
