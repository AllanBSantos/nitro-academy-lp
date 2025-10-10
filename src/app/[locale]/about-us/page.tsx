"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AboutUs({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations("AboutUs");

  return (
    <div className="bg-white text-gray-800 font-sans">
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="py-10 text-4xl font-gilroy-extrabold sm:text-6xl text-theme-orange text-center">
            {t("title")}
          </h1>
          <p className="mb-6 text-lg text-[#1C1C1C]">{t("foundation")}</p>
          <p className="mb-6 text-lg text-[#1C1C1C]">{t("inspiration")}</p>
          <blockquote className="italic border-l-4 border-[#03A9F4] pl-4 mb-4 text-[#1C1C1C]">
            &ldquo;{t("quote1")}&rdquo;
            <span
              style={{ fontSize: "0.7em", verticalAlign: "super" }}
              className="ml-1"
            >
              ¹
            </span>
          </blockquote>
          <p className="mb-6 text-lg text-[#1C1C1C]">{t("nobleCreation")}</p>
          <blockquote className="italic border-l-4 border-[#03A9F4] pl-4 mb-4 text-[#1C1C1C]">
            &ldquo;{t("quote2")}&rdquo;
            <span
              style={{ fontSize: "0.7em", verticalAlign: "super" }}
              className="ml-1"
            >
              ¹
            </span>
          </blockquote>
          <p className="mb-6 text-lg text-[#1C1C1C]">
            {t("internationalSchool")}
          </p>
          <blockquote className="italic border-l-4 border-[#03A9F4] pl-4 mb-4 text-[#1C1C1C]">
            &ldquo;{t("quote3")}&rdquo;
            <span
              style={{ fontSize: "0.7em", verticalAlign: "super" }}
              className="ml-1"
            >
              ¹
            </span>
          </blockquote>
          <p className="mb-6 text-lg text-[#1C1C1C]">
            {t("professionalJourney")}
          </p>
          <blockquote className="italic border-l-4 border-[#03A9F4] pl-4 mb-4 text-[#1C1C1C]">
            &ldquo;{t("quote4")}&rdquo;
            <span
              style={{ fontSize: "0.7em", verticalAlign: "super" }}
              className="ml-1"
            >
              ¹
            </span>
          </blockquote>
          <p className="mb-6 text-lg text-[#1C1C1C]">
            {t("civilizationAdvancement")}
          </p>
          <p className="mb-6 text-lg text-[#1C1C1C]">{t("dailyDedication")}</p>
          <p className="mt-8 mb-6 text-lg text-[#1C1C1C]">
            {t("sincerely")}
            <br />
            <strong>Samareh e Vahid</strong>
          </p>
          <p className="mt-2 text-[11px] text-[#1C1C1C]">
            {t("bahaiReference")}
          </p>
        </div>
      </section>

      <section className="bg-theme-orange py-16 px-4 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="py-10 text-4xl font-gilroy-extrabold sm:text-6xl text-white text-center">
            {t("team")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                name: t("teamMembers.vahid.name"),
                linkedin: "https://www.linkedin.com/in/vahidsherafat/",
                desc: t("teamMembers.vahid.desc"),
                image: `/${locale}/vahid.png`,
              },
              {
                name: t("teamMembers.samareh.name"),
                linkedin:
                  "https://www.linkedin.com/in/samareh-shams-sherafat-4bb28453/",
                desc: t("teamMembers.samareh.desc"),
                image: `/${locale}/samareh.png`,
              },

              {
                name: t("teamMembers.barbara.name"),
                linkedin:
                  "https://www.linkedin.com/in/barbara-de-padua-b1217a1ab/",
                desc: t("teamMembers.barbara.desc"),
                image: `/${locale}/barbara.jpeg`,
              },
              {
                name: t("teamMembers.allan.name"),
                linkedin: "https://www.linkedin.com/in/allan-barros-santos",
                desc: t("teamMembers.allan.desc"),
                image: `/${locale}/allan.jpeg`,
              },
            ].map((person, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md p-6 text-center flex flex-col h-full"
              >
                <div className="w-full aspect-square rounded-xl bg-gray-200 mb-4 mx-auto max-w-[200px]">
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#1C1C1C] mb-2">
                  {person.name}
                </h3>
                <p className="text-sm text-gray-700 mb-2 flex-grow">
                  {person.desc}
                </p>
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#03A9F4] hover:underline text-sm mt-auto"
                >
                  {t("viewLinkedIn")}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
