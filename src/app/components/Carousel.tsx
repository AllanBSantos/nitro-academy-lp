"use client";

import {
  Carousel as CdnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InfoCard from "./InfoCard";
import { useState, useEffect } from "react";

interface Project {
  id: number;
  titulo: string;
  descricao: string;
  mentor: string;
  mentor_link: string;
  imagem?: {
    url: string;
  };
  nivel?: string;
  modelo_aula?: string;
  objetivo?: string;
  pre_requisitos?: string;
  projetos?: string;
  licao_casa?: string;
  destaque?: string;
  info_adicional?: string;
}

export default function Carousel() {
  const t = useTranslations("Carousel");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/projeto?populate[projetos][populate]=imagem`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
          }
        );
        const data = await response.json();
        const projetos =
          data.data?.projetos || data.data?.attributes?.projetos || [];

        setProjects(projetos);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);


  return (
    <div className="flex flex-col items-center bg-white py-10 shadow-[inset_0px_-12px_0px_0px_#19184b] rounded-b-2xl">
      <h1 className="py-10 text-4xl font-gilroy-extrabold sm:text-6xl text-[#FF6D3A]">
        {t("Escolha um projeto")}
      </h1>
      <CdnCarousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-[85%] px-4"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {projects?.map((project) => (
            <CarouselItem
              key={project.id}
              className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <div className="h-full flex flex-col overflow-y-auto">
                <InfoCard
                  image={{
                    url: `${process.env.NEXT_PUBLIC_STRAPI_URL}${
                      project.imagem?.url || ""
                    }`,
                  }}
                  title={project.titulo}
                  description={project.descricao}
                  mentor={project.mentor}
                  mentorLink={project.mentor_link}
                  level={project.nivel}
                  classModel={project.modelo_aula}
                  target={project.objetivo}
                  requirements={project.pre_requisitos}
                  projects={project.projetos}
                  homework={project.licao_casa}
                  highlight={project.destaque}
                  additionalInfo={project.info_adicional}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </CdnCarousel>
      <div className="flex items-center justify-center w-full pt-14">
        <Link href="https://wa.me/5511975809082?text=Visitei%20o%20site%20da%20Nitro%20Academy%20e%20queria%20saber%20mais%21">
          <Button className="rounded-xl bg-background text-lg font-bold py-8 px-12 hover:bg-[#0c0c25] transition-colors duration-200">
            {t("Saiba mais")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
