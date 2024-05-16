"use client";

import { User } from "@/lib/user";
import { Button } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";

export default function LogoutForm({ user }: { user: User }) {
  return (
    <div className="flex items-center justify-between">
      Hello, {user.name?.split(" ")[0]}
      <Button size="sm" onClick={() => signOut()}>
        <MdLogout />
      </Button>
    </div>
  );
}
