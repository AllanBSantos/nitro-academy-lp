import {
  Carousel as CdnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import Card, { CardProps } from "@/components/Card";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const cardsContent: CardProps[] = [
  {
    title: "Estagiando com uma Youtuber",
    description: "Mergulhe no universo do YouTube e aprenda como transformar suas ideias em vídeos incríveis! Descubra como planejar, gravar e editar conteúdos envolventes, além de entender estratégias para crescer no digital No final, você publicará seu próprio vídeo sobre o uso do tempo dos adolescentes!",
  },
  {
    title: "Explorando a Ciência ao Seu Redor",
    description: "Já imaginou ser um cientista e publicar sua própria descoberta? Neste curso, você vai explorar e investigar suas curiosidades usando o método científico! Com a orientação de uma mentora especialista, você vai criar e testar hipóteses, registrar seus achados e escrever um artigo científico de verdade Ao final, seu estudo será publicado na Revista Científica da Nitro Academy",
  },
  {
    title: "Escrevendo um Livro de sua Autoria",
    description: "Você sabia que qualquer pessoa pode escrever um livro? Sabia que pode aperfeiçoar sua habilidade de escrita de um jeito leve e divertido? Neste projeto, você vai transformar suas ideias em uma história escrita! Com a orientação de uma mentora que escreveu e publicou o livro dela em 2023, você aprenderá como trilhar esse caminho No final, você terá um livro de autoria própria em suas mãos e sua obra será publicada em uma coletânea exclusiva da Nitro Academy!",
  },
  {
    title: "Descobrindo o Mundo do Empreendedorismo",
    description: "Você fará parte de uma empresa virtual que está em expansão e vai realizar pesquisa de mercado, marketing, vendas, atendimento a clientes e explorar fundamentos práticos do empreendedorismo com um empreendedor que fundou uma startup Se você acha que tudo isso é apenas um jogo, você vai se surpreender",
  },
  {
    title: "Quizzes, Stories and Friendship",
    description: "E se aprender inglês fosse mais do que estudar gramática? Neste curso, você vai explorar histórias inspiradoras, participar de discussões significativas e testar seus conhecimentos com quizzes dinâmicos, tudo enquanto pratica o idioma! Através de atividades interativas e reflexões em grupo, você desenvolverá tanto o inglês quanto as qualidades como empatia, colaboração e pensamento crítico",
  },
  {
    title: "Explorando o Mercado Imobiliário",
    description: "Já imaginou ajudar sua família a encontrar a casa dos sonhos ou fazer negócios inteligentes no mercado imobiliário? Neste curso, você aprenderá como pesquisar imóveis, avaliar preços e identificar boas oportunidades, tornando-se um verdadeiro caçador de imóveis!",
  },
  {
    title: "Criando sua Própria Fragrância",
    description: "Você já imaginou criar um perfume que seja só seu? Neste curso, você vai aprender com especialistas como extrair aromas das plantas que você pode encontrar na sua região, entender os efeitos terapêuticos dos cheiros e criar fragrâncias únicas que podem até ajudar no bem-estar",
  },
  {
    title: "Produção de Vídeo com IA",
    description: "E se você pudesse usar inteligência artificial para criar vídeos incríveis de forma mais rápida e criativa? Neste curso, você vai explorar ferramentas de IA para roteirizar, editar e até gerar cenas automaticamente! Aprenda a transformar suas ideias em produções impressionantes, combinando criatividade com tecnologia de ponta",
  },
  {
    title: "Aprendendo a Dublar Personagens",
    description: "Já imaginou emprestar sua voz para personagens incríveis? Neste curso, você mergulhará no universo da dublagem de animação, aprendendo técnicas para interpretar diferentes vozes, dar emoção às falas e sincronizar com os movimentos dos personagens Prepare-se para criar e dublar cenas, experimentando o poder da sua voz para contar histórias!",
  },
  {
    title: "Wellness Lab: Saúde e Beleza",
    description: "E se você pudesse hackear sua saúde com ciência, nutrição e cuidados naturais? Neste curso, você vai descobrir como os alimentos que consome impactam sua energia, saúde, bem-estar e até a aparência da sua pele e cabelo! Aprenda com uma nutricionista a testar receitas saudáveis, criar fórmulas naturais para skincare e usar a ciência a seu favor para ter mais disposição, bem-estar e confiança no dia a dia!",
  },
  {
    title: "Storytelling in English",
    description: "Você tem histórias incríveis para contar — por que não contá-las em inglês? Neste curso, você vai aprender a criar personagens, construir narrativas e dar vida às suas ideias em outro idioma Com uma professora canadense, descubra como a língua inglesa pode ser uma ferramenta para expressar quem você é e imaginar novos mundos",
  },
  {
    title: "Comunicação Sem Medo",
    description: "Você já sentiu que suas ideias não são ouvidas? Admira quando as pessoas conseguem inspirar e liderar com naturalidade? Neste curso, você vai aprender a se comunicar de forma clara e confiante, desenvolvendo a arte da influência e da liderança Com técnicas de comunicação persuasiva, expressão corporal e escuta ativa, você descobrirá como engajar qualquer público e se tornar um líder que faz a diferença!",
  },
  {
    title: "Futemática: o Segredo do Gol",
    description: "Você sabia que Neymar entende de matemática? Mas não é a matemática que você está pensando! Neste curso, você vai descobrir qual O Pep Guardiola acabou com a magia do futebol porque ele trouxe matemática pro negócio Você quer resgatar a magia ou vencer a partida? Independente do objetivo, o caminho é um só: tÁTICA, matemÁTICA",
  },
]

export default function Carousel() {
  const t = useTranslations('Carousel');

  return (
    <div className="flex flex-col items-center bg-theme-orange py-10 shadow-[inset_0px_-12px_0px_0px_#19184b] rounded-b-2xl">
      <h1 className="py-10 text-4xl font-gilroy-extrabold sm:text-6xl">
        {t('Escolha um projeto')}
      </h1>
      <CdnCarousel opts={{
        align: "center",
        loop: true,
      }}
        className="w-[75%]"
      >
        <CarouselContent>
          {
            cardsContent.map((props) => (
              <CarouselItem className="basis-full" key={props.title}>
                <Card {...props} />
              </CarouselItem>
            ))
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </CdnCarousel>
      <div className="flex items-center justify-center w-full pt-14">
        <Link href="https://wa.me/5511975809082?text=Visitei%20o%20site%20da%20Nitro%20Academy%20e%20queria%20saber%20mais%21">
          <Button className="rounded-xl bg-background text-lg font-bold py-8 px-12 hover:bg-[#0c0c25] transition-colors duration-200">{t('Saiba mais')}</Button>
        </Link>
      </div>
    </div>
  )
}
