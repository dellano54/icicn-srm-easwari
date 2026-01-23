import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Login",
  description: "Login to your ICCICN '26 team dashboard to check status and payments.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
