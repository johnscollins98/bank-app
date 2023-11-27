'use client';

import { Button } from '@nextui-org/react';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  return (
    <div className="flex flex-1 flex-col gap-5 items-center justify-center">
      Please sign in to use this application.
      <Button onClick={() => signIn('google')}>Sign in</Button>
    </div>
  );
}
