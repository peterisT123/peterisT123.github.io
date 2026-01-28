'use client';

import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const DataRow = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="flex justify-between py-3 px-4">
        <p className="text-muted-foreground">{label}</p>
        <p className="font-medium text-right">{value || '-'}</p>
    </div>
);

const SummarySection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="border rounded-lg overflow-hidden">
            <div className="divide-y">
                {children}
            </div>
        </div>
    </div>
);

export const SummaryStep = () => {
  const { state } = useAppContext();
  const { product, travel, buildings, contact } = state;

  const isTravel = product === 'Ceļojums';
  
  const capitalizeJaNe = (value: string | undefined) => {
    if (value === 'jā') return 'Jā';
    if (value === 'nē') return 'Nē';
    return value || '-';
  }

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl lg:text-4xl font-bold font-headline text-primary leading-tight">Pieteikuma kopsavilkums</CardTitle>
          <CardDescription>Lūdzu, pārbaudiet ievadīto informāciju.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
            <div className="border rounded-lg overflow-hidden">
                <div className="divide-y">
                    <DataRow label="Produkts" value={product} />
                </div>
            </div>

            {isTravel && travel.travelers.length > 0 && (
                <SummarySection title="Ceļojuma detaļas">
                    <DataRow label="Datums no" value={travel.travelDateFrom ? new Date(travel.travelDateFrom).toLocaleDateString('lv-LV') : '-'} />
                    <DataRow label="Datums līdz" value={travel.travelDateTo ? new Date(travel.travelDateTo).toLocaleDateString('lv-LV') : '-'} />
                </SummarySection>
            )}

            {isTravel && travel.travelers.map((traveler, index) => (
                <SummarySection title={`Apdrošinātā persona #${index + 1}`} key={traveler.id}>
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
                </SummarySection>
            ))}

            {!isTravel && buildings.map((building, index) => (
                <SummarySection title={`Īpašums ${index + 1}: ${building.objectType}`} key={building.id}>
                    <DataRow label="Īpašnieka vārds, uzvārds" value={building.ownerName} />
                    <DataRow label="Platība (m²)" value={building.propertyArea} />
                    <DataRow label="Nodošanas ekspluatācijā gads" value={building.commissioningYear} />
                    <DataRow label="Būvkonstrukcijas materiāls" value={building.constructionMaterial} />
                    <DataRow label="Iekšējās apdares līmenis" value={building.finishingLevel} />
                    <DataRow label="Pēdējās renovācijas gads" value={building.lastRenovationYear} />
                    <DataRow label="Stāvu skaits" value={building.totalFloors} />
                    {building.objectType === 'Dzīvoklis' && <DataRow label="Stāvs (dzīvoklim)" value={building.currentFloor} />}
                    <DataRow label="Pastāvīgi apdzīvots" value={building.isConstantlyInhabited ? 'Jā' : 'Nē'} />
                    <DataRow label="Tiek izīrēts" value={building.isRented ? 'Jā' : 'Nē'} />
                    <DataRow label="Signalizācija" value={building.hasSecurityAlarm ? 'Jā' : 'Nē'} />
                    <DataRow label="Zaudējumi pēdējos 3 gados" value={building.lossesInLast3Years ? 'Jā' : 'Nē'} />
                    <DataRow label="Iedzīves apdrošināšana" value={building.movablePropertyIncluded ? 'Jā' : 'Nē'} />
                    {building.movablePropertyIncluded && <DataRow label="Iedzīves summa" value={building.totalMovablePropertyValue} />}
                    {building.movablePropertyIncluded && <DataRow label="Vērtīgas lietas" value={building.valuableMovablePropertyIncluded ? 'Jā' : 'Nē'} />}
                    <DataRow label="Civiltiesiskā apdrošināšana" value={building.civilLiabilityInsuranceIncluded ? 'Jā' : 'Nē'} />
                    {building.civilLiabilityInsuranceIncluded && <DataRow label="Civiltiesiskās atbildības segums" value={building.civilLiabilityCoverage} />}
                    {building.civilLiabilityInsuranceIncluded && <DataRow label="Civiltiesiskās atbildības summa" value={building.civilLiabilityValue} />}
                    <DataRow label="Saules paneļi" value={building.hasSolarPanels ? 'Jā' : 'Nē'} />
                    {building.hasSolarPanels && <DataRow label="Paneļu skaits" value={building.solarPanelsCount} />}
                    {building.hasSolarPanels && <DataRow label="Paneļu vērtība" value={building.solarPanelsValue} />}
                    {building.hasSolarPanels && <DataRow label="Paneļu novietojums" value={building.solarPanelsLocation} />}
                </SummarySection>
            ))}
        </CardContent>
      </Card>
    </div>
  );
};
