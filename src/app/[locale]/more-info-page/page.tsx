import Header from "@/app/components/Header";
import { ReactNode } from "react";
import PlanCarousel from "@/app/components/PlanCarousel";
import Footer from "@/app/components/Footer";
import MentorsGrid from "@/app/components/MentorsGrid";
import { fetchCurrentCampaign } from "@/lib/strapi";
import { useTranslations } from "next-intl";
import ImpactStats from "@/app/components/ImpactStats";
import { Badge } from "@/app/components/ui/badge";
import Reviews from "@/app/components/Reviews";
import OurClients from "../../../components/OurClients";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Smartphone,
  Target,
  School,
  UsersRound,
  Laptop,
  Lightbulb,
  Sparkles,
  Goal,
  BrainCircuit,
  FlaskConical,
  Users,
  Clock,
  CalendarPlus,
  CalendarCheck,
  FileText,
  Package,
  Globe,
} from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function MoreInfoPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = useTranslations("MoreInfo");

  async function ScheduleSection() {
    const campaign = await fetchCurrentCampaign();
    return (
      <Section className="bg-white">
        <SectionTitle>Cronograma de Início próximo ciclo</SectionTitle>
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-orange-100 p-3 rounded-full w-fit">
                <CalendarPlus
                  className="h-8 w-8 text-orange-600"
                  aria-hidden="true"
                />
              </div>
              <CardTitle className="mt-4">
                Prazo para Inscrição dos Alunos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700">
                <strong className="text-gray-900">
                  {campaign?.periodo_inscricao || "—"}
                </strong>
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-orange-100 p-3 rounded-full w-fit">
                <CalendarCheck
                  className="h-8 w-8 text-orange-600"
                  aria-hidden="true"
                />
              </div>
              <CardTitle className="mt-4">
                Período de Início e Fim das Aulas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700">
                <strong className="text-gray-900">
                  {campaign?.inicio_e_fim_aulas || "—"}
                </strong>
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
    );
  }
  const p1Paragraphs = t("what_is.full_text.p1")
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const p2Paragraphs = t("what_is.full_text.p2")
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const modalParagraphs = [...p1Paragraphs, ...p2Paragraphs];
  const targetEnd = "para a rotina e os interesses dos filhos.";
  const previewParagraphs: string[] = [];
  for (const p of [...p1Paragraphs, ...p2Paragraphs]) {
    previewParagraphs.push(p);
    if (p.endsWith(targetEnd)) break;
  }

  const desafios = [
    {
      icon: (
        <Smartphone className="h-6 w-6 text-orange-600" aria-hidden="true" />
      ),
      title: "Excesso de Telas",
      description:
        "Adolescentes imersos em redes sociais, jogos e distrações digitais que aumentam ansiedade e imediatismo.",
    },
    {
      icon: <Target className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: "Falta de Propósito",
      description:
        "Dificuldade em manter foco em atividades que exigem constância e desenvolvimento de competências essenciais.",
    },
    {
      icon: <School className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: "Educação que prepara",
      description:
        "Busca por um ensino que prepare para o futuro profissional e com cursos que potencializem o ensino regular.",
    },
  ];

  const solucoes = [
    {
      icon: (
        <UsersRound className="h-6 w-6 text-orange-600" aria-hidden="true" />
      ),
      title: "Mentorias Online e Síncronas",
      description: "Com profissionais experientes do Brasil e do mundo",
    },
    {
      icon: <Laptop className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: "Projetos Práticos",
      description: "Desenvolvendo competências essenciais para o futuro",
    },
    {
      icon: (
        <Lightbulb className="h-6 w-6 text-orange-600" aria-hidden="true" />
      ),
      title: "Temas Atuais",
      description:
        "Liderança, comunicação, empreendedorismo, inteligência artificial, UX/UI",
    },
  ];

  const beneficios = [
    {
      icon: <Sparkles className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: "Descoberta de Talentos",
      description:
        "Cada adolescente carrega dons únicos. Nossos mentores despertam novas habilidades e incentivam o reconhecimento do potencial individual.",
    },
    {
      icon: <Goal className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: "Desenvolvimento de Propósito",
      description:
        "Direcionamos os adolescentes a entender como seus talentos podem contribuir para um propósito maior na sociedade.",
    },
    {
      icon: (
        <BrainCircuit className="h-6 w-6 text-orange-600" aria-hidden="true" />
      ),
      title: "Competências do Futuro",
      description:
        "Desenvolvemos autonomia, trabalho em equipe, pensamento crítico, resolução de problemas e criatividade.",
    },
    {
      icon: (
        <FlaskConical className="h-6 w-6 text-orange-600" aria-hidden="true" />
      ),
      title: "Conhecimento Prático",
      description:
        "Projetos desafiantes e divertidos que expandem horizontes de forma leve e educativa.",
    },
    {
      icon: <Users className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: "Conexões Valiosas",
      description:
        "Grupos que criam relacionamentos saudáveis com adolescentes que compartilham interesses similares.",
    },
    {
      icon: <Clock className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: "Flexibilidade",
      description:
        "Aulas uma vez por semana, permitindo conciliar com outras atividades e mantendo foco no desenvolvimento, sem sobrecarga.",
    },
  ];

  const comoFuncionaSteps = [
    {
      n: "1",
      t: "Escolha do Curso e Horário",
      d: "O adolescente e responsável escolhem o curso de acordo com interesses e disponibilidade do aluno.",
    },
    {
      n: "2",
      t: "Início Após Inscrição",
      d: "Após a matrícula, recebe acesso ao grupo do curso no WhatsApp, link da primeira aula e orientações completas.",
    },
    {
      n: "3",
      t: "Comunicação via WhatsApp",
      d: "grupo exclusivo para comunicação com alunos, responsáveis e mentores, garantindo orientação direta.",
    },
    {
      n: "4",
      t: "Aulas Online e Síncronas",
      d: "Ao vivo via Google Meet, turmas de 12 a 24 alunos, 50 minutos por aula, uma vez por semana.",
    },
    {
      n: "5",
      t: "Metodologia Baseada em Projetos",
      d: "Mentores especializados conduzem projetos práticos conectados ao mundo real.",
    },
    {
      n: "6",
      t: "Sistema de Gamificação",
      d: "Alunos acumulam Spinners baseados em engajamento que podem ser trocados por premiações.",
    },
    {
      n: "7",
      t: "Certificação",
      d: "Com 90% de frequência, o aluno recebe certificado reconhecendo desempenho e competências desenvolvidas.",
    },
  ];

  const diferenciais = [
    {
      icon: <FileText className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: "Relatório de desenvolvimento",
      description:
        "Análise contínua do progresso do aluno: frequência, resumo das atividades e engajamento nas aulas.",
    },
    {
      icon: <Package className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: "Desenvolvimento por completo",
      description:
        "Jornada que explora interesses, estabelece metas e desenvolve competências que ampliam o aprendizado.",
    },
    {
      icon: <Globe className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: "Visão Global",
      description:
        "Diversidade de experiências com mentores internacionais, ampliando horizontes e perspectivas.",
    },
  ];

  type SectionProps = { children: ReactNode; className?: string };
  const Section = ({ children, className = "" }: SectionProps) => (
    <section className={`py-12 sm:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );

  type SectionTitleProps = { children: ReactNode; className?: string };
  const SectionTitle = ({ children, className = "" }: SectionTitleProps) => (
    <h2
      className={`text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 ${className}`}
    >
      {children}
    </h2>
  );

  type FeatureCardProps = {
    icon: ReactNode;
    title: string;
    description: string;
  };
  const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
    <Card className="text-left h-full">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="bg-orange-100 p-3 rounded-full">{icon}</div>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[46rem] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src={`/${params.locale}/adolescente-menino.png`}
          alt="Adolescente usando o computador"
          priority={true}
          width={540}
          height={540}
          unoptimized
          className="absolute w-full h-[46rem] object-cover brightness-75"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e1b4b]/60 to-[#3B82F6]/60" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:py-12">
          <div className="flex flex-col items-center gap-8 text-center text-white">
            {/* Main Title */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <Image
                  src={`/${params.locale}/logo_nitro_transparente.png`}
                  alt="Nitro Academy Logo"
                  width={250}
                  height={70}
                  unoptimized
                  className="h-20 md:h-28 lg:h-32 w-auto"
                />
              </div>
              <p className="text-lg md:text-xl lg:text-2xl opacity-90 max-w-4xl font-medium">
                {t("subtitle")}
              </p>
            </div>

            {/* Service Badges */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Badge
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white px-6 py-3 text-base font-medium"
              >
                {t("badges.mentorships")}
              </Badge>
              <Badge
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white px-6 py-3 text-base font-medium"
              >
                {t("badges.projects")}
              </Badge>
              <Badge
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white px-6 py-3 text-base font-medium"
              >
                {t("badges.talents")}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* What Is Section */}
      <Section
        aria-labelledby="what-is-title"
        className="bg-white dark:bg-background"
      >
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="rounded-2xl p-8 shadow-lg ring-1 ring-gray-100 dark:ring-border bg-white dark:bg-card border border-gray-200 dark:border-border">
            <h2
              id="what-is-title"
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-foreground mb-4"
            >
              {t("what_is.title")}
            </h2>
            <div className="text-gray-700 dark:text-muted-foreground leading-relaxed space-y-4 max-w-3xl">
              {previewParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    className="px-5 bg-[#1e1b4b] text-white hover:bg-[#1e1b4b]/90 border-0 focus-visible:ring-2 focus-visible:ring-offset-2"
                    aria-haspopup="dialog"
                    aria-expanded="false"
                  >
                    {t("what_is.show_more")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-card p-6 sm:p-8 sm:rounded-2xl max-h-[80vh] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl">
                  <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-foreground">
                    {t("what_is.title")}
                  </DialogTitle>
                  <div className="space-y-4 mt-3 overflow-y-auto max-h-[60vh] pr-1 text-gray-700 dark:text-muted-foreground">
                    {modalParagraphs.map((paragraph, index) => (
                      <p key={index} className="text-lg leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </Section>

      {/* The Challenge & Our Solution Sections */}
      <Section className="bg-slate-50">
        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 border-l border-gray-200 pointer-events-none"></div>
          {/* Mobile: stack all desafios first, then solucoes */}
          <div className="lg:hidden space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              O Desafio dos Pais Modernos
            </h3>
            <div className="space-y-6">
              {desafios.map((item) => (
                <FeatureCard
                  key={`desafio-${item.title}`}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Nossa Solução
            </h3>
            <div className="space-y-6">
              {solucoes.map((s) => (
                <FeatureCard
                  key={`solucao-${s.title}`}
                  icon={s.icon}
                  title={s.title}
                  description={s.description}
                />
              ))}
            </div>
          </div>

          {/* Desktop: two columns aligned side by side */}
          <div className="hidden lg:grid grid-cols-2 gap-10 items-stretch content-start">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 pr-8">
              O Desafio dos Pais Modernos
            </h3>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 pl-8">
              Nossa Solução
            </h3>
            {desafios.map((item, idx) => (
              <>
                <div className="h-full pr-8" key={`desafio-${item.title}`}>
                  <FeatureCard
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                  />
                </div>
                {solucoes[idx] ? (
                  <div
                    className="h-full pl-8"
                    key={`solucao-${solucoes[idx].title}`}
                  >
                    <FeatureCard
                      icon={solucoes[idx].icon}
                      title={solucoes[idx].title}
                      description={solucoes[idx].description}
                    />
                  </div>
                ) : (
                  <div
                    className="h-full pl-8"
                    key={`solucao-empty-${idx}`}
                  ></div>
                )}
              </>
            ))}
          </div>
        </div>
      </Section>

      {/* Main Benefits Section */}
      <Section className="bg-white">
        <SectionTitle>Principais Benefícios</SectionTitle>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beneficios.map((b) => (
            <FeatureCard
              key={b.title}
              icon={b.icon}
              title={b.title}
              description={b.description}
            />
          ))}
        </div>
      </Section>

      {/* How It Works Section */}
      <Section className="bg-slate-50">
        <SectionTitle>Como Funciona a Nitro Academy</SectionTitle>
        <div className="max-w-4xl mx-auto space-y-4">
          {comoFuncionaSteps.map((s) => (
            <Card key={s.n} className="shadow-sm">
              <CardContent className="p-4 flex items-start gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-white font-bold text-xl">
                  {s.n}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{s.t}</h4>
                  <p className="text-gray-600 mt-1">{s.d}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Schedule Section */}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore Async Server Component */}
      <ScheduleSection />

      {/* Courses Section  */}
      {/* Courses Section - Separated by Plans */}
      <section className="bg-white">
        <div className="w-full px-6 md:px-10 lg:px-20 py-10 sm:py-14">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Cursos
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Escolha o plano que melhor se adapta às suas necessidades e
              descubra cursos incríveis para desenvolver seus adolescentes
            </p>
          </div>

          {/* Gold Plan Courses */}
          <PlanCarousel locale={params.locale} planType="gold" />

          {/* Black Plan Courses */}
          <PlanCarousel locale={params.locale} planType="black" />
        </div>
      </section>

      {/* Testimonials Section */}
      <Reviews />

      {/* Our Partners Section */}
      <OurClients />

      {/* Differentiators Section */}
      <Section className="bg-slate-50">
        <SectionTitle>Nossos Diferenciais</SectionTitle>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {diferenciais.map((d) => (
            <FeatureCard
              key={d.title}
              icon={d.icon}
              title={d.title}
              description={d.description}
            />
          ))}
        </div>
      </Section>

      {/* Mentors Section */}
      <Section className="bg-white">
        <SectionTitle>Equipe de Mentores Nitro</SectionTitle>
        <p className="text-gray-700 leading-relaxed max-w-5xl mx-auto mb-10 text-center">
          Nossos mentores são profissionais qualificados, com vivência prática e
          paixão por suas carreiras. São selecionados, treinados e gerenciados
          pela própria Nitro Academy, garantindo mentoria de excelência,
          conectada às necessidades do mercado e ao desenvolvimento integral de
          cada adolescente.
        </p>
        <MentorsGrid locale={params.locale} />
      </Section>

      {/* Impact Section */}
      <Section className="bg-slate-50">
        <SectionTitle>Impacto e Resultados</SectionTitle>
        <ImpactStats />
        <div className="mt-10">
          <h4 className="text-xl font-semibold text-gray-900 text-center">
            Competências Desenvolvidas
          </h4>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {[
              "Autonomia e Responsabilidade",
              "Pensamento Crítico",
              "Trabalho em Equipe",
              "Criatividade e Inovação",
              "Comunicação Eficaz",
              "Liderança",
            ].map((item) => (
              <Badge
                key={item}
                variant="outline"
                className="text-base py-1 px-3 border-orange-200 bg-orange-50 text-orange-800"
              >
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </Section>

      {/* 2026 Pedagogical Proposal Section */}
      <Section className="bg-[#1e1b4b] text-white">
        <SectionTitle className="!text-white">
          Proposta Pedagógica 2026: Uma Jornada de Crescimento Contínuo
        </SectionTitle>
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-lg text-white/90 leading-relaxed space-y-4">
            <p>
              A jornada pedagógica da Nitro Academy será estruturada em projetos
              coletivos semestrais. A cada semestre, o aluno participará de um
              projeto de 6 semanas, desenvolvendo habilidades práticas e
              colaborativas.
            </p>
            <p>
              Após cada projeto, haverá uma mentoria coletiva online (mentor e
              família) para:
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 mt-10">
            <Card className="bg-white text-gray-900">
              <CardContent className="p-6 flex items-center justify-center min-h-[120px]">
                <strong className="text-gray-900 text-center">
                  Contextualizar o projeto
                </strong>
              </CardContent>
            </Card>
            <Card className="bg-white text-gray-900">
              <CardContent className="p-6 flex items-center justify-center min-h-[120px]">
                <strong className="text-gray-900 text-center">
                  Ajudar as famílias para entender o propósito da Nitro
                </strong>
              </CardContent>
            </Card>
            <Card className="bg-white text-gray-900">
              <CardContent className="p-6 flex items-center justify-center min-h-[120px]">
                <strong className="text-gray-900 text-center">
                  Ajudar a família a ajudar o aluno para escolha do próximo
                  curso
                </strong>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-lg text-white/90 leading-relaxed mt-10">
            Anualmente, o aluno passará por{" "}
            <strong className="text-white">dois projetos coletivos</strong>.
          </p>
        </div>
      </Section>

      {/* CTA Section */}
      <section className="bg-theme-orange text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 id="cta-title" className="text-3xl md:text-4xl font-bold">
            Seja uma escola Power by Nitro
          </h2>
          <p className="mt-4 text-white/90 text-lg max-w-2xl mx-auto">
            Prepare seus alunos para o futuro de forma completa e integrada.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="bg-[#1e1b4b] text-white hover:bg-[#1e1b4b]/90 border-0 transition-colors duration-200"
            >
              <a
                href="https://wa.me/5511975809082?text=Visitei%20o%20site%20da%20Nitro%20Academy%20e%20queria%20saber%20mais%21"
                target="_blank"
                rel="noopener noreferrer"
              >
                QUERO SABER MAIS
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
