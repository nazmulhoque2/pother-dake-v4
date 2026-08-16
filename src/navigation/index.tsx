import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
import { ActivityIndicator, View as RNView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Auth
import AuthScreen from '../screens/Auth';
import CompleteRegistration from '../screens/CompleteRegistration';

// Passenger
import PassengerDashboard from '../screens/PassengerDashboard';
import SearchResults from '../screens/SearchResults';
import TripDetails from '../screens/TripDetails';
import BookingHistory from '../screens/BookingHistory';
import Profile from '../screens/Profile';
import Wallet from '../screens/PassengerWallet';
import MessagesList from '../screens/MessagesList';
import Conversation from '../screens/Conversation';

// Driver
import DriverDashboard from '../screens/DriverDashboard';
import CreateTrip from '../screens/CreateTrip';
import MyTrips from '../screens/MyTrips';
import Earnings from '../screens/DriverEarnings';
import Verification from '../screens/DriverVerification';

// Admin
import AdminDashboard from '../screens/AdminDashboard';
import AdminUsers from '../screens/AdminUsers';
import AdminDrivers from '../screens/AdminDrivers';
import AdminBookings from '../screens/AdminBookings';
import AdminPayments from '../screens/AdminPayments';
import AdminReports from '../screens/AdminReports';
import AdminComplaints from '../screens/AdminComplaints';

export type RootStackParamList = {
  Auth: undefined;
  CompleteRegistration: undefined;
  // Tabs containers
  PassengerTabs: undefined;
  DriverTabs: undefined;
  AdminTabs: undefined;
  // Shared nested screens
  TripDetails: { id?: string };
  BookingHistory: undefined;
  Profile: undefined;
  Wallet: undefined;
  MessagesList: undefined;
  Conversation: { id: string };
  // Driver nested
  CreateTrip: undefined;
  MyTrips: undefined;
  Earnings: undefined;
  Verification: undefined;
  // Admin nested
  AdminUsers: undefined;
  AdminDrivers: undefined;
  AdminBookings: undefined;
  AdminPayments: undefined;
  AdminReports: undefined;
  AdminComplaints: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function PassengerTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="PassengerHome" component={PassengerDashboard} options={{ title: 'Home' as any }} />
      <Tab.Screen name="Search" component={SearchResults} options={{ title: 'Search' as any }} />
      <Tab.Screen name="MessagesList" component={MessagesList} options={{ title: 'Messages' as any }} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profile' as any }} />
    </Tab.Navigator>
  );
}

function DriverTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="DriverHome" component={DriverDashboard} options={{ title: 'Home' as any }} />
      <Tab.Screen name="MyTrips" component={MyTrips} options={{ title: 'My Trips' as any }} />
      <Tab.Screen name="CreateTrip" component={CreateTrip} options={{ title: 'Create' as any }} />
      <Tab.Screen name="MessagesList" component={MessagesList} options={{ title: 'Messages' as any }} />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="AdminHome" component={AdminDashboard} options={{ title: 'Home' as any }} />
      <Tab.Screen name="AdminBookings" component={AdminBookings} options={{ title: 'Bookings' as any }} />
      <Tab.Screen name="AdminReports" component={AdminReports} options={{ title: 'Reports' as any }} />
      <Tab.Screen name="AdminDrivers" component={AdminDrivers} options={{ title: 'Drivers' as any }} />
    </Tab.Navigator>
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

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="CompleteRegistration" component={CompleteRegistration} />
      </Stack.Navigator>
    );
  }

  if (user.role === 'PASSENGER') {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PassengerTabs" component={PassengerTabs} />
        <Stack.Screen name="TripDetails" component={TripDetails} />
        <Stack.Screen name="BookingHistory" component={BookingHistory} />
        <Stack.Screen name="Wallet" component={Wallet} />
        <Stack.Screen name="Conversation" component={Conversation} />
      </Stack.Navigator>
    );
  }

  if (user.role === 'DRIVER') {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DriverTabs" component={DriverTabs} />
        <Stack.Screen name="CreateTrip" component={CreateTrip} />
        <Stack.Screen name="TripDetails" component={TripDetails} />
        <Stack.Screen name="Earnings" component={Earnings} />
        <Stack.Screen name="Verification" component={Verification} />
        <Stack.Screen name="Conversation" component={Conversation} />
      </Stack.Navigator>
    );
  }

  // Admin
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
      <Stack.Screen name="AdminUsers" component={AdminUsers} />
      <Stack.Screen name="AdminDrivers" component={AdminDrivers} />
      <Stack.Screen name="AdminPayments" component={AdminPayments} />
      <Stack.Screen name="AdminComplaints" component={AdminComplaints} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}
