import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Marquee } from "@/components/landing/Marquee";
import { KeyDates } from "@/components/landing/KeyDates";
import { Footer } from "@/components/Footer";
import { AnimationWrapper } from "@/components/landing/AnimationWrapper";

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