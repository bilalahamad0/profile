import { HeroV2 } from "@/components/v2/HeroV2";
import { BentoGridV2 } from "@/components/v2/BentoGridV2";
import { ContactSection } from "@/components/sections/contact";

export default function V2Home() {
  return (
    <div className="flex flex-col gap-0 pb-24 dark">
      {/* 
        We enforce dark mode on this wrapper explicitly by adding "dark" class, 
        or rely on the layout wrapper if it is already dark. 
      */}
      <HeroV2 />
      <BentoGridV2 />
      
      {/* Reuse the contact form from V1 so email works seamlessly */}
      <div id="contact" className="pt-24">
        <ContactSection />
      </div>
    </div>
  );
}
