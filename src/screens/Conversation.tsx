import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator, FlatList, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import Header from '../components/Header';
import repository from '../repository';
import { Message, Conversation } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Conversation'>;

const Container = styled.View`
  flex: 1;
  background-color: ${p => p.theme.colors.background};
`;
const Body = styled.View`
  flex: 1;
  padding: 12px;
`;
const MessageBubble = styled.View<{ me?: boolean }>`
  background-color: ${p => p.me ? '#2563eb' : '#fff'};
  padding: 10px;
  border-radius: 8px;
  align-self: ${p => p.me ? 'flex-end' : 'flex-start'};
  margin-bottom: 8px;
`;
const MessageText = styled.Text<{ me?: boolean }>`
  color: ${p => p.me ? '#fff' : '#111827'};
`;
const Composer = styled.View`
  padding: 8px;
  border-top-width: 1px;
  border-top-color: #e5e7eb;
  background-color: ${p => p.theme.colors.background};
`;
const Input = styled.TextInput`
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
`;

export default function ConversationScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const conv = await repository.getConversation(id);
        if (!mounted) return;
        setConversation(conv);
      } catch (e) {
        Alert.alert('Error', (e as Error).message || 'Failed to load conversation');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  const send = async () => {
    if (!text.trim()) return;
    try {
      // For demo, get a mock current user id from repository.getUser? We cannot access AuthContext here easily, so use a demo sender id 'p1'
      const me = 'p1';
      const msg = await repository.sendMessage(id, me, text.trim());
      setConversation(prev => prev ? { ...prev, messages: [...prev.messages, msg] } : prev);
      setText('');
    } catch (e) {
      Alert.alert('Error', (e as Error).message || 'Failed to send message');
    }
  };

  return (
    <>
      <Header navigation={navigation} title="Conversation" />
      <Container>
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
        ) : (
          <>
            <Body>
              <FlatList
                data={conversation?.messages || []}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <MessageBubble me={item.fromUserId === 'p1'}>
                    <MessageText me={item.fromUserId === 'p1'}>{item.text}</MessageText>
                    <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 6 }}>{new Date(item.timestamp).toLocaleString()}</Text>
                  </MessageBubble>
                )}
              />
            </Body>
            <Composer>
              <Input value={text} onChangeText={setText} placeholder="Type a message" />
              <TouchableOpacity onPress={send} style={{ marginTop: 8, backgroundColor: '#2563eb', padding: 10, borderRadius: 8, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text>
              </TouchableOpacity>
            </Composer>
          </>
        )}
      </Container>
    </>
  );
}
