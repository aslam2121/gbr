"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const user = session?.user ?? null;

  return {
    session,
    user,
    status,
    isLoading: status === "loading",
    isLoggedIn: () => status === "authenticated" && !!user,
    isCompany: () => user?.user_type === "company",
    isInvestor: () => user?.user_type === "investor",
    isExpert: () => user?.user_type === "expert",
  };
}
