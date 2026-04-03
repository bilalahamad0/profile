import { HeroV2 } from "@/components/v2/HeroV2";
import { BentoGridV2 } from "@/components/v2/BentoGridV2";
import { ContactSection } from "@/components/sections/contact";
import { NavbarV2 } from "@/components/v2/NavbarV2";

export default function V2Home() {
  return (
    <div className="flex flex-col gap-0 pb-24 dark" id="top">
      <NavbarV2 />
      <HeroV2 />
      <BentoGridV2 />
      
      {/* Reuse the contact form from V1 so email works seamlessly */}
      <div id="contact-wrapper">
        <ContactSection />
      </div>
    </div>
  );
}
