import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import Header from '../components/Header';
import repository from '../repository';
import { Booking } from '../types';
import { ActivityIndicator, FlatList, Text } from 'react-native';

const Container = styled.View`
  flex: 1;
  background-color: ${p => p.theme.colors.background};
`;
const Body = styled.View`
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

export default function AdminBookings({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await repository.getBookings();
        if (!mounted) return;
        setBookings(data);
      } catch (e) {
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <Header navigation={navigation} title="Bookings" />
      <Container>
        <Body>
          <Title>All Bookings</Title>
          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : (
            <FlatList
              data={bookings}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <Card>
                  <Text style={{ fontWeight: '700' }}>{item.id}</Text>
                  <Muted>Trip: {item.tripId}</Muted>
                  <Muted>Passenger: {item.passengerId}</Muted>
                  <Muted>Status: {item.status} • Payment: {item.paymentStatus}</Muted>
                </Card>
              )}
            />
          )}
        </Body>
      </Container>
    </>
  );
}
