import { setRequestLocale } from "next-intl/server";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

import TeenGuy from "@/components/image-cards/TeenGuy";
import Introduction from "@/components/text-cards/Introduction";
import OurApproach from "@/components/text-cards/OurApproach";
import WhyChooseNitro from "@/components/text-cards/WhyChooseNitro";
import ChildGuy from "@/components/image-cards/ChildGuy";
import OurGoal from "@/components/text-cards/OurGoal";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import CarouselClient from "@/components/CarouselClient";
import Perks from "../components/text-cards/Perks";

export default function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return (
    <div className="overflow-x-hidden">
      <Header />
      <TeenGuy locale={params.locale} />
      <Introduction locale={params.locale} />

      <OurApproach />
      <CarouselClient locale={params.locale} />
      <WhyChooseNitro locale={params.locale} />
      <div className="bg-theme-orange">
        <Perks />
      </div>
      <ChildGuy locale={params.locale} />
      <OurGoal />
      <Reviews />
      <Faq />
      <Footer />
    </div>
  );
}
