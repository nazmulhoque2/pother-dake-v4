import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import Header from '../components/Header';
import repository from '../repository';
import { Driver } from '../types';
import { ActivityIndicator, FlatList, Text, View, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminDrivers'>;

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
const ButtonsRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-top: 8px;
`;
const ActionButton = styled.TouchableOpacity`
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #e5e7eb;
`;
const ActionText = styled.Text`
  font-weight: 700;
`;

export default function AdminDrivers({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await repository.getDrivers();
        if (!mounted) return;
        setDrivers(data);
      } catch (e) {
        Alert.alert('Error', (e as Error).message || 'Failed to load drivers');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await repository.getDrivers();
      setDrivers(data);
    } catch (e) {
      Alert.alert('Error', (e as Error).message || 'Failed to refresh drivers');
    } finally {
      setLoading(false);
    }
  };

  const setVerification = async (driverId: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    Alert.alert('Confirm', `Set verification to ${status}?`, [
      { text: 'Cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            setActionLoading(prev => ({ ...prev, [driverId]: true }));
            await repository.setDriverVerification?.(driverId, status);
            await refresh();
          } catch (e) {
            Alert.alert('Error', (e as Error).message || 'Failed to update verification');
          } finally {
            setActionLoading(prev => ({ ...prev, [driverId]: false }));
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: Driver }) => (
    <Card>
      <Text style={{ fontWeight: '700' }}>{item.name}</Text>
      <Muted>{item.email}</Muted>
      <Muted>Vehicle: {item.vehicleType || 'N/A'}</Muted>
      <Muted>Verification: {item.verificationStatus || 'PENDING'}</Muted>

      <ButtonsRow>
        <ActionButton onPress={() => setVerification(item.id, 'APPROVED')} disabled={!!actionLoading[item.id]}>
          {actionLoading[item.id] ? <ActivityIndicator size="small" color="#111" /> : <ActionText>Approve</ActionText>}
        </ActionButton>
        <ActionButton onPress={() => setVerification(item.id, 'REJECTED')} disabled={!!actionLoading[item.id]}>
          {actionLoading[item.id] ? <ActivityIndicator size="small" color="#111" /> : <ActionText>Reject</ActionText>}
        </ActionButton>
        <ActionButton onPress={() => setVerification(item.id, 'PENDING')} disabled={!!actionLoading[item.id]}>
          {actionLoading[item.id] ? <ActivityIndicator size="small" color="#111" /> : <ActionText>Set Pending</ActionText>}
        </ActionButton>
      </ButtonsRow>
    </Card>
  );

  return (
    <>
      <Header navigation={navigation} title="Drivers" />
      <Container>
        <Body>
          <Title>Drivers</Title>
          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : (
            <FlatList
              data={drivers}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              ListEmptyComponent={<Muted>No drivers found</Muted>}
            />
          )}
        </Body>
      </Container>
    </>
  );
}
