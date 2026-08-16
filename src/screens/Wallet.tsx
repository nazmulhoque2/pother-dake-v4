import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import Header from '../components/Header';
import repository from '../repository';
import { Transaction, Wallet } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Wallet'>;

const Container = styled.View`
  flex: 1;
  background-color: ${p => p.theme.colors.background};
`;
const Body = styled.View`
  padding: 16px;
`;
const Card = styled.View`
  background-color: #fff;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
`;
const Title = styled.Text`
  font-weight: 700;
  font-size: 18px;
`;
const Muted = styled.Text`
  color: #6b7280;
`;

export default function WalletScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        // demo user id p1
        const userId = 'p1';
        const [w, txs] = await Promise.all([
          repository.getWallet(userId),
          repository.getTransactions(userId),
        ]);
        if (!mounted) return;
        setWallet(w);
        setTransactions(txs);
      } catch (e) {
        Alert.alert('Error', (e as Error).message || 'Failed to load wallet');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <Header navigation={navigation} title="Wallet" />
      <Container>
        <Body>
          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : (
            <>
              <Card>
                <Title>Balance</Title>
                <Text style={{ fontSize: 22, fontWeight: '700', marginTop: 6 }}>৳ {wallet?.balance ?? 0}</Text>
                <Muted style={{ marginTop: 6 }}>Preferred: CARD</Muted>
              </Card>

              <Title style={{ marginBottom: 8 }}>Transactions</Title>
              <FlatList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <Card>
                    <Text style={{ fontWeight: '700' }}>{item.type} • ৳ {item.amount}</Text>
                    <Muted>{new Date(item.date).toLocaleString()}</Muted>
                    <Muted>Booking: {item.bookingId || '—'}</Muted>
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
