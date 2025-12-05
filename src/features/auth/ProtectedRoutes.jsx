import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, loading, role: userRole } = useSelector((s) => s.auth)

  if (loading) {
    return <div style={{ padding: 20 }}>Checking authentication...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role && userRole !== role) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    )
  }

  return children
}
