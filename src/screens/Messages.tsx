import React from 'react';
import styled from 'styled-components/native';
import Header from '../components/Header';
import { Text } from 'react-native';

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
const Msg = styled.View`
  background-color: #fff;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
`;
const Muted = styled.Text`
  color: #6b7280;
`;

export default function Messages({ navigation }: any) {
  return (
    <>
      <Header navigation={navigation} title="Messages" />
      <Container>
        <Body>
          <Title>Messages</Title>
          <Muted>Messaging is a placeholder in mock mode.</Muted>

          <Msg>
            <Title style={{ fontSize: 16, fontWeight: '700' }}>No new messages</Title>
            <Muted style={{ marginTop: 6 }}>This demo does not include a live messaging backend.</Muted>
          </Msg>
        </Body>
      </Container>
    </>
  );
}
