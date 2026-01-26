'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAppContext } from "@/context/app-context";
import { ContactSchema } from "@/lib/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export function ContactStep() {
  const { state, setState } = useAppContext();

  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: state.contact,
    mode: 'onChange', // Validate on change
  });

  // Function to update the global state
  const updateGlobalState = (field: keyof typeof state.contact, value: any) => {
    setState(prevState => ({
      ...prevState,
      contact: {
        ...prevState.contact,
        [field]: value,
      },
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto rounded-3xl shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline">Jūsu kontaktinformācija</CardTitle>
        <CardDescription>Solis 4 no 4. Gandrīz pabeigts!</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vārds, uzvārds</FormLabel>
                  <FormControl>
                    <Input {...field} onChange={(e) => { field.onChange(e); updateGlobalState('name', e.target.value); }} />
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
                    <Input type="email" {...field} onChange={(e) => { field.onChange(e); updateGlobalState('email', e.target.value); }} />
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
                    <Input {...field} onChange={(e) => { field.onChange(e); updateGlobalState('phone', e.target.value); }} />
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
                    <Checkbox checked={field.value} onCheckedChange={(checked) => { field.onChange(checked); updateGlobalState('consent', checked); }} />
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
