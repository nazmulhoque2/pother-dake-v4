/**
 * Mock Data Source Implementation
 * Provides all data operations using in-memory mock data
 * No network calls, suitable for offline development/testing
 */

import { Trip, Booking, User, Driver, Passenger, Message, Conversation, Wallet, Transaction } from '../types';
import { IDataSource } from './Repository';
import mockDataStore from '../services/mockDataStore';

// In-memory storage for state changes during session
let mockTrips = JSON.parse(JSON.stringify(mockDataStore.trips)) as Trip[];

// Build a single source-of-truth bookings array derived from trips' passengers.
let mockBookings: Booking[] = [];

// Initialize mockBookings from mockTrips once
(() => {
  try {
    mockBookings = mockTrips.flatMap((trip: Trip) => {
      const passengers = Array.isArray(trip.passengers) ? trip.passengers : [];
      return passengers.map((b: Booking) => ({ ...b, tripId: trip.id }));
    });
  } catch (e) {
    mockBookings = [];
  }
})();

let mockUsers = JSON.parse(JSON.stringify(mockDataStore.passengers)) as Passenger[];

// Messaging and transactions
let mockConversations = JSON.parse(JSON.stringify(mockDataStore.conversations || [])) as Conversation[];
let mockTransactions = JSON.parse(JSON.stringify(mockDataStore.transactions || [])) as Transaction[];
let mockWallets = JSON.parse(JSON.stringify(mockDataStore.wallets || [])) as Wallet[];

class MockDataSource implements IDataSource {
  async fetchTrips(): Promise<Trip[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return JSON.parse(JSON.stringify(mockTrips));
  }

  async fetchTripById(id: string): Promise<Trip | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const trip = mockTrips.find((t: Trip) => t.id === id);
    return trip ? JSON.parse(JSON.stringify(trip)) : null;
  }

  async createTrip(tripData: Omit<Trip, 'id' | 'createdAt'>): Promise<Trip> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}`,
      createdAt: new Date().toISOString(),
    } as Trip;

    mockTrips.push(newTrip);
    return JSON.parse(JSON.stringify(newTrip));
  }

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = mockTrips.findIndex((t: Trip) => t.id === id);
    if (index === -1) throw new Error('Trip not found');

    mockTrips[index] = { ...mockTrips[index], ...updates };
    return JSON.parse(JSON.stringify(mockTrips[index]));
  }

  async deleteTrip(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = mockTrips.findIndex((t: Trip) => t.id === id);
    if (index === -1) throw new Error('Trip not found');

    mockTrips.splice(index, 1);

    // Also remove any bookings associated with this trip from mockBookings
    mockBookings = mockBookings.filter(b => b.tripId !== id);
  }

  async bookTrip(tripId: string, passengerId: string, seatsBooked: number): Promise<Booking> {
    await new Promise(resolve => setTimeout(resolve, 350));

    const trip = mockTrips.find((t: Trip) => t.id === tripId);
    if (!trip) throw new Error('Trip not found');

    if (trip.availableSeats < seatsBooked) {
      throw new Error('Not enough seats available');
    }

    // Prevent booking your own trip (drivers cannot book their own trip)
    if (trip.driverId === passengerId) {
      throw new Error('Cannot book your own trip');
    }

    // Check if passenger already has an active booking (non-cancelled)
    const existing = trip.passengers.find(b => b.passengerId === passengerId && b.status !== 'CANCELLED');
    if (existing) {
      throw new Error('Passenger already booked on this trip');
    }

    const booking: Booking = {
      id: `booking-${Date.now()}`,
      tripId,
      passengerId,
      seatsBooked,
      status: 'CONFIRMED',
      bookingDate: new Date().toISOString(),
      paymentStatus: 'PAID',
    } as Booking;

    // Update trip availability and passengers
    trip.availableSeats -= seatsBooked;
    trip.passengers.push(booking);

    // Keep the single source-of-truth booking list in sync
    mockBookings.push(booking);

    // Create a transaction record for the payment
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: passengerId,
      amount: seatsBooked * trip.pricePerSeat,
      type: 'CHARGE',
      date: new Date().toISOString(),
      bookingId: booking.id,
      status: 'COMPLETED',
    };
    mockTransactions.push(tx);

    // Update wallet balance (deduct)
    const wallet = mockWallets.find(w => w.userId === passengerId);
    if (wallet) {
      wallet.balance = Math.max(0, wallet.balance - tx.amount);
    }

    return JSON.parse(JSON.stringify(booking));
  }

  async getBookings(passengerId?: string): Promise<Booking[]> {
    await new Promise(resolve => setTimeout(resolve, 250));

    let bookings = mockBookings;
    if (passengerId) {
      bookings = bookings.filter(b => b.passengerId === passengerId);
    }

    return JSON.parse(JSON.stringify(bookings));
  }

  // Mark booking as CANCELLED but keep record for history
  async cancelBooking(bookingId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const bookingIndex = mockBookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) throw new Error('Booking not found');

    const booking = mockBookings[bookingIndex];
    if (booking.status === 'CANCELLED') return;

    // Mark booking cancelled in booking list
    booking.status = 'CANCELLED';

    // Update trip and trip.passengers entries
    const trip = mockTrips.find((t: Trip) => t.id === booking.tripId);
    if (trip) {
      trip.availableSeats += booking.seatsBooked;
      const tripBooking = trip.passengers.find(b => b.id === bookingId);
      if (tripBooking) {
        tripBooking.status = 'CANCELLED';
      } else {
        // If it wasn't present for some reason, add a cancelled record for history
        trip.passengers.push({ ...booking });
      }
    }

    // Optionally create a refund transaction (mock)
    const refund: Transaction = {
      id: `tx-refund-${Date.now()}`,
      userId: booking.passengerId,
      amount: (booking.seatsBooked || 0) * (trip?.pricePerSeat || 0),
      type: 'REFUND',
      date: new Date().toISOString(),
      bookingId: booking.id,
      status: 'COMPLETED',
    };
    mockTransactions.push(refund);

    // Credit wallet
    const wallet = mockWallets.find(w => w.userId === booking.passengerId);
    if (wallet) {
      wallet.balance += refund.amount;
    }

    // Do not remove booking from mockBookings — keep history
  }

  async getUser(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 200));

    let user = mockUsers.find((u: User) => u.id === id) as User | undefined;
    if (!user) {
      user = mockDataStore.drivers.find(d => d.id === id) as User | undefined;
    }
    if (!user && id === mockDataStore.admin.id) {
      user = mockDataStore.admin as User;
    }

    return user ? JSON.parse(JSON.stringify(user)) : null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300));

    let userIndex = mockUsers.findIndex((u: User) => u.id === id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
      return JSON.parse(JSON.stringify(mockUsers[userIndex]));
    }

    throw new Error('User not found');
  }

  async getDrivers(): Promise<Driver[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return JSON.parse(JSON.stringify(mockDataStore.drivers));
  }

  async getDriverById(id: string): Promise<Driver | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const driver = mockDataStore.drivers.find(d => d.id === id);
    return driver ? JSON.parse(JSON.stringify(driver)) : null;
  }

  async getPassengers(): Promise<Passenger[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return JSON.parse(JSON.stringify(mockDataStore.passengers));
  }

  async getPassengerById(id: string): Promise<Passenger | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const passenger = mockDataStore.passengers.find(p => p.id === id);
    return passenger ? JSON.parse(JSON.stringify(passenger)) : null;
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const passenger = mockDataStore.passengers.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (passenger) {
      return {
        user: JSON.parse(JSON.stringify(passenger)),
        token: `mock-token-${passenger.id}-${Date.now()}`,
      };
    }

    const driver = mockDataStore.drivers.find(d => d.email.toLowerCase() === email.toLowerCase());
    if (driver) {
      return {
        user: JSON.parse(JSON.stringify(driver)),
        token: `mock-token-${driver.id}-${Date.now()}`,
      };
    }

    const admin = mockDataStore.admin;
    if (admin && admin.email.toLowerCase() === email.toLowerCase()) {
      return {
        user: JSON.parse(JSON.stringify(admin)),
        token: `mock-token-${admin.id}-${Date.now()}`,
      };
    }

    // Fallback: create a demo passenger user
    const demoUser: Passenger = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      phone: '+8801700000000',
      role: 'PASSENGER',
      avatar: '👤',
      rating: 4.5,
      totalBookings: 0,
    };

    return {
      user: demoUser,
      token: `mock-token-${demoUser.id}-${Date.now()}`,
    };
  }

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  // Messaging APIs
  async getConversations(userId: string): Promise<Conversation[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const convs = mockConversations.filter(c => c.participants.includes(userId));
    return JSON.parse(JSON.stringify(convs));
  }

  async getConversation(conversationId: string): Promise<Conversation | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const conv = mockConversations.find(c => c.id === conversationId);
    return conv ? JSON.parse(JSON.stringify(conv)) : null;
  }

  async sendMessage(conversationId: string, fromUserId: string, text: string): Promise<Message> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const conv = mockConversations.find(c => c.id === conversationId);
    if (!conv) throw new Error('Conversation not found');

    const msg: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      fromUserId,
      text,
      timestamp: new Date().toISOString(),
      read: false,
    };

    conv.messages.push(msg);

    // mark unread for other participants (simple approach)
    // (in this mock, read flag is per-message only)

    return JSON.parse(JSON.stringify(msg));
  }

  // Wallet / Transactions
  async getWallet(userId: string): Promise<Wallet> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const wallet = mockWallets.find(w => w.userId === userId) || { userId, balance: 0 };
    return JSON.parse(JSON.stringify(wallet));
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const txs = mockTransactions.filter(t => t.userId === userId);
    return JSON.parse(JSON.stringify(txs));
  }

  async createTransaction(txInput: Omit<Transaction, 'id' | 'date'>): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
      ...txInput,
    } as Transaction;
    mockTransactions.push(tx);

    // update wallet
    const wallet = mockWallets.find(w => w.userId === tx.userId);
    if (wallet) {
      if (tx.type === 'PAYOUT') wallet.balance += tx.amount;
      if (tx.type === 'CHARGE') wallet.balance -= tx.amount;
      if (tx.type === 'REFUND') wallet.balance += tx.amount;
    } else {
      mockWallets.push({ userId: tx.userId, balance: tx.type === 'PAYOUT' || tx.type === 'REFUND' ? tx.amount : -tx.amount });
    }

    return JSON.parse(JSON.stringify(tx));
  }

  // Admin actions
  async setDriverVerification(driverId: string, status: 'PENDING' | 'APPROVED' | 'REJECTED'): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const idx = mockDataStore.drivers.findIndex(d => d.id === driverId);
    if (idx === -1) throw new Error('Driver not found');
    mockDataStore.drivers[idx].verificationStatus = status;
  }

  async markPaymentComplete(bookingId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 150));
    // find booking and mark paymentStatus
    const booking = mockBookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');
    booking.paymentStatus = 'PAID';
  }

  // Helper for admin to fetch completed trips fixture
  async getCompletedTrips(): Promise<Trip[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return JSON.parse(JSON.stringify(mockDataStore.completedTrips || []));
  }
}

export default MockDataSource;
