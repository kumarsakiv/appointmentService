import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from './features/auth/authSlice'
import ProtectedRoute from './features/auth/protectedRoutes'
import BookingsPage from './features/booking/BookingsPage'

function Agent() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Agent Dashboard</h1>
    </div>
  )
}


function Home(){
  return <div>Home</div>
}
function Admin(){
  return <div>Admin</div>
}
function Customer(){
  return<div>Customer</div>
}
function LoginPage() {
  const dispatch = useDispatch()
  const auth = useSelector((s) => s.auth)

  function doLogin(role) {
    // dispatch synchronous login action we created earlier
    dispatch(login({ user: 'Vikas', role }))
    // optional dev-only persistence:
    localStorage.setItem('auth', JSON.stringify({ user: 'Vikas', role }))
  }

  function doLogout() {
    dispatch(logout())
    localStorage.removeItem('auth')
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      {/* Buttons to simulate logging in as different roles */}
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => doLogin('admin')}>Login as Admin</button>
        <button onClick={() => doLogin('agent')} style={{ marginLeft: 8 }}>Login as Agent</button>
        <button onClick={() => doLogin('customer')} style={{ marginLeft: 8 }}>Login as Customer</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button onClick={doLogout}>Logout</button>
      </div>

      <div>
        <strong>Current:</strong>{' '}
        {auth.isAuthenticated ? `${auth.user} (${auth.role})` : 'Not logged in'}
      </div>
    </div>
  )
}


function App() {

  return (
    <div>
      <nav style={{padding:"20px"}}>
        <Link to="/" style={{margin:"10px"}}>Home</Link>
        <Link to="/admin" style={{margin:"10px"}}>Admin</Link>
        <Link to="/customer">Customer</Link>
        <Link to="/bookings" style={{ marginLeft: 10 }}>Bookings</Link>

        
        <Link to="/login" style={{ marginLeft: 10 }}>Login</Link>
        <Link to="/agent" style={{ marginLeft: 10 }}>Agent</Link>
      </nav>
     <Routes>
      <Route path="/bookings" element={<BookingsPage />} />

  <Route path="/" element={<Home />} />
  <Route path="/login" element={<LoginPage />} />

  <Route
    path="/admin"
    element={
      <ProtectedRoute role="admin">
        <Admin />
      </ProtectedRoute>
    }
  />

  <Route
    path="/agent"
    element={
      <ProtectedRoute role="agent">
        <Agent />
      </ProtectedRoute>
    }
  />

  <Route
    path="/customer"
    element={
      <ProtectedRoute role="customer">
        <Customer />
      </ProtectedRoute>
    }
  />
</Routes>

    

    </div>
  )
}

export default App