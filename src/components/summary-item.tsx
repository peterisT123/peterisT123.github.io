'use client';

import { format } from 'date-fns';
import { CheckCircle2, XCircle } from 'lucide-react';

export const SummaryItem = ({ label, value }: { label: string; value: string | number | undefined | Date }) => {
    if (value === undefined || value === null || value === '') return null;
    
    let displayValue = value;
    if (value instanceof Date) {
      displayValue = format(value, 'dd.MM.yyyy');
    }

    return (
        <div className="flex justify-between items-center py-2">
            <p className="text-muted-foreground">{label}</p>
            <p className="font-semibold text-foreground text-right">{String(displayValue)}</p>
        </div>
    );
  };

  export const BooleanSummaryItem = ({ label, value }: { label: string; value: boolean }) => (
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
