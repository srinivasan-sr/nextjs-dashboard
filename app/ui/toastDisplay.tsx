'use client';

import { Bounce, toast, } from "react-toastify";

export default function ToastDisplay({toastType, toastMessage}: {toastType: string | undefined, toastMessage: string | undefined}){
   
    toast(toastMessage, {
        autoClose: 5000,
        position: 'bottom-center',
        pauseOnHover: true,
        progress: 0.1,
        hideProgressBar: false,
        closeOnClick: true,
        transition: Bounce,
        type: 'success'

    });

    return(
        <>
        </>
    )
}