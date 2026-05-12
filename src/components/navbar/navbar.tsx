import { auth } from '@/src/auth';
import React from 'react';
import { ClientNavBar } from './client-navbar';

export const NavBar = async () => {
    const session = await auth();
    const isLoggedIn = Boolean(session?.user?.id);
    return <ClientNavBar isLoggedIn={isLoggedIn} />;
};
