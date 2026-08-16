import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import Header from '../components/Header';
import repository from '../repository';
import { Trip } from '../types';
import { ActivityIndicator, FlatList } from 'react-native';

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

export default function DriverEarnings({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await repository.fetchTrips();
        if (!mounted) return;
        setTrips(data);
      } catch (e) {
        // ignore for demo
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // For demo, compute earnings per trip
  const computeEarnings = (trip: Trip) => {
    return trip.passengers.reduce((sum, b) => {
      const seats = b.seatsBooked || 0;
      return sum + seats * (trip.pricePerSeat || 0);
    }, 0);
  };

  const total = trips.reduce((s, t) => s + computeEarnings(t), 0);

  return (
    <>
      <Header navigation={navigation} title="Earnings" />
      <Container>
        <Body>
          <Title>Driver Earnings (Demo)</Title>
          <Muted style={{ marginBottom: 12 }}>Earnings are computed from mock trip bookings.</Muted>

          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : (
            <>
              <Card>
                <Title style={{ fontSize: 18 }}>Total (mock): ৳ {total}</Title>
                <Muted style={{ marginTop: 6 }}>Based on current bookings in mock data</Muted>
              </Card>

              <FlatList
                data={trips}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <Card>
                    <Title style={{ fontSize: 16 }}>{item.origin.name} → {item.destination.name}</Title>
                    <Muted>Departure: {item.departureDate} {item.departureTime}</Muted>
                    <Muted>Earnings: ৳ {computeEarnings(item)}</Muted>
                  </Card>
                )}
              />
            </>
          )}
        </Body>
      </Container>
    </>
  );
}
