'use server';
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});
const CreateInvoice = FormSchema.omit({id: true, date: true});
const UpdateInvoice = FormSchema.omit({id: true, date: true});

export async function createInvoice(formData: FormData) {
    const rawFormData = CreateInvoice.parse(Object.fromEntries(formData.entries()));
    const {customerId, status, amount} = rawFormData;
    const amountInDecimal = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInDecimal}, ${status}, ${date})
    `;
    //Clear the client cache and make new request, followed by redirecting to invoices page
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData){
    const rawFormData = UpdateInvoice.parse(Object.fromEntries(formData.entries()));
    const {customerId, amount, status} = rawFormData;
    const amountInDecimal = amount * 100;

    // Update the database via SQL command
    await sql`
    UPDATE invoices
    SET customer_id=${customerId}, amount=${amountInDecimal}, status=${status}
    WHERE id=${id}
    `;

    //Clear the client cache and make new request, followed by redirecting to invoices page
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string){
    await sql`
    DELETE FROM invoices where id = ${id}
    `;
    revalidatePath('/dashboard/invoices');
}