'use server';
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
){
    try{
        await signIn('credentials', formData);
    }catch(error){
        if(error instanceof AuthError){
            switch(error.type){
                case 'CredentialsSignin': return 'Invalid Credentials';
                default: return 'Something went wrong';
            }
        }
        throw error;
    }
}
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce.number().gt(0, {message: 'Please enter an amount greater than ₹0.'}),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.'
    }),
    date: z.string(),
});
const CreateInvoice = FormSchema.omit({id: true, date: true});
const UpdateInvoice = FormSchema.omit({id: true, date: true});

export type State = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
  };

export async function createInvoice(prevState: State, formData: FormData) {
    console.log(prevState);
    console.log(Object.fromEntries(formData.entries()));
    const rawFormData = CreateInvoice.safeParse(Object.fromEntries(formData.entries()));
    console.log('Customer ID = ', rawFormData.data?.customerId);
    if(!rawFormData.success){
        return {
            errors: rawFormData.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to create invoice',
        }
    }
    const {customerId, status, amount} = rawFormData.data;
    const amountInDecimal = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    try{
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInDecimal}, ${status}, ${date})
    `;
    }catch(_){
        return {
            message: 'Database Error: Failed to create Invoice',
        };  
    }
    //Clear the client cache and make new request, followed by redirecting to invoices page
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, prevState: State, formData: FormData){
    const rawFormData = UpdateInvoice.safeParse(Object.fromEntries(formData.entries()));
    if(!rawFormData.success){
        return {
            errors: rawFormData.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to update invoice',
        }
    }
    const {customerId, amount, status} = rawFormData.data;
    const amountInDecimal = amount * 100;
    try{
    // Update the database via SQL command
    await sql`
    UPDATE invoices
    SET customer_id=${customerId}, amount=${amountInDecimal}, status=${status}
    WHERE id=${id}
    `;
    }catch(_){
        return {
            message: 'Database Error: Failed to update Invoice',
        };
    }
    //Clear the client cache and make new request, followed by redirecting to invoices page
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string){
    // throw new Error('Failed to Delete Invoice');
    try{
    await sql`
    DELETE FROM invoices where id = ${id}
    `;
    revalidatePath('/dashboard/invoices');
    return {message: 'Deleted Invoice'};
    }catch(_){
        return {
            message: 'Database Error: Failed to delete Invoice',
        };
    }
    
}

