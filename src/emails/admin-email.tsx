
import { Body, Container, Head, Html, Preview, Text, Section, Row, Column } from '@react-email/components';
import { AppState } from '@/lib/types';

interface AdminEmailProps {
  state: AppState;
}

export const AdminEmail = ({ state }: AdminEmailProps) => (
  <Html>
    <Head />
    <Preview>Jauns pieteikums</Preview>
    <Body style={{ backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}>
      <Container style={{ margin: '0 auto', padding: '20px 0 48px' }}>
        <Text style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>Jauns pieteikums</Text>
        <Text>Produkts: {state.product}</Text>

        <Section style={{ border: '1px solid #eaeaea', borderRadius: '5px', padding: '20px' }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Kontaktinformācija</Text>
          <Row><Column>Vārds:</Column><Column>{state.contact.name}</Column></Row>
          <Row><Column>E-pasts:</Column><Column>{state.contact.email}</Column></Row>
          <Row><Column>Tālrunis:</Column><Column>{state.contact.phone}</Column></Row>
        </Section>

        {state.product === 'Ceļojums' && (
          <Section style={{ border: '1px solid #eaeaea', borderRadius: '5px', padding: '20px', marginTop: '20px' }}>
            <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Ceļojuma detaļas</Text>
            <Row><Column>Galamērķis:</Column><Column>{state.travel.destination}</Column></Row>
            <Row><Column>Datums no:</Column><Column>{state.travel.dateFrom?.toString()}</Column></Row>
            <Row><Column>Datums līdz:</Column><Column>{state.travel.dateTo?.toString()}</Column></Row>
            <Row><Column>Ceļotāju skaits (līdz 64 g.v.):</Column><Column>{state.travel.travelers.upTo64}</Column></Row>
            <Row><Column>Ceļotāju skaits (65-74 g.v.):</Column><Column>{state.travel.travelers.from65to74}</Column></Row>
            <Row><Column>Ceļotāju skaits (no 75 g.v.):</Column><Column>{state.travel.travelers.from75}</Column></Row>
            <Row><Column>Civiltiesiskā apdrošināšana:</Column><Column>{state.travel.civilLiability}</Column></Row>
          </Section>
        )}

        {state.product === 'Īpašums' && state.buildings.map((building, index) => (
          <Section key={index} style={{ border: '1px solid #eaeaea', borderRadius: '5px', padding: '20px', marginTop: '20px' }}>
            <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Īpašums {index + 1}</Text>
            <Row><Column>Objekta tips:</Column><Column>{building.objectType}</Column></Row>
            <Row><Column>Platība:</Column><Column>{building.area}</Column></Row>
            <Row><Column>Nodošanas gads:</Column><Column>{building.commissioningYear}</Column></Row>
            <Row><Column>Konstrukcijas materiāls:</Column><Column>{building.constructionMaterial}</Column></Row>
            <Row><Column>Apdare:</Column><Column>{building.finishing}</Column></Row>
            {building.solarPanels && (
              <>
                <Row><Column>Saules paneļi:</Column><Column>Ir</Column></Row>
                <Row><Column>Atrašanās vieta:</Column><Column>{building.solarPanelsLocation}</Column></Row>
              </>
            )}
          </Section>
        ))}
      </Container>
    </Body>
  </Html>
);
