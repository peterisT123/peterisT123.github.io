'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Minus, Plus, Users } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Travelers } from '@/lib/types';

export const TravelStep = () => {
  const { state, updateTravel } = useAppContext();
  const { travel } = state;

  const [date, setDate] = useState<DateRange | undefined>({
    from: travel.travelTime.from,
    to: travel.travelTime.to,
  });

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (newDate?.from && newDate?.to) {
      updateTravel({ travelTime: { from: newDate.from, to: newDate.to } });
    }
  };

  const handleTravelersChange = (
    ageGroup: keyof Travelers,
    increment: boolean
  ) => {
    const currentValue = travel.travelers[ageGroup];
    const newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1);
    updateTravel({
      travelers: { ...travel.travelers, [ageGroup]: newValue },
    });
  };

  const totalTravelers =
    travel.travelers.upTo64 +
    travel.travelers.from65to74 +
    travel.travelers.from75;

  const getTravelerSummary = () => {
    const parts = [];
    if (travel.travelers.upTo64 > 0)
      parts.push(`${travel.travelers.upTo64} (līdz 64)`);
    if (travel.travelers.from65to74 > 0)
      parts.push(`${travel.travelers.from65to74} (65-74)`);
    if (travel.travelers.from75 > 0)
      parts.push(`${travel.travelers.from75} (75+)`);

    if (parts.length === 0) return 'Norādiet ceļotājus';
    return `${totalTravelers} ceļotājs: ${parts.join(', ')}`;
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl shadow-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="text-3xl lg:text-4xl font-bold font-headline text-primary leading-tight">
            Ceļojuma detaļas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Travel Time */}
          <div className="space-y-2">
            <Label>Ceļojuma laiks</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y')} -{' '}
                        {format(date.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Izvēlieties datumus</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Multiple Trips Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="multipleTrips"
              checked={travel.multipleTrips}
              onCheckedChange={(checked) =>
                updateTravel({ multipleTrips: !!checked })
              }
            />
            <Label htmlFor="multipleTrips" className="font-normal">
              Vairākkārtēji braucieni gada laikā
            </Label>
          </div>

          {/* Travelers Count */}
          <div className="space-y-2">
            <Label>Ceļotāju skaits</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {getTravelerSummary()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Ceļotāju skaits</h4>
                    <p className="text-sm text-muted-foreground">
                      Norādiet ceļotāju skaitu atbilstoši vecuma grupai.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    {/* Up to 64 */}
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="upTo64">Līdz 64 gadiem</Label>
                      <div className="col-span-2 flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleTravelersChange('upTo64', false)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center">{travel.travelers.upTo64}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleTravelersChange('upTo64', true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {/* 65-74 */}
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="from65to74">65-74 gadi</Label>
                      <div className="col-span-2 flex items-center justify-end space-x-2">
                         <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleTravelersChange('from65to74', false)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center">{travel.travelers.from65to74}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleTravelersChange('from65to74', true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {/* 75+ */}
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="from75">75+ gadi</Label>
                      <div className="col-span-2 flex items-center justify-end space-x-2">
                         <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleTravelersChange('from75', false)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center">{travel.travelers.from75}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleTravelersChange('from75', true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Activities */}
          <div className="space-y-2">
            <Label>Aktivitātes</Label>
            <Select
              value={travel.activities}
              onValueChange={(value) => updateTravel({ activities: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Izvēlieties aktivitātes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bez paaugstināta riska aktivitātēm">
                  Bez paaugstināta riska aktivitātēm
                </SelectItem>
                <SelectItem value="Slēpošana / snovbords">
                  Slēpošana / snovbords
                </SelectItem>
                <SelectItem value="Niršana">Niršana</SelectItem>
                <SelectItem value="Cits">Cits</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
