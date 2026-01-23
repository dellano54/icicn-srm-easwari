import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Team",
  description: "Register your team for ICCICN '26. Submit your paper and plagiarism report.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
