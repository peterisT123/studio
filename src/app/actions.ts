'use server';

import type { AppState } from '@/lib/types';
import { z } from 'zod';
import { ContactSchema } from '@/lib/schema';

type ContactFormState = {
    message: string;
    errors?: {
        name?: string[];
        email?: string[];
        phone?: string[];
    }
}

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


export async function sendToBrokerAction(appState: AppState, prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
    const validatedFields = ContactSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Lūdzu, aizpildiet visus laukus.',
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    
    const finalState = {
        ...appState,
        contact: validatedFields.data,
    };

  try {
    const emailContent = formatDataForEmail(finalState);
    
    // In a real application, you would use a service like Resend, SendGrid, or Nodemailer
    // For this example, we're just logging it to the console.
    console.log("--- SŪTĪŠANA BROKERIM ---");
    console.log(emailContent);
    console.log("------------------------");
    
    return { message: "Pieteikums veiksmīgi nosūtīts! Mūsu speciālists drīzumā ar Jums sazināsies." };

  } catch (error) {
    console.error("Kļūda sūtot e-pastu:", error);
    return { message: "Notikusi neparedzēta kļūda. Lūdzu, mēģiniet vēlāk." };
  }
}
