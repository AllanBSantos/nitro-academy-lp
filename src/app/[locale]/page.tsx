import { setRequestLocale } from "next-intl/server";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import TeenGuy from "@/components/image-cards/TeenGuy";
import Reviews from "@/components/Reviews";
import CarouselClient from "@/components/CarouselClient";
import VturbVideo from "@/components/VturbVideo";
import InternationalSection from "@/components/InternationalSection";

export default function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return (
    <div className="overflow-x-hidden">
      <Header />
      <TeenGuy locale={params.locale} />
      <div className="bg-white py-12 sm:py-20 px-4 sm:px-10">
        <div className="max-w-[1200px] mx-auto aspect-video w-full">
          <VturbVideo />
        </div>
      </div>
      <div className="bg-gray-100 py-12 sm:py-20 px-4 sm:px-10">
        <InternationalSection />
      </div>

      <div id="cursos" className="bg-white sm:py-20 px-4 sm:px-10">
        <CarouselClient locale={params.locale} />
      </div>

      <Reviews locale={params.locale} />
      <Footer />
    </div>
  );
}
