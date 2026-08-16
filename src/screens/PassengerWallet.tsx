import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import Header from '../components/Header';
import { useAuth } from '../auth/AuthContext';
import repository from '../repository';
import { Booking } from '../types';

const Container = styled.View`
  flex: 1;
  background-color: ${p => p.theme.colors.background};
`;
const Body = styled.ScrollView`
  padding: 16px;
`;
const Title = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${p => p.theme.colors.primary};
  margin-bottom: 8px;
`;
const Card = styled.View`
  background-color: #fff;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
`;
const Muted = styled.Text`
  color: #6b7280;
`;

export default function PassengerWallet({ navigation }: any) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        if (!user) return;
        const data = await repository.getBookings(user.id);
        if (!mounted) return;
        setBookings(data);
      } catch (e) {
        Alert.alert('Error', (e as Error).message || 'Failed to load wallet data');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [user]);

  const totalSpent = bookings.reduce((sum, b) => {
    // booking doesn't include price in schema; compute if available via mock trips later
    return sum;
  }, 0);

  return (
    <>
      <Header navigation={navigation} title="Wallet" />
      <Container>
        <Body>
          <Title>Wallet & Payments</Title>
          <Muted style={{ marginBottom: 12 }}>Payment history and methods (mock data)</Muted>

          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : (
            <>
              <Card>
                <Text style={{ fontWeight: '700', fontSize: 16 }}>Preferred Method</Text>
                <Muted style={{ marginTop: 6 }}>{user?.role === 'PASSENGER' ? (user as any).preferredPaymentMethod || 'CASH' : 'N/A'}</Muted>
              </Card>

              <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 8 }}>Recent Payments</Text>

              {bookings.length === 0 ? (
                <Muted>No payment history yet.</Muted>
              ) : (
                <FlatList
                  data={bookings}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <Card>
                      <Text style={{ fontWeight: '700' }}>Booking: {item.id}</Text>
                      <Muted>Trip: {item.tripId}</Muted>
                      <Muted>Status: {item.status} • Payment: {item.paymentStatus || 'N/A'}</Muted>
                    </Card>
                  )}
                />
              )}

            </>
          )}
        </Body>
      </Container>
    </>
  );
}
