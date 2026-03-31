import { LoginForm } from "@/modules/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — GBR Platform",
  description: "Sign in to your GBR account.",
};

export default function LoginPage() {
  return <LoginForm />;
}
