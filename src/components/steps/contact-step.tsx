'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/app-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactSchema } from '@/lib/schema';
import type { AppState, Contact } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { MailCheck } from 'lucide-react';

function formatDataForEmail(data: AppState): string {
  let emailBody = `Jauns apdrošināšanas pieteikums\n`;
  emailBody += `=================================\n\n`;
  
  emailBody += `KLIENTA INFORMĀCIJA\n`;
  emailBody += `-------------------\n`;
  emailBody += `Juridiskais statuss: ${data.legalStatus}\n`;
  emailBody += `Vārds, uzvārds: ${data.contact.name}\n`;
  emailBody += `E-pasts: ${data.contact.email}\n`;
  emailBody += `Tālrunis: ${data.contact.phone}\n\n`;

  emailBody += `APDROŠINĀMIE OBJEKTI\n`;
  emailBody += `---------------------\n`;

  data.buildings.forEach((building, index) => {
    emailBody += `\nOBJEKTS #${index + 1}\n`;
    emailBody += `Tips: ${building.objectType}\n`;
    emailBody += `Īpašnieka vārds: ${building.ownerName}\n`;
    emailBody += `Platība: ${building.propertyArea} m²\n`;
    emailBody += `Būvniecības gads: ${building.buildYear}\n`;

    if (building.objectType === 'Dzīvoklis') {
      emailBody += `Stāvs: ${building.currentFloor} no ${building.totalFloors}\n`;
    }
    if (building.objectType === 'Dzīvojamā ēka') {
        emailBody += `Stāvu skaits: ${building.totalFloors}\n`;
    }

    emailBody += `Statuss: ${building.isConstantlyInhabited ? 'Pastāvīgi apdzīvots' : 'Nav pastāvīgi apdzīvots'}\n`;
    emailBody += `Zaudējumi pēdējos 3 gados: ${building.lossesInLast3Years ? 'Ir bijuši' : 'Nav bijuši'}\n`;
    emailBody += `Kustamā manta: ${building.movablePropertyIncluded ? 'Iekļauta' : 'Nav iekļauta'}\n`;
    if (building.movablePropertyIncluded) {
      emailBody += `   - Vērtīga manta: ${building.valuableMovablePropertyIncluded ? 'Iekļauta' : 'Nav iekļauta'}\n`;
    }
  });

  emailBody += `\n\n--- E-pasta beigas ---\n`;

  return emailBody;
}


export function ContactStep() {
  const { state, setState } = useAppContext();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

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


  const handleSubmit = (data: Contact) => {
    const finalState = {
        ...state,
        contact: data,
    };
    const emailBody = formatDataForEmail(finalState);
    const mailtoLink = `mailto:brokeris@example.com?subject=${encodeURIComponent('Jauns apdrošināšanas pieteikums')}&body=${encodeURIComponent(emailBody)}`;
    
    window.location.href = mailtoLink;
    setSubmitted(true);
  };
  
  useEffect(() => {
      if (submitted) {
          toast({
            title: "Pieteikums sagatavots!",
            description: "Jūsu e-pasta klients tiks atvērts, lai nosūtītu pieteikumu.",
            variant: 'default',
            className: 'bg-primary text-primary-foreground border-primary'
          });
      }
  }, [submitted, toast]);


  if (submitted) {
    return (
        <Card className="max-w-2xl mx-auto rounded-3xl shadow-lg">
        <CardHeader className="text-center">
            <MailCheck className="mx-auto h-16 w-16 text-primary" />
          <CardTitle className="text-3xl font-headline">Paldies!</CardTitle>
          <CardDescription className='text-base'>Pieteikums sagatavots nosūtīšanai. Lūdzu, pabeidz sūtīšanu savā e-pasta programmā.</CardDescription>
        </CardHeader>
      </Card>
    );
  }


  return (
    <Card className="max-w-2xl mx-auto rounded-3xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-headline">Gandrīz pabeigts!</CardTitle>
        <CardDescription>Lūdzu, ievadiet savu kontaktinformāciju, lai mēs varētu sagatavot Jums piedāvājumu.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} id="contact-form" className='space-y-6'>
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
                </div>
            </form>
        </Form>
      </CardContent>
    </Card>
  );
}
