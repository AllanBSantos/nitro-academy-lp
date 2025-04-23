import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
type ContentItem = {
  label: {
    title: string;
    titleClassName?: string;
    className?: string;
    backgroundColor: string;
  };
  description: {
    className?: string;
    text: string;
  };
};
const content: ContentItem[] = [
  {
    label: {
      title: "Flexibilidade",
      backgroundColor: "bg-background",
    },
    description: {
      text: "Pagamento por matéria, horários adaptáveis e acesso internacional",
    },
  },
  {
    label: {
      title: "Metodologia Inovadora",
      backgroundColor: "bg-[#1d358d]",
      className: "pr-8",
    },
    description: {
      text: "Projetos estimulantes em áreas de interesse do aluno",
    },
  },
  {
    label: {
      title: "Foco no Futuro",
      backgroundColor: "bg-theme-orange",
    },
    description: {
      text: "Preparação para vida profissional e autoconhecimento, sem competir com a escola regular",
    },
  },

  {
    label: {
      title: "Conteúdo Variado",
      backgroundColor: "bg-[#e69223]",
    },
    description: {
      text: "Mais de 10 projetos para explorar",
    },
  },
];

export default function Perks() {
  const t = useTranslations("Perks");
  return (
    <div className="bg-blue-light rounded-2xl px-12 py-16 flex flex-col gap-10 z-10 shadow-[0px_-12px_0px_0px_#19184b]">
      {content.map(({ label, description }) => (
        <div key={label.title}>
          <div
            className={cn(
              "text-center rounded-full bg-background w-fit py-1.5 pl-4 pr-12 whitespace-nowrap",
              label.backgroundColor,
              label.className
            )}
          >
            <p
              className={cn(
                "font-gilroy-extrabold text-xl",
                label.titleClassName
              )}
            >
              {t(label.title)}
            </p>
          </div>
          <p
            className={cn(
              "font-montserrat-regular font-bold text-lg pl-4 pt-1",
              description.className
            )}
          >
            {t(description.text)}
          </p>
        </div>
      ))}
    </div>
  );
}
