"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="signout-btn"
    >
      [ SIGN OUT ]
    </button>
  );
}
