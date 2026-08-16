/**
 * Central type definitions for Pother Dake Mobile
 */

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'PASSENGER' | 'DRIVER' | 'ADMIN';
  rating?: number;
  completedRides?: number;
  joinedDate?: string;
}

export interface Driver extends User {
  vehicleType?: string;
  vehicleColor?: string;
  vehicleNumber?: string;
  licenseNumber?: string;
  totalTrips?: number;
  // verification status used by admin flows
  verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Passenger extends User {
  preferredPaymentMethod?: string;
  totalBookings?: number;
}

export interface Trip {
  id: string;
  driverId: string;
  driver: Driver;
  origin: Location;
  destination: Location;
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // HH:MM
  estimatedArrivalTime?: string; // HH:MM
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  description?: string;
  vehicleType?: string;
  preferences?: {
    ac?: boolean;
    music?: boolean;
    luggage?: boolean;
    pets?: boolean;
    smoking?: boolean;
    helmet?: boolean;
    womenOnly?: boolean;
    maxLuggageWeight?: number;
  };
  createdAt: string;
  passengers: Booking[];
}

export interface Booking {
  id: string;
  tripId: string;
  passengerId: string;
  passenger?: Passenger;
  seatsBooked: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  bookingDate: string;
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  tokenLoaded: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Messaging types
export interface Message {
  id: string;
  conversationId: string;
  fromUserId: string;
  text: string;
  timestamp: string; // ISO
  read?: boolean;
}

export interface Conversation {
  id: string;
  participants: string[]; // user ids
  messages: Message[];
}

// Wallet / Payments
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'CHARGE' | 'PAYOUT' | 'REFUND';
  date: string;
  bookingId?: string;
  status?: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export interface Wallet {
  userId: string;
  balance: number;
}
