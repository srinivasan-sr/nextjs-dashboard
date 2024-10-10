'use client';

import {createContext, ReactNode} from 'react';

interface SnackbarContextType {
    (message: string,
        variant?: 'success' | 'error' | 'warning' | 'info'
    ): void
}

interface SnackbarProviderProps {
    children: ReactNode,
}

interface SnackbarState {
    show: boolean;
    message: string,
    variant: 'success' | 'error' | 'warning' | 'info'
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

const SNACKBAR_TIMER = 5000;