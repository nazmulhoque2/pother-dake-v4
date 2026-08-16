import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import Header from '../components/Header';
import repository from '../repository';
import { Passenger } from '../types';
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

export default function AdminUsers({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Passenger[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await repository.getPassengers();
        if (!mounted) return;
        setUsers(data);
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
      <Header navigation={navigation} title="Users" />
      <Container>
        <Body>
          <Title>Passengers</Title>
          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : (
            <FlatList
              data={users}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <Card>
                  <Text style={{ fontWeight: '700' }}>{item.name}</Text>
                  <Muted>{item.email}</Muted>
                </Card>
              )}
            />
          )}
        </Body>
      </Container>
    </>
  );
}
