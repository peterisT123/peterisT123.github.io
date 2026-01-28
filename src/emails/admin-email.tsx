import { Html, Body, Container, Text, Heading, Hr, Img, Section } from '@react-email/components';
import { AppState } from '@/lib/types';

interface AdminEmailProps {
  state: AppState;
}

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#003366',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  textAlign: 'center' as const,
};

const h2 = {
    color: '#003366',
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '30px 0 15px 0',
}

const dataTable = {
    width: '100%',
    borderCollapse: 'collapse' as const,
}

const dataRowTr = {
    borderBottom: '1px solid #eaeaea',
}

const dataLabelTd = {
    padding: '10px 0',
    color: '#555',
    fontWeight: 500,
    fontSize: '16px',
}

const dataValueTd = {
    padding: '10px 0',
    textAlign: 'right' as const,
    color: '#111',
    fontSize: '16px',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};

const DataRow = ({ label, value }: { label: string; value?: string | number | null }) => (
    <tr style={dataRowTr}>
        <td style={dataLabelTd}>{label}</td>
        <td style={dataValueTd}>{value || '-'}</td>
    </tr>
)

export const AdminEmail = ({ state }: AdminEmailProps) => {
    const isTravel = state.product === 'Ceļojums';

    const capitalizeJaNe = (value: string | undefined) => {
        if (value === 'jā') return 'Jā';
        if (value === 'nē') return 'Nē';
        return value || '-';
    }

    return (
        <Html>
            <Body style={main}>
                <Container style={container}>
                    <Img src={`${baseUrl}/logo.png`} width="200" height="50" alt="Logo" style={{ margin: '0 auto' }} />
                    <Heading as="h1" style={h1}>Jauns apdrošināšanas pieteikums</Heading>

                    <Section style={{ padding: '0 20px' }}>
                        <Heading as="h2" style={h2}>Vispārīgā informācija</Heading>
                        <table style={dataTable} cellSpacing="0" cellPadding="0">
                            <tbody>
                                <DataRow label="Produkts" value={state.product} />
                            </tbody>
                        </table>

                        <Hr style={hr} />

                        <Heading as="h2" style={h2}>Kontaktinformācija</Heading>
                        <table style={dataTable} cellSpacing="0" cellPadding="0">
                            <tbody>
                                <DataRow label="Vārds, uzvārds" value={state.contact.name} />
                                <DataRow label="E-pasts" value={state.contact.email} />
                                <DataRow label="Tālrunis" value={state.contact.phone} />
                                <DataRow label="Piekrišana" value={state.contact.consent ? 'Jā' : 'Nē'} />
                            </tbody>
                        </table>

                    {isTravel && state.travel && (
                        <>
                            <Hr style={hr} />
                            <Heading as="h2" style={h2}>Ceļojuma detaļas</Heading>
                            <table style={dataTable} cellSpacing="0" cellPadding="0">
                                <tbody>
                                    <DataRow label="Datums no" value={state.travel.travelDateFrom ? new Date(state.travel.travelDateFrom).toLocaleDateString('lv-LV') : '-'} />
                                    <DataRow label="Datums līdz" value={state.travel.travelDateTo ? new Date(state.travel.travelDateTo).toLocaleDateString('lv-LV') : '-'} />
                                </tbody>
                            </table>
                        </>
                    )}

                    {isTravel && state.travel.travelers && state.travel.travelers.map((traveler, index) => (
                        <div key={traveler.id || index}>
                            <Heading as="h3" style={{...h2, fontSize: '18px', marginTop: '25px' }}>Ceļotājs #{index + 1}</Heading>
                            <table style={dataTable} cellSpacing="0" cellPadding="0">
                                <tbody>
                                    <DataRow label="Vārds" value={traveler.firstName} />
                                    <DataRow label="Uzvārds" value={traveler.lastName} />
                                    <DataRow label="Dzimšanas datums" value={traveler.birthDate ? new Date(traveler.birthDate).toLocaleDateString('lv-LV') : '-'} />
                                    <DataRow label="Polises tips" value={traveler.policyType} />
                                    <DataRow label="Ziemas sports" value={capitalizeJaNe(traveler.winterSports)} />
                                    <DataRow label="Daivings" value={capitalizeJaNe(traveler.diving)} />
                                    <DataRow label="Citas sporta aktivitātes" value={capitalizeJaNe(traveler.otherSports)} />
                                    <DataRow label="Sacensības / treniņi" value={capitalizeJaNe(traveler.competitions)} />
                                    <DataRow label="Ekstrēmā sporta sacensības / treniņi" value={capitalizeJaNe(traveler.extremeSports)} />
                                    <DataRow label="Fizisks darbs" value={capitalizeJaNe(traveler.physicalWork)} />
                                </tbody>
                            </table>
                        </div>
                    ))}

                    {state.product === 'Īpašums' && state.buildings && state.buildings.map((building, index) => (
                        <div key={building.id || index}>
                            <Hr style={hr} />
                            <Heading as="h2" style={h2}>Apdrošināmais objekts #{index + 1}: {building.objectType}</Heading>
                            <table style={dataTable} cellSpacing="0" cellPadding="0">
                                <tbody>
                                    <DataRow label="Īpašnieka vārds, uzvārds" value={building.ownerName} />
                                    <DataRow label="Būves tips" value={building.objectType} />
                                    <DataRow label="Būvniecības materiāls" value={building.constructionMaterial} />
                                    <DataRow label="Pēdējā lielā remonta gads" value={building.lastRenovationYear} />
                                    <DataRow label="Apdailes līmenis" value={building.finishingLevel} />
                                    <DataRow label="Nodošanas ekspluatācijā gads" value={building.commissioningYear} />
                                    <DataRow label="Īpašuma platība" value={building.propertyArea ? `${building.propertyArea} m²` : ''} />
                                    {building.objectType === 'Dzīvoklis' && <DataRow label="Pašreizējais stāvs" value={building.currentFloor} />}
                                    <DataRow label="Kopējais stāvu skaits" value={building.totalFloors} />
                                    <DataRow label="Pastāvīgi apdzīvots" value={building.isConstantlyInhabited ? 'Jā' : 'Nē'} />
                                    <DataRow label="Tiek izīrēts" value={building.isRented ? 'Jā' : 'Nē'} />
                                    <DataRow label="Ir apsardzes signalizācija" value={building.hasSecurityAlarm ? 'Jā' : 'Nē'} />
                                    <DataRow label="Ir saules paneļi" value={building.hasSolarPanels ? 'Jā' : 'Nē'} />
                                    {building.hasSolarPanels && (
                                        <>
                                        <DataRow label="Saules paneļu skaits" value={building.solarPanelsCount} />
                                        <DataRow label="Saules paneļu vērtība" value={`${building.solarPanelsValue} EUR`} />
                                        <DataRow label="Saules paneļu atrašanās vieta" value={building.solarPanelsLocation} />
                                        </>
                                    )}
                                    <DataRow label="Kustamā manta" value={building.movablePropertyIncluded ? 'Jā' : 'Nē'} />
                                    {building.movablePropertyIncluded && <DataRow label="Kopējā kustamās mantas vērtība" value={`${building.totalMovablePropertyValue} EUR`} />}
                                    {building.movablePropertyIncluded && <DataRow label="Iekļauta vērtīga kustamā manta" value={building.valuableMovablePropertyIncluded ? 'Jā' : 'Nē'} />}
                                    <DataRow label="Civiltiesiskā apdrošināšana" value={building.civilLiabilityInsuranceIncluded ? 'Jā' : 'Nē'} />
                                    {building.civilLiabilityInsuranceIncluded && <DataRow label="Civiltiesiskās atbildības segums" value={building.civilLiabilityCoverage} />}
                                    {building.civilLiabilityInsuranceIncluded && <DataRow label="Civiltiesiskās atbildības summa" value={building.civilLiabilityValue} />}
                                </tbody>
                            </table>
                        </div>
                    ))}

                        <Hr style={hr} />

                        <Text style={footer}>
                            Šis e-pasts tika nosūtīts no apdrošināšanas pieteikuma formas.
                        </Text>
                    </Section>
                </Container>
                </Body>
            </Html>
        );
    }
