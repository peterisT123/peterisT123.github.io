
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Section,
  Hr,
  Row,
  Column,
  Heading,
} from '@react-email/components';
import { AppState } from '@/lib/types';
import * as React from 'react';

interface AdminEmailProps {
  state: AppState;
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  border: '1px solid #e2e8f0',
  borderRadius: '0.5rem',
};

const box = {
  padding: '0 48px',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '20px 0',
};

const h1 = {
    color: '#0f172a',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '30px 0',
};

const h2 = {
    color: '#0f172a',
    fontSize: '18px',
    fontWeight: '600',
    margin: '20px 0 10px 0',
};

const text = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '24px',
};

const dataLabel = {
    color: '#64748b',
    fontSize: '14px',
};

const dataValue = {
    color: '#0f172a',
    fontSize: '14px',
    fontWeight: '500',
};

interface DataRowProps {
    label: string;
    value: React.ReactNode;
}

const DataRow = ({ label, value }: DataRowProps) => (
    <Row style={{paddingTop: 8, paddingBottom: 8, borderBottom: '1px solid #e2e8f0'}}>
        <Column style={dataLabel}>{label}</Column>
        <Column style={dataValue} align="right">{value || '-'}</Column>
    </Row>
);


export const AdminEmail = ({ state }: AdminEmailProps) => (
  <Html>
    <Head />
    <Preview>Jauns apdrošināšanas pieteikums</Preview>
    <Body style={main}>
      <Container style={container}>
        <div style={box}>
          <Heading as="h1" style={h1}>Jauns pieteikums</Heading>
          
          <DataRow label="Produkts" value={state.product} />

          <Hr style={hr} />

          <Heading as="h2" style={h2}>Kontaktinformācija</Heading>
          <DataRow label="Vārds" value={state.contact.name} />
          <DataRow label="E-pasts" value={state.contact.email} />
          <DataRow label="Tālrunis" value={state.contact.phone} />
          {state.contact.company && <DataRow label="Uzņēmums" value={state.contact.company} />}

          {state.product === 'Ceļojums' && (
            <>
              <Hr style={hr} />
              <Heading as="h2" style={h2}>Ceļojuma detaļas</Heading>
              <DataRow label="Galamērķis" value={state.travel.destination} />
              <DataRow label="Datums no" value={state.travel.dateFrom?.toLocaleDateString('lv-LV')} />
              <DataRow label="Datums līdz" value={state.travel.dateTo?.toLocaleDateString('lv-LV')} />
              <DataRow label="Ceļotāji (līdz 64 g.v.)" value={state.travel.travelers.upTo64} />
              <DataRow label="Ceļotāji (65-74 g.v.)" value={state.travel.travelers.from65to74} />
              <DataRow label="Ceļotāji (no 75 g.v.)" value={state.travel.travelers.from75} />
              <DataRow label="Civiltiesiskā apdrošināšana" value={state.travel.civilLiability} />
              <DataRow label="Nodarbe" value={state.travel.occupation} />
              <DataRow label="Sports un aktīvā atpūta" value={state.travel.sports} />
            </>
          )}

          {state.product === 'Īpašums' && state.buildings.map((building, index) => (
            <React.Fragment key={building.id}>
              <Hr style={hr} />
              <Heading as="h2" style={h2}>{`Īpašums ${index + 1}: ${building.objectType}`}</Heading>
              <DataRow label="Īpašnieka vārds, uzvārds" value={building.ownerName} />
              <DataRow label="Platība (m²)" value={building.propertyArea} />
              <DataRow label="Nodošanas ekspluatācijā gads" value={building.commissioningYear} />
              <DataRow label="Būvkonstrukcijas materiāls" value={building.constructionMaterial} />
              <DataRow label="Iekšējās apdares līmenis" value={building.finishingLevel} />
              <DataRow label="Pēdējās renovācijas gads" value={building.lastRenovationYear} />
              <DataRow label="Stāvu skaits" value={building.totalFloors} />
              <DataRow label="Stāvs (dzīvoklim)" value={building.currentFloor} />
              <DataRow label="Pastāvīgi apdzīvots" value={building.isConstantlyInhabited ? 'Jā' : 'Nē'} />
              <DataRow label="Tiek izīrēts" value={building.isRented ? 'Jā' : 'Nē'} />
              <DataRow label="Saimnieciskā darbība" value={building.isCommercial ? 'Jā' : 'Nē'} />
              {building.isCommercial && <DataRow label="Saimn. darbības veids" value={building.commercialActivityType} />}
              <DataRow label="Signalizācija" value={building.hasSecurityAlarm ? 'Jā' : 'Nē'} />
              <DataRow label="Zaudējumi pēdējos 3 gados" value={building.lossesInLast3Years ? 'Jā' : 'Nē'} />
              <DataRow label="Iedzīves apdrošināšana" value={building.movablePropertyIncluded ? 'Jā' : 'Nē'} />
              {building.movablePropertyIncluded && <DataRow label="Iedzīves summa" value={`${building.totalMovablePropertyValue} EUR`} />}
              <DataRow label="Īpaši vērtīga iedzīve" value={building.valuableMovablePropertyIncluded ? 'Jā' : 'Nē'} />
              {building.valuableMovablePropertyIncluded && <DataRow label="Vērtīgās iedzīves summa" value={`${building.movablePropertyValue} EUR`} />}
              <DataRow label="Saules paneļi" value={building.hasSolarPanels ? 'Jā' : 'Nē'} />
              {building.hasSolarPanels && (
                  <>
                    <DataRow label="Paneļu skaits" value={building.solarPanelsCount} />
                    <DataRow label="Paneļu vērtība" value={`${building.solarPanelsValue} EUR`} />
                    <DataRow label="Paneļu atrašanās vieta" value={building.solarPanelsLocation} />
                  </>
              )}
               <DataRow label="Civiltiesiskā apdrošināšana" value={building.civilLiabilityInsuranceIncluded ? 'Jā' : 'Nē'} />
               {building.civilLiabilityInsuranceIncluded && (
                  <>
                    <DataRow label="CTA segums" value={building.civilLiabilityCoverage} />
                    <DataRow label="CTA summa" value={`${building.civilLiabilityValue} EUR`} />
                  </>
              )}
            </React.Fragment>
          ))}
          
           <Hr style={hr} />

            <Text style={text}>
                Šis e-pasts tika nosūtīts no apdrošināšanas pieteikuma formas.
            </Text>
        </div>
      </Container>
    </Body>
  </Html>
);
