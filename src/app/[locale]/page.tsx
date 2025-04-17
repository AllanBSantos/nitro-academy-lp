import { setRequestLocale } from "next-intl/server";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

import TeenGuy from "@/components/image-cards/TeenGuy";
import Introduction from "@/components/text-cards/Introduction";
import MiniUniversity from "@/components/text-cards/MiniUniversity";
import ChildGirl from "@/components/image-cards/ChildGirl";
import HaveYouImagined from "@/components/text-cards/HaveYouImagined";
import OurApproach from "@/components/text-cards/OurApproach";
import WhyChooseNitro from "@/components/text-cards/WhyChooseNitro";
import Perks from "@/components/text-cards/Perks";
import HowItWorks from "@/components/text-cards/HowItWorks";
import ChildGuy from "@/components/image-cards/ChildGuy";
import OurGoal from "@/components/text-cards/OurGoal";
import Parents from "@/components/image-cards/Parents";
import Faq from "@/components/Faq";
import CarouselClient from "@/components/CarouselClient";

export default function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return (
    <div className="overflow-x-hidden">
      <Header />
      <TeenGuy />
      <Introduction />
      <MiniUniversity />
      <ChildGirl />
      <HaveYouImagined />
      <OurApproach />
      <CarouselClient locale={params.locale} />
      <WhyChooseNitro />
      <div className="bg-theme-orange">
        <Perks />
        <HowItWorks />
      </div>
      <ChildGuy />
      <OurGoal />
      <Parents />
      <Faq />
      <Footer />
    </div>
  );
}
