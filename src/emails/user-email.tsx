
import { Body, Container, Head, Html, Preview, Text } from '@react-email/components';

interface UserEmailProps {
  name: string;
}

export const UserEmail = ({ name }: UserEmailProps) => (
  <Html>
    <Head />
    <Preview>Paldies par pieteikumu!</Preview>
    <Body style={{ backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}>
      <Container style={{ margin: '0 auto', padding: '20px 0 48px' }}>
        <Text style={{ fontSize: '16px', lineHeight: '26px' }}>
          Sveiki, {name}!
        </Text>
        <Text style={{ fontSize: '16px', lineHeight: '26px' }}>
          Paldies par Jūsu pieteikumu. Mēs ar Jums sazināsimies tuvākajā laikā.
        </Text>
      </Container>
    </Body>
  </Html>
);
