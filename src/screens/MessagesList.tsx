import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components/native';
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import repository from '../repository';
import { Conversation } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useAuth } from '../auth/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Left = styled.View`
  flex: 1;
`;
const Title = styled.Text`
  font-weight: 700;
  font-size: 16px;
`;
const Preview = styled.Text`
  color: #6b7280;
  margin-top: 4px;
`;
const Badge = styled.View`
  background-color: #ef4444;
  min-width: 24px;
  padding: 4px 8px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;
const BadgeText = styled.Text`
  color: #fff;
  font-weight: 700;
`;

export default function MessagesList({ navigation }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      setLoading(true);
      const convs = await repository.getConversations(user.id);
      // sort by last message timestamp desc
      convs.sort((a, b) => {
        const ta = a.messages.length ? new Date(a.messages[a.messages.length - 1].timestamp).getTime() : 0;
        const tb = b.messages.length ? new Date(b.messages[b.messages.length - 1].timestamp).getTime() : 0;
        return tb - ta;
      });
      setConversations(convs);
    } catch (e: any) {
      setError(e?.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (!user) {
    return (
      <>
        <Header navigation={navigation} title="Messages" />
        <Container>
          <Body>
            <Title>Please login to view messages</Title>
          </Body>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header navigation={navigation} title="Messages" />
      <Container>
        <Body>
          <Title style={{ marginBottom: 12 }}>Conversations</Title>

          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : error ? (
            <View>
              <Text style={{ color: '#ef4444', marginBottom: 8 }}>{error}</Text>
              <TouchableOpacity onPress={load} style={{ padding: 10, backgroundColor: '#2563eb', borderRadius: 8 }}>
                <Text style={{ color: '#fff' }}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : conversations.length === 0 ? (
            <View style={{ padding: 20 }}>
              <Text style={{ color: '#6b7280' }}>No conversations yet. Start a conversation from a trip or profile.</Text>
            </View>
          ) : (
            <FlatList
              data={conversations}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const last = item.messages[item.messages.length - 1];
                const preview = last ? last.text : 'No messages yet';
                const unread = item.messages.filter(m => !m.read && m.fromUserId !== user.id).length;
                const title = item.participants.filter(p => p !== user.id).join(', ') || 'Conversation';
                return (
                  <Item onPress={() => navigation.navigate('Conversation', { id: item.id })}>
                    <Left>
                      <Title>{title}</Title>
                      <Preview numberOfLines={1}>{preview}</Preview>
                    </Left>
                    {unread > 0 && (
                      <Badge>
                        <BadgeText>{unread}</BadgeText>
                      </Badge>
                    )}
                  </Item>
                );
              }}
            />
          )}
        </Body>
      </Container>
    </>
  );
}
