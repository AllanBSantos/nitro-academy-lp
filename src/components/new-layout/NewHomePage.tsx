"use client";

import { Hero } from "./Hero";
import { WhatIsNitro } from "./WhatIsNitro";
import { Program } from "./Program";
import { Competencies } from "./Competencies";
import { Differentials } from "./Differentials";
import { Projects } from "./Projects";
import { Mentors } from "./Mentors";
import { PartnerSchools } from "./PartnerSchools";
import { Reviews } from "./Reviews";
import { PricingCTA } from "./PricingCTA";
import { MentorCTA } from "./MentorCTA";
import { SchoolCTA } from "./SchoolCTA";

interface NewHomePageProps {
  locale?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function NewHomePage({ locale = "pt" }: NewHomePageProps) {
  return (
    <>
      <Hero />
      <WhatIsNitro />
      <Program />
      <Competencies />
      <Differentials />
      <Projects />
      <Mentors />
      <PartnerSchools />
      <Reviews />
      <PricingCTA />
      <MentorCTA />
      <SchoolCTA />
    </>
  );
}
