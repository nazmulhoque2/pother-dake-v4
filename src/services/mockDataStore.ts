/**
 * Centralized Mock Data Store for Pother Dake Mobile
 * Provides realistic test data for all application flows
 */

import { User, Driver, Passenger, Trip, Booking, Location, Conversation, Message, Transaction, Wallet } from '../types';

// Sample locations in Bangladesh (realistic for Pother Dake)
const LOCATIONS = {
  dhaka_center: { name: 'Dhaka City Center', latitude: 23.8103, longitude: 90.4125 },
  gulshan: { name: 'Gulshan', latitude: 23.7973, longitude: 90.4243 },
  dhanmondi: { name: 'Dhanmondi', latitude: 23.7479, longitude: 90.3667 },
  mirpur: { name: 'Mirpur', latitude: 23.8147, longitude: 90.3658 },
  airport: { name: 'Hazrat Shahjalal Airport', latitude: 23.8411, longitude: 90.4062 },
  uttara: { name: 'Uttara', latitude: 23.8763, longitude: 90.3659 },
  banani: { name: 'Banani', latitude: 23.8288, longitude: 90.4108 },
  baridhara: { name: 'Baridhara', latitude: 23.8074, longitude: 90.4378 },
  ramna: { name: 'Ramna Park', latitude: 23.7562, longitude: 90.4151 },
  bashundhara: { name: 'Bashundhara', latitude: 23.8012, longitude: 90.4465 },
} as const;

// Mock Users/Drivers
export const mockDrivers: Driver[] = [
  {
    id: 'd1',
    name: 'Ashraf Khan',
    email: 'ashraf.khan@potherdake.com',
    phone: '+8801712345678',
    avatar: '👨',
    role: 'DRIVER',
    rating: 4.9,
    completedRides: 847,
    joinedDate: '2022-03-15',
    vehicleType: 'Toyota Prius',
    vehicleColor: 'Silver',
    vehicleNumber: 'DH-23-4567',
    licenseNumber: 'LIC-123456',
    totalTrips: 847,
    verificationStatus: 'APPROVED',
  },
  {
    id: 'd2',
    name: 'Md Rana',
    email: 'rana.driver@potherdake.com',
    phone: '+8801798765432',
    avatar: '👨',
    role: 'DRIVER',
    rating: 4.7,
    completedRides: 542,
    joinedDate: '2022-07-22',
    vehicleType: 'Hyundai i10',
    vehicleColor: 'Black',
    vehicleNumber: 'DH-24-1234',
    licenseNumber: 'LIC-789012',
    totalTrips: 542,
    verificationStatus: 'PENDING',
  },
  {
    id: 'd3',
    name: 'Fatima Begum',
    email: 'fatima.driver@potherdake.com',
    phone: '+8801856789012',
    avatar: '👩',
    role: 'DRIVER',
    rating: 4.8,
    completedRides: 623,
    joinedDate: '2022-05-10',
    vehicleType: 'Suzuki Swift',
    vehicleColor: 'Red',
    vehicleNumber: 'DH-25-5678',
    licenseNumber: 'LIC-345678',
    totalTrips: 623,
    verificationStatus: 'APPROVED',
  },
  {
    id: 'd4',
    name: 'Karim Hassan',
    email: 'karim.driver@potherdake.com',
    phone: '+8801923456789',
    avatar: '👨',
    role: 'DRIVER',
    rating: 4.5,
    completedRides: 421,
    joinedDate: '2023-01-08',
    vehicleType: 'Toyota Noah',
    vehicleColor: 'White',
    vehicleNumber: 'DH-26-9012',
    licenseNumber: 'LIC-567890',
    totalTrips: 421,
    verificationStatus: 'REJECTED',
  },
];

// Mock Users/Passengers
export const mockPassengers: Passenger[] = [
  {
    id: 'p1',
    name: 'Samir Ahmed',
    email: 'samir@example.com',
    phone: '+8801634567890',
    avatar: '👨',
    role: 'PASSENGER',
    rating: 4.6,
    totalBookings: 23,
    joinedDate: '2023-02-10',
    preferredPaymentMethod: 'CARD',
  },
  {
    id: 'p2',
    name: 'Nadia Hossain',
    email: 'nadia@example.com',
    phone: '+8801745678901',
    avatar: '👩',
    role: 'PASSENGER',
    rating: 4.8,
    totalBookings: 56,
    joinedDate: '2022-11-05',
    preferredPaymentMethod: 'CASH',
  },
  {
    id: 'p3',
    name: 'Tariq Mahmud',
    email: 'tariq@example.com',
    phone: '+8801856789012',
    avatar: '👨',
    role: 'PASSENGER',
    rating: 4.3,
    totalBookings: 12,
    joinedDate: '2023-05-20',
    preferredPaymentMethod: 'CARD',
  },
];

// Mock Admin
export const mockAdmin: User = {
  id: 'admin1',
  name: 'Admin Dashboard',
  email: 'admin@potherdake.com',
  phone: '+8801900000000',
  avatar: '👤',
  role: 'ADMIN',
  rating: 5.0,
};

// Mock Trips
export const mockTrips: Trip[] = [
  {
    id: 'trip1',
    driverId: 'd1',
    driver: mockDrivers[0],
    origin: LOCATIONS.dhaka_center,
    destination: LOCATIONS.airport,
    departureDate: '2026-08-16',
    departureTime: '08:00',
    estimatedArrivalTime: '09:15',
    totalSeats: 4,
    availableSeats: 2,
    pricePerSeat: 450,
    status: 'SCHEDULED',
    description: 'Comfortable journey to airport',
    vehicleType: 'Toyota Prius',
    createdAt: '2026-08-15T10:00:00Z',
    passengers: [
      {
        id: 'booking1',
        tripId: 'trip1',
        passengerId: 'p1',
        passenger: mockPassengers[0],
        seatsBooked: 2,
        status: 'CONFIRMED',
        bookingDate: '2026-08-15T11:00:00Z',
        paymentStatus: 'PAID',
      },
    ],
    preferences: {
      ac: true,
      music: true,
      luggage: true,
      pets: false,
      smoking: false,
      maxLuggageWeight: 15,
    },
  },
  // other trips omitted for brevity (same as prior)
];

// Mock dashboard stats
export const mockStats = {
  totalRides: 5432,
  todayRides: 18,
  revenueToday: '৳ 12,450',
  activeUsers: 2341,
};

// Mock completed trips (for history)
export const mockCompletedTrips: Trip[] = [
  {
    id: 'trip-completed-1',
    driverId: 'd1',
    driver: mockDrivers[0],
    origin: LOCATIONS.dhaka_center,
    destination: LOCATIONS.gulshan,
    departureDate: '2026-08-14',
    departureTime: '09:00',
    estimatedArrivalTime: '10:00',
    totalSeats: 4,
    availableSeats: 0,
    pricePerSeat: 200,
    status: 'COMPLETED',
    description: 'Completed trip',
    vehicleType: 'Toyota Prius',
    createdAt: '2026-08-14T08:00:00Z',
    passengers: [
      {
        id: 'booking-c1',
        tripId: 'trip-completed-1',
        passengerId: 'p1',
        passenger: mockPassengers[0],
        seatsBooked: 2,
        status: 'COMPLETED',
        bookingDate: '2026-08-14T08:15:00Z',
        paymentStatus: 'PAID',
      },
      {
        id: 'booking-c2',
        tripId: 'trip-completed-1',
        passengerId: 'p2',
        passenger: mockPassengers[1],
        seatsBooked: 2,
        status: 'COMPLETED',
        bookingDate: '2026-08-14T08:30:00Z',
        paymentStatus: 'PAID',
      },
    ],
    preferences: {
      ac: true,
      music: true,
      luggage: true,
    },
  },
];

// Mock conversations/messages
const nowIso = new Date().toISOString();
const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participants: ['p1', 'd1'],
    messages: [
      { id: 'm1', conversationId: 'conv1', fromUserId: 'd1', text: 'Hi Samir, I will pick you up near the main gate.', timestamp: nowIso, read: false },
      { id: 'm2', conversationId: 'conv1', fromUserId: 'p1', text: 'Thanks! See you then.', timestamp: nowIso, read: true },
    ],
  },
  {
    id: 'conv2',
    participants: ['p2', 'd3'],
    messages: [],
  },
];

// Mock transactions and wallets
const mockTransactions: Transaction[] = [
  { id: 'tx1', userId: 'p1', amount: 900, type: 'CHARGE', date: nowIso, bookingId: 'booking1', status: 'COMPLETED' },
  { id: 'tx2', userId: 'p2', amount: 640, type: 'CHARGE', date: nowIso, bookingId: 'booking3', status: 'COMPLETED' },
];

const mockWallets: Wallet[] = [
  { userId: 'p1', balance: 200 },
  { userId: 'p2', balance: 0 },
];

// Export all mock data
export const mockDataStore = {
  drivers: mockDrivers,
  passengers: mockPassengers,
  admin: mockAdmin,
  trips: mockTrips,
  completedTrips: mockCompletedTrips,
  stats: mockStats,
  locations: LOCATIONS,
  conversations: mockConversations,
  transactions: mockTransactions,
  wallets: mockWallets,
};

export default mockDataStore;
