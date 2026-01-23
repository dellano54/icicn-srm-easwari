import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Marquee } from "@/components/landing/Marquee";
import { KeyDates } from "@/components/landing/KeyDates";
import { Footer } from "@/components/Footer";
import { AnimationWrapper } from "@/components/landing/AnimationWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | ICCICN '26",
  description: "International Conference on Computational Intelligence & Computer Networks",
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <AnimationWrapper>
        <Hero />
        <About />
        <Marquee />
        <KeyDates />
      </AnimationWrapper>
      <Footer />
    </main>
  );
}