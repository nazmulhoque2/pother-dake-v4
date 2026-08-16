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
const Card = styled.View`
  background-color: #fff;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
`;

export default function AdminComplaints({ navigation }: any) {
  return (
    <>
      <Header navigation={navigation} title="Complaints" />
      <Container>
        <Body>
          <Title>Complaints</Title>
          <Card>
            <Text style={{ fontWeight: '700' }}>No complaints in mock data</Text>
          </Card>
        </Body>
      </Container>
    </>
  );
}
