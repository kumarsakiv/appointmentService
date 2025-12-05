// src/features/booking/BookingsPage.jsx
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchBookings, createBooking, deleteBooking } from './bookingsApi'

export default function BookingsPage() {
  const qc = useQueryClient()

  // useQuery in v5 uses object signature
  const { data: bookings, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
    staleTime: 1000 * 30, // 30s
  })

  // useMutation still works similarly; keep options as object
// inside BookingsPage component, replace existing createMut & deleteMut with:

const createMut = useMutation({
  mutationFn: createBooking,
  // optimistic update
  onMutate: async (newBooking) => {
    // cancel any outgoing refetches so they don't overwrite our optimistic update
    await qc.cancelQueries({ queryKey: ['bookings'] })

    // snapshot previous value
    const previous = qc.getQueryData({ queryKey: ['bookings'] })

    // create a temporary id (negative to avoid clash)
    const tempId = Math.floor(Math.random() * -1000000)

    // optimistically update the cache
    qc.setQueryData({ queryKey: ['bookings'] }, (old = []) => [
      ...old,
      { id: tempId, ...newBooking },
    ])

    // return context for rollback
    return { previous, tempId }
  },
  onError: (err, newBooking, context) => {
    // rollback to previous value
    qc.setQueryData({ queryKey: ['bookings'] }, context?.previous || [])
    alert('Failed to create booking — rolled back.')
  },
  onSettled: () => {
    // always refetch fresh data from the "server"
    qc.invalidateQueries({ queryKey: ['bookings'] })
  },
})

const deleteMut = useMutation({
  mutationFn: deleteBooking,
  onMutate: async (id) => {
    await qc.cancelQueries({ queryKey: ['bookings'] })
    const previous = qc.getQueryData({ queryKey: ['bookings'] })

    // optimistically remove
    qc.setQueryData({ queryKey: ['bookings'] }, (old = []) =>
      old.filter(b => b.id !== id)
    )

    return { previous }
  },
  onError: (err, id, context) => {
    // rollback
    qc.setQueryData({ queryKey: ['bookings'] }, context?.previous || [])
    alert('Failed to delete booking — rolled back.')
  },
  onSettled: () => {
    qc.invalidateQueries({ queryKey: ['bookings'] })
  },
})


  // local form state
  const [customer, setCustomer] = useState('')
  const [service, setService] = useState('')
  const [time, setTime] = useState('')

  async function handleCreate(e) {
    e.preventDefault()
    if (!customer || !service || !time) return alert('Fill all fields')
    await createMut.mutateAsync({ customer, service, time })
    setCustomer(''); setService(''); setTime('')
  }

  function handleDelete(id) {
    if (!confirm('Delete booking?')) return
    deleteMut.mutate(id)
  }

  if (isLoading) return <div style={{ padding: 20 }}>Loading bookings...</div>
  if (isError) return <div style={{ padding: 20, color: 'red' }}>Error: {String(error)}</div>

  return (
    <div style={{ padding: 20 }}>
      <h1>Bookings</h1>

      <form onSubmit={handleCreate} style={{ marginBottom: 16 }}>
        <input placeholder="Customer" value={customer} onChange={e => setCustomer(e.target.value)} />
        <input placeholder="Service" value={service} onChange={e => setService(e.target.value)} style={{ marginLeft: 8 }} />
        <input placeholder="Time" value={time} onChange={e => setTime(e.target.value)} style={{ marginLeft: 8 }} />
        <button type="submit" style={{ marginLeft: 8 }}>Create</button>
      </form>

      <div style={{ marginBottom: 8 }}>
        {createMut.isLoading && <small>Creating booking...</small>}
        {deleteMut.isLoading && <small>Deleting booking...</small>}
        {isFetching && <small style={{ marginLeft: 8 }}>Refreshing...</small>}
      </div>

      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr><th>ID</th><th>Customer</th><th>Service</th><th>Time</th><th>Action</th></tr>
        </thead>
        <tbody>
          {bookings && bookings.length ? bookings.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.customer}</td>
              <td>{b.service}</td>
              <td>{b.time}</td>
              <td>
                <button onClick={() => handleDelete(b.id)} disabled={deleteMut.isLoading}>Delete</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="5">No bookings</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
