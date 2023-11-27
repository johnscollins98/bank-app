'use client';

import { Button } from '@nextui-org/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

export default function LogoutForm({ session }: { session: Session }) {
  return (
    <div className="flex justify-between items-center">
      Hello, {session.user?.name?.split(' ')[0]}
      <Button size="sm" onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
}
