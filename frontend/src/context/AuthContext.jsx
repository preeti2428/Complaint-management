import { createContext, useContext, useMemo, useState } from 'react'
import { loginRequest, registerRequest } from '../services/auth'

const AuthContext = createContext(null)
const STORAGE_KEY = 'scms_auth'

const loadStoredAuth = () => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => loadStoredAuth())

  const login = async (payload) => {
    const data = await loginRequest(payload)
    const nextAuth = { token: data.token, user: data.user }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth))
    setAuth(nextAuth)
    return data
  }

  const register = async (payload) => {
    const data = await registerRequest(payload)
    const nextAuth = { token: data.token, user: data.user }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth))
    setAuth(nextAuth)
    return data
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setAuth(null)
  }

  const value = useMemo(
    () => ({
      user: auth?.user || null,
      token: auth?.token || null,
      isAuthenticated: Boolean(auth?.token),
      login,
      register,
      logout,
    }),
    [auth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
