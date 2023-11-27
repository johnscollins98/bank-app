"use client";

import { Button } from '@nextui-org/react';
import { signOut } from 'next-auth/react';

export default function Forbidden() {
  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <div className="flex flex-col gap-4 items-center">
        You do not have permission to view this page.
        <Button onClick={() => signOut({ redirect: true, callbackUrl: '/' })}>Sign out</Button>
      </div>
    </div>
  );
}
