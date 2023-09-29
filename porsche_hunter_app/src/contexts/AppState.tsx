import React, { createContext, useEffect, useState } from 'react';
import { useAuthentication } from '../hooks/UseAuthentication';

export interface Hunter {
    uuid: string;
    firstName: string;
    lastName: string;
    hunterName: string;
    password: string;
    emailAddress: string;
    avatarUrl?: string;
    dateOfBirth: string;
};

export interface _AppState {
    authenticatedHunter?: Hunter;
    activeToken?: string;
};

export const AppStateContext = createContext<any>({}); // can be typed more exactly

export default function AppState({ children }: { children: React.ReactNode }) {
    const [appState, setAppState] = useState<any>({});

    const updateAppState = (newAppState: _AppState) => {
        setAppState(newAppState);
    };

    return (
        <AppStateContext.Provider value={{appState, updateAppState}}>
            {children}
        </AppStateContext.Provider>
    );
};
