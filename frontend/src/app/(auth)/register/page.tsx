import { DynamicRegisterForm } from "@/modules/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register — GBR Platform",
  description: "Create your GBR account as a Company, Investor, or Expert.",
};

export default function RegisterPage() {
  return <DynamicRegisterForm />;
}
