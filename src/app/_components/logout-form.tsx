"use client";

import { Button } from "@nextui-org/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";

export default function LogoutForm({ session }: { session: Session }) {
  return (
    <div className="flex items-center justify-between">
      Hello, {session.user?.name?.split(" ")[0]}
      <Button size="sm" onClick={() => signOut()}>
        <MdLogout />
      </Button>
    </div>
  );
}
