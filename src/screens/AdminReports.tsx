import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import Header from '../components/Header';
import repository from '../repository';
import { Trip } from '../types';
import { ActivityIndicator, Text } from 'react-native';

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

export default function AdminReports({ navigation }: any) {
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
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const totalTrips = trips.length;
  const totalSeats = trips.reduce((s, t) => s + (t.totalSeats || 0), 0);

  return (
    <>
      <Header navigation={navigation} title="Reports" />
      <Container>
        <Body>
          <Title>Reports & Analytics (demo)</Title>
          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : (
            <Card>
              <Text style={{ fontWeight: '700' }}>Total trips: {totalTrips}</Text>
              <Text>Total seats across trips: {totalSeats}</Text>
            </Card>
          )}
        </Body>
      </Container>
    </>
  );
}
