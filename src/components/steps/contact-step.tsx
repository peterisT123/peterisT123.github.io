'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppContext } from '@/context/app-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactSchema } from '@/lib/schema';
import type { Contact } from '@/lib/types';

export function ContactStep() {
  const { state, setState } = useAppContext();

  const form = useForm<Contact>({
    resolver: zodResolver(ContactSchema),
    defaultValues: state.contact,
    mode: 'onBlur',
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
        setState(prev => ({...prev, contact: value as Contact}));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setState]);

  return (
    <Card className="max-w-2xl mx-auto rounded-3xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-headline">Kontakti</CardTitle>
        <CardDescription>Solis 4 no 4. Lūdzu, ievadiet savu kontaktinformāciju, lai mēs varētu sagatavot Jums piedāvājumu.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form className='space-y-6'>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vārds, uzvārds</FormLabel>
                                <FormControl>
                                    <Input placeholder="Jānis Bērziņš" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-pasts</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="janis.berzins@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tālrunis</FormLabel>
                                <FormControl>
                                    <Input placeholder="+371 20000000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="consent"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                    Piekrītu aptaujas inforāciju nodod speciālistam piedāvājuma izveidei.
                                    </FormLabel>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
      </CardContent>
    </Card>
  );
}
