// src/features/booking/bookingsApi.js
// Simple mock bookings API backed by localStorage for Day 3 learning.

const STORAGE_KEY = "mock_bookings_v1";

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function writeStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// create initial sample data if empty
if (!localStorage.getItem(STORAGE_KEY)) {
  writeStore([
    {
      id: 1,
      customer: "Alice",
      service: "Phone Support",
      time: "2025-12-05 10:00",
    },
    {
      id: 2,
      customer: "Bob",
      service: "In-store Pickup",
      time: "2025-12-05 11:00",
    },
  ]);
}

/**
 * Simulate network delay
 */
function delay(ms = 400) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function fetchBookings() {
  await delay(400); // simulate network
  return readStore();
}

export async function createBooking(payload) {
  await delay(400); // simulate network
  const list = readStore();
  const id = list.length ? Math.max(...list.map((b) => b.id)) + 1 : 1;
  const newB = { id, ...payload };
  list.push(newB);
  writeStore(list);
  return newB;
}

export async function deleteBooking(id) {
  await delay(300);
  let list = readStore();
  list = list.filter((b) => b.id !== id);
  writeStore(list);
  return { success: true };
}
