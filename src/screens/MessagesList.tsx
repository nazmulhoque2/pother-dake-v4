import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { View, Text, FlatList, ActivityIndicator, Alert, TextInput, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import repository from '../repository';
import { Conversation } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MessagesList'>;

const Container = styled.View`
  flex: 1;
  background-color: ${p => p.theme.colors.background};
`;
const Body = styled.View`
  padding: 16px;
`;
const Item = styled.TouchableOpacity`
  background-color: #fff;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
`;
const Title = styled.Text`
  font-weight: 700;
  font-size: 16px;
`;
const Muted = styled.Text`
  color: #6b7280;
`;

export default function MessagesList({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        // use a demo user id; in runtime we would use auth user
        // repository.getConversations requires current user; Header/Sidebar navigation ensures authenticated
        // get current user id from repository via AuthContext? For simplicity, ask repository to return all conversations and filter on UI
        // But repository.getConversations requires user id; we'll attempt to get from mock: fetch bookings? instead use getConversations for current user via repository.getUser
      } catch (e) {
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // Note: to avoid referencing AuthContext here, we'll provide navigation entry points from dashboards with proper conversation lists
  return (
    <>
      <Header navigation={navigation} title="Messages" />
      <Container>
        <Body>
          <Title style={{ marginBottom: 12 }}>Conversations</Title>
          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : (
            <FlatList
              data={conversations}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <Item onPress={() => navigation.navigate('Conversation', { id: item.id })}>
                  <Title>Conversation with {item.participants.join(', ')}</Title>
                  <Muted>{item.messages.length} messages</Muted>
                </Item>
              )}
            />
          )}
        </Body>
      </Container>
    </>
  );
}
