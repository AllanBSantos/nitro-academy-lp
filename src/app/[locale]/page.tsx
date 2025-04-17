import { setRequestLocale } from "next-intl/server";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

import TeenGuy from "@/components/image-cards/TeenGuy";
import Introduction from "@/components/text-cards/Introduction";
import MiniUniversity from "@/components/text-cards/MiniUniversity";
import OurApproach from "@/components/text-cards/OurApproach";
import WhyChooseNitro from "@/components/text-cards/WhyChooseNitro";
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
      <OurApproach />
      <CarouselClient locale={params.locale} />
      <WhyChooseNitro />
      <ChildGuy />
      <OurGoal />
      <Parents />
      <Faq />
      <Footer />
    </div>
  );
}
