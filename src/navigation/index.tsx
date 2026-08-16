import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../auth/AuthContext';
import { ActivityIndicator, View as RNView } from 'react-native';

// Auth Screens
import AuthScreen from '../screens/Auth';
import CompleteRegistration from '../screens/CompleteRegistration';

// App Screens
import LandingScreen from '../screens/Landing';
import SearchResults from '../screens/SearchResults';
import TripDetails from '../screens/TripDetails';
import PassengerDashboard from '../screens/PassengerDashboard';
import DriverDashboard from '../screens/DriverDashboard';
import AdminDashboard from '../screens/AdminDashboard';
import CreateTrip from '../screens/CreateTrip';
import ProfileScreen from '../screens/Profile';
import BookingHistoryScreen from '../screens/BookingHistory';
import MyTripsScreen from '../screens/MyTrips';

// New screens added for feature parity
import PassengerWallet from '../screens/PassengerWallet';
import Messages from '../screens/Messages';
import DriverEarnings from '../screens/DriverEarnings';
import DriverVerification from '../screens/DriverVerification';
import AdminUsers from '../screens/AdminUsers';
import AdminDrivers from '../screens/AdminDrivers';
import AdminBookings from '../screens/AdminBookings';
import AdminPayments from '../screens/AdminPayments';
import AdminReports from '../screens/AdminReports';
import AdminComplaints from '../screens/AdminComplaints';

export type RootStackParamList = {
  // Auth
  Auth: undefined;
  CompleteRegistration: undefined;
  // App
  Landing: undefined;
  Search: undefined;
  TripDetails: { id?: string };
  Passenger: undefined;
  Driver: undefined;
  Admin: undefined;
  CreateTrip: undefined;
  Profile: undefined;
  BookingHistory: undefined;
  MyTrips: undefined;
  // New
  Wallet: undefined;
  Messages: undefined;
  Earnings: undefined;
  Verification: undefined;
  AdminUsers: undefined;
  AdminDrivers: undefined;
  AdminBookings: undefined;
  AdminPayments: undefined;
  AdminReports: undefined;
  AdminComplaints: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="CompleteRegistration" component={CompleteRegistration} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Search" component={SearchResults} />
      <Stack.Screen name="TripDetails" component={TripDetails} />
      <Stack.Screen name="Passenger" component={PassengerDashboard} />
      <Stack.Screen name="Driver" component={DriverDashboard} />
      <Stack.Screen name="Admin" component={AdminDashboard} />
      <Stack.Screen name="CreateTrip" component={CreateTrip} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} />
      <Stack.Screen name="MyTrips" component={MyTripsScreen} />

      {/* New screens */}
      <Stack.Screen name="Wallet" component={PassengerWallet} />
      <Stack.Screen name="Messages" component={Messages} />
      <Stack.Screen name="Earnings" component={DriverEarnings} />
      <Stack.Screen name="Verification" component={DriverVerification} />

      {/* Admin sub-screens */}
      <Stack.Screen name="AdminUsers" component={AdminUsers} />
      <Stack.Screen name="AdminDrivers" component={AdminDrivers} />
      <Stack.Screen name="AdminBookings" component={AdminBookings} />
      <Stack.Screen name="AdminPayments" component={AdminPayments} />
      <Stack.Screen name="AdminReports" component={AdminReports} />
      <Stack.Screen name="AdminComplaints" component={AdminComplaints} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { user, tokenLoaded } = useAuth();

  if (!tokenLoaded) {
    return (
      <RNView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </RNView>
    );
  }

  return user ? <AppNavigator /> : <AuthNavigator />;
}
