import React from 'react';
import styled from 'styled-components/native';
import Header from '../components/Header';
import { ScrollView, Text } from 'react-native';

const Container = styled.View`
  flex: 1;
  background-color: ${p => p.theme.colors.background};
`;
const Body = styled.ScrollView`
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

export default function DriverVerification({ navigation }: any) {
  return (
    <>
      <Header navigation={navigation} title="Verification" />
      <Container>
        <Body>
          <Title>Driver Verification</Title>
          <Muted>This demo shows a simplified verification status.</Muted>

          <Card>
            <Text style={{ fontWeight: '700', fontSize: 16 }}>Verification Status: Not Verified (demo)</Text>
            <Muted style={{ marginTop: 8 }}>In a real app this screen would show uploaded documents, license details and verification progress. For mock mode, verification can be simulated by the admin.</Muted>
          </Card>
        </Body>
      </Container>
    </>
  );
}
