import { Hero } from "@/components/sections/hero";
import { BentoGridSection } from "@/components/sections/bento-grid";
import { ExperienceSection } from "@/components/sections/experience";
import { ProjectsSection } from "@/components/sections/projects";
import { ContactSection } from "@/components/sections/contact";
import { TextRevealWrapper } from "@/components/ui/text-reveal-wrapper";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 md:gap-24 pb-24">
      <Hero />
      <TextRevealWrapper text="Building high-quality software with a focus on performance, scalability, and user experience." />
      <BentoGridSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}
