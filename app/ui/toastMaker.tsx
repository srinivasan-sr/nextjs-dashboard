'use server';

import { cookies } from "next/headers";
import ToastDisplay from "./toastDisplay";
export const ToastMaker = () => {
    const toastMessage = cookies().get('toastMessage')?.value;
    const toastType = cookies().get('toastType')?.value;
    
    return <ToastDisplay toastMessage={toastMessage} toastType={toastType} />

}