import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Work from "@/components/Work";
import Arsenal from "@/components/Arsenal";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import GridBackground from "@/components/GridBackground";
import CrackBackground from "@/components/CrackBackground";
import Ripple from "@/components/Ripple";
import SectionDivider from "@/components/SectionDivider";

export default function Home() {
  return (
    <>
      <Cursor />
      <Ripple />
      <GridBackground />
      <CrackBackground />
      <Header />
      <main className="relative z-10">
        <Hero />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Work />
        <SectionDivider />
        <Arsenal />
        <SectionDivider />
        <Experience />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
