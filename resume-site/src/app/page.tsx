import { HeroPortfolio } from "@/components/v3/HeroPortfolio";
import { BentoGridV2 } from "@/components/v2/BentoGridV2";

import { NavbarV2 } from "@/components/v2/NavbarV2";

export default function V2Home() {
  return (
    <div className="flex flex-col gap-0 pb-24 dark md:overflow-x-hidden" id="top">
      <NavbarV2 />
      <HeroPortfolio />
      <BentoGridV2 showOnlyResume={false} />
      

    </div>
  );
}
