'use client';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, MailCheck } from 'lucide-react';

export function SummaryStep() {
  const { state } = useAppContext();

  const SummaryItem = ({ label, value }: { label: string; value: string | number | undefined }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between items-center py-2">
            <p className="text-muted-foreground">{label}</p>
            <p className="font-semibold text-foreground text-right">{value}</p>
        </div>
    );
  };

  const BooleanSummaryItem = ({ label, value }: { label: string; value: boolean }) => (
    <div className="flex justify-between items-center py-2">
      <p className="text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2 font-semibold">
        {value ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <span>{value ? 'Jā' : 'Nē'}</span>
      </div>
    </div>
  );

  if (state.submitted) {
    return (
        <Card className="max-w-2xl mx-auto rounded-3xl shadow-lg">
            <CardHeader className="text-center">
                <MailCheck className="mx-auto h-16 w-16 text-primary" />
                <CardTitle className="text-3xl font-headline">Paldies!</CardTitle>
                <CardDescription className='text-base'>Pieteikums sagatavots nosūtīšanai. Lūdzu, pabeidziet sūtīšanu savā e-pasta programmā.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto rounded-3xl shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline">Pieteikuma kopsavilkums</CardTitle>
        <CardDescription>Lūdzu, pārbaudiet ievadīto informāciju pirms nosūtīšanas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold font-headline mb-2 text-primary">Klienta informācija</h3>
          <Card className='rounded-2xl'>
            <CardContent className='p-4 divide-y'>
              <SummaryItem label="Personas statuss" value={state.legalStatus} />
              <SummaryItem label="Vārds, uzvārds" value={state.contact.name} />
              <SummaryItem label="E-pasts" value={state.contact.email} />
              <SummaryItem label="Tālrunis" value={state.contact.phone} />
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold font-headline mb-2 text-primary">Apdrošināmie objekti</h3>
          <div className="space-y-6">
            {state.buildings.map((building, index) => (
              <Card key={building.id} className="rounded-2xl overflow-hidden">
                <CardHeader className='bg-muted/50 p-4'>
                    <CardTitle className='text-xl font-headline'>Nr.{index + 1} - {building.objectType}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 divide-y">
                  <SummaryItem label="Īpašnieks" value={building.ownerName} />
                  <SummaryItem label="Platība" value={`${building.propertyArea} m²`} />
                  <SummaryItem label="Būvniecības gads" value={building.buildYear} />
                  {building.objectType === 'Dzīvoklis' && (
                    <>
                      <SummaryItem label="Stāvs" value={building.currentFloor} />
                      <SummaryItem label="Kopējais stāvu skaits" value={building.totalFloors} />
                    </>
                  )}
                   {building.objectType === 'Māja' && (
                    <SummaryItem label="Stāvu skaits" value={building.totalFloors} />
                  )}
                  <BooleanSummaryItem label="Pastāvīgi apdzīvots" value={building.isConstantlyInhabited} />
                  <BooleanSummaryItem label="Zaudējumi pēdējos 3 gados" value={building.lossesInLast3Years} />
                  <BooleanSummaryItem label="Kustamā manta" value={building.movablePropertyIncluded} />
                  {building.movablePropertyIncluded && (
                    <div className='pl-4'>
                        <BooleanSummaryItem label="Vērtīga kustamā manta" value={building.valuableMovablePropertyIncluded} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
