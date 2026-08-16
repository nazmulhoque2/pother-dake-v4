import styled from 'styled-components/native';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, FlatList, SafeAreaView, RefreshControl, KeyboardAvoidingView, Platform } from 'react-native';
import Header from '../components/Header';
import { useAuth } from '../auth/AuthContext';
import repository from '../repository';
import RoleGuard from '../components/RoleGuard';
import { Booking, Trip } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Passenger'>;

const Container = styled.View`
  flex: 1;
  background-color: ${p => p.theme.colors.background};
`;

const Content = styled.ScrollView`
  padding: 16px;
`;

const WelcomeCard = styled.View`
  background-color: #2563eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
`;

const WelcomeTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
`;

const WelcomeSubtitle = styled.Text`
  font-size: 14px;
  color: #dbeafe;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
  margin-top: 16px;
`;

const QuickStatsContainer = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 16px;
`;

const StatCard = styled.View`
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 14px;
  border-width: 1px;
  border-color: #e5e7eb;
  align-items: center;
`;

const StatNumber = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #2563eb;
`;

const StatLabel = styled.Text`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
`;

const BookingCard = styled.View`
  background-color: #fff;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const BookingTitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 6px;
`;

const BookingDetail = styled.Text`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 3px;
`;

const QuickActionsContainer = styled.View`
  margin-top: 20px;
  gap: 10px;
`;

const ActionButton = styled.TouchableOpacity<{ variant?: string }>`
  background-color: ${p => p.variant === 'secondary' ? '#f3f4f6' : '#2563eb'};
  padding: 12px;
  border-radius: 8px;
  border-width: ${p => p.variant === 'secondary' ? '1px' : '0px'};
  border-color: ${p => p.variant === 'secondary' ? '#e5e7eb' : 'transparent'};
  align-items: center;
`;

const ActionButtonText = styled.Text<{ variant?: string }>`
  font-weight: 600;
  font-size: 14px;
  color: ${p => p.variant === 'secondary' ? '#374151' : '#fff'};
`;

const EmptyStateContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding: 40px 16px;
`;

const EmptyStateText = styled.Text`
  font-size: 16px;
  color: #9ca3af;
  text-align: center;
  margin-bottom: 16px;
`;

const LoadingView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

interface BookingWithTrip extends Booking {
  tripData?: Trip;
}

function PassengerDashboardInner({ navigation }: Props) {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<BookingWithTrip[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      if (!user) {
        setLoading(false);
        return;
      }

      const [bookingList, tripList] = await Promise.all([
        repository.getBookings(user.id),
        repository.fetchTrips(),
      ]);

      // Enrich bookings with trip data
      const enrichedBookings = bookingList.map(booking => ({
        ...booking,
        tripData: tripList.find(t => t.id === booking.tripId),
      }));

      setBookings(enrichedBookings);
      setTrips(tripList);
    } catch (err: any) {
      const msg = err?.message || 'Failed to load data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  }, [user?.id]);

  const getUpcomingBookings = (): BookingWithTrip[] => {
    const now = new Date();
    return bookings.filter(booking => {
      const trip = booking.tripData;
      if (!trip || booking.status === 'CANCELLED') return false;
      const tripDate = new Date(`${trip.departureDate}T${trip.departureTime}`);
      return tripDate > now;
    });
  };

  const upcomingBookings = getUpcomingBookings();
  const upcomingCount = upcomingBookings.length;

  const renderBookingItem = useCallback(({ item }: { item: BookingWithTrip }) => (
    <BookingCard>
      <BookingTitle>
        {item.tripData?.origin.name} → {item.tripData?.destination.name}
      </BookingTitle>
      <BookingDetail>📅 {item.tripData?.departureDate}</BookingDetail>
      <BookingDetail>🕐 {item.tripData?.departureTime}</BookingDetail>
      <BookingDetail>👨 Driver: {item.tripData?.driver.name}</BookingDetail>
      <BookingDetail>💵 Total: ৳{(item.tripData?.pricePerSeat || 0) * item.seatsBooked}</BookingDetail>
    </BookingCard>
  ), []);

  if (loading) {
    return (
      <>
        <Header navigation={navigation} title="Dashboard" />
        <LoadingView>
          <ActivityIndicator size="large" color="#2563eb" />
        </LoadingView>
      </>
    );
  }

  return (
    <>
      <Header navigation={navigation} title="Dashboard" />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Container>
            <Content
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
              {/* Welcome Card */}
              <WelcomeCard>
                <WelcomeTitle>Welcome, {user?.name}! 👋</WelcomeTitle>
                <WelcomeSubtitle>Find and book your next ride</WelcomeSubtitle>
              </WelcomeCard>

              {/* Error state */}
              {error ? (
                <EmptyStateContainer>
                  <EmptyStateText>{error}</EmptyStateText>
                  <ActionButton onPress={onRefresh} accessible accessibilityLabel="Retry">
                    <ActionButtonText>Retry</ActionButtonText>
                  </ActionButton>
                </EmptyStateContainer>
              ) : (
                <>
                  {/* Quick Stats */}
                  <QuickStatsContainer>
                    <StatCard>
                      <StatNumber>{upcomingCount}</StatNumber>
                      <StatLabel>Upcoming Rides</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatNumber>{bookings.length}</StatNumber>
                      <StatLabel>Total Bookings</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatNumber>⭐ {user?.rating || 0}</StatNumber>
                      <StatLabel>Rating</StatLabel>
                    </StatCard>
                  </QuickStatsContainer>

                  {/* Upcoming Bookings */}
                  {upcomingBookings.length > 0 ? (
                    <>
                      <SectionTitle>Upcoming Rides</SectionTitle>
                      <FlatList
                        data={upcomingBookings.slice(0, 3)}
                        scrollEnabled={false}
                        nestedScrollEnabled
                        renderItem={renderBookingItem}
                        keyExtractor={item => item.id}
                        removeClippedSubviews
                        initialNumToRender={3}
                      />
                    </>
                  ) : (
                    <EmptyStateContainer>
                      <EmptyStateText>No upcoming rides booked</EmptyStateText>
                      <ActionButton onPress={() => navigation.navigate('Search')} accessible accessibilityLabel="Find a Ride">
                        <ActionButtonText>Find a Ride</ActionButtonText>
                      </ActionButton>
                    </EmptyStateContainer>
                  )}

                  {/* Quick Actions */}
                  <QuickActionsContainer>
                    <ActionButton onPress={() => navigation.navigate('Search')} accessible accessibilityLabel="Search Rides">
                      <ActionButtonText>🔍 Search Rides</ActionButtonText>
                    </ActionButton>
                    <ActionButton
                      variant="secondary"
                      onPress={() => navigation.navigate('BookingHistory')}
                      accessible
                      accessibilityLabel="Booking History"
                    >
                      <ActionButtonText variant="secondary">📋 Booking History</ActionButtonText>
                    </ActionButton>
                    <ActionButton
                      variant="secondary"
                      onPress={() => navigation.navigate('Profile')}
                      accessible
                      accessibilityLabel="Profile"
                    >
                      <ActionButtonText variant="secondary">👤 Profile</ActionButtonText>
                    </ActionButton>
                    <ActionButton
                      variant="secondary"
                      onPress={() =>
                        Alert.alert('Confirm', 'Logout?', [
                          { text: 'Cancel' },
                          {
                            text: 'Logout',
                            onPress: logout,
                          },
                        ])
                      }
                      accessible
                      accessibilityLabel="Logout"
                    >
                      <ActionButtonText variant="secondary">🚪 Logout</ActionButtonText>
                    </ActionButton>
                  </QuickActionsContainer>
                </>
              )}
            </Content>
          </Container>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

export default RoleGuard(['PASSENGER'], PassengerDashboardInner);
