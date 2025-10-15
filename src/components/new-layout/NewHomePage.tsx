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
import Chatwoot from "../Chatwoot";
import { getCardsContent } from "@/lib/courses";
import { CardProps } from "@/types/card";

interface NewHomePageProps {
  locale?: string;
}

export default async function NewHomePage({ locale = "pt" }: NewHomePageProps) {
  // Fetch courses data on the server
  let courses: CardProps[] = [];
  let coursesError: string | null = null;

  try {
    courses = await getCardsContent(locale);
  } catch (error) {
    console.error("Failed to load courses:", error);
    coursesError = "Failed to load courses";
  }

  return (
    <>
      <Hero locale={locale} />
      <WhatIsNitro />
      <Program />
      <Competencies />
      <Differentials />
      <Projects courses={courses} error={coursesError} />
      <Mentors />
      <PartnerSchools />
      <Reviews />
      <PricingCTA />
      <MentorCTA />
      <SchoolCTA />
      <Chatwoot />
    </>
  );
}
