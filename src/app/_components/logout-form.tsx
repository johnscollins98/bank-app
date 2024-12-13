"use client";

import { User } from "@/lib/user";
import { Button } from "@nextui-org/button";
import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";

export default function LogoutForm({ user }: { user: User }) {
  return (
    <div className="flex items-center justify-between">
      Hello, {user.name?.split(" ")[0]}
      <Button size="sm" onPress={() => signOut()}>
        <MdLogout />
      </Button>
    </div>
  );
}
