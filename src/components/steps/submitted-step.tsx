import { Card } from "@/components/ui/card";

export const SubmittedStep = () => {
  return (
    <div className="space-y-8">
      <Card className="rounded-3xl shadow-lg overflow-hidden">
        <div className="p-8 sm:p-12 flex flex-col justify-center items-center text-center">
          <h3 className="text-3xl lg:text-4xl font-bold font-headline text-primary leading-tight">
            Paldies par sagatavoto pieteikumu!
          </h3>
          <p className="mt-4 text-lg font-bold text-foreground">
            Pieteikums nosūtīts, tuvākajā laikā ar Jums sazināsies speciālists, lai precizētu detaļas.
          </p>
        </div>
      </Card>
    </div>
  );
};
