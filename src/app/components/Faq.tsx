import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqItem = {
  question: string;
  answer: string | React.ReactNode;
};

const getQuestions = (t: (value: string) => string): FaqItem[] => [
  {
    question: "O que é a Nitro Academy?",
    answer:
      "A Nitro Academy é uma escola online para alunos de 11 a 17 anos que desejam aprender além da escola tradicional Com aulas dinâmicas, grupos pequenos e uma abordagem baseada em projetos, nossos alunos desenvolvem criatividade, liderança, pensamento crítico e muito mais!",
  },
  {
    question: "Por que a Nitro é diferente?",
    answer: (
      <ul>
        <li className="pb-4">
          •{" "}
          {t(
            "Turmas reduzidas, projetos práticos e uma abordagem moderna Aqui, você desenvolve habilidades que as escolas tradicionais não ensinam"
          )}
        </li>
        <li>
          •{" "}
          {t("Mais autonomia, mais criatividade e mais preparo para o futuro")}
        </li>
      </ul>
    ),
  },
  {
    question: "Qual a metodologia da Nitro?",
    answer:
      "Nossa abordagem é centrada no aluno Com projetos práticos, os adolescentes aplicam conhecimentos em desafios reais, como criar um negócio sustentável ou programar um jogo educativo Não ensinamos para provas – ensinamos para a vida",
  },
  {
    question:
      "Como saberei sobre o desenvolvimento que o meu filho está tendo na Nitro Academy?",
    answer:
      "Os pais receberão relatórios mensais sobre os projetos que o filho está desenvolvendo na Nitro e o seu progresso",
  },
  {
    question: "É necessário a presença do pai durante as aulas?",
    answer: "Não",
  },
  {
    question:
      "É possível a participação de crianças com necessidades neurológicas especiais?",
    answer:
      "Se os pais acreditam que o filho consiga participar de uma aula online concentrada, criar projetos ou resolver desafios, fique à vontade para inscrever o seu filho",
  },
];

export default function Faq() {
  const t = useTranslations("Faq");
  return (
    <div className="bg-theme-orange py-20 shadow-[inset_0px_-12px_0px_0px_#19184b] rounded-b-2xl">
      <p className="font-montserrat-black text-4xl text-background text-center pb-14">
        {t("Dúvidas?")}
      </p>
      <Accordion type="single" collapsible className="px-10">
        {getQuestions(t).map(({ answer, question }: FaqItem) => (
          <AccordionItem
            value={`item-${question}`}
            className="border-none"
            key={question}
          >
            <AccordionTrigger className="hover:no-underline font-sans font-bold text-lg">
              {t(question)}
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              {typeof answer === "string" ? t(answer) : answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
