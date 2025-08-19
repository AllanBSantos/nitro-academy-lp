import Header from "@/app/components/Header";
import { ReactNode } from "react";
import CarouselClient from "@/app/components/CarouselClient";
import Footer from "@/app/components/Footer";
import MentorsGrid from "@/app/components/MentorsGrid";
import { fetchCurrentCampaign } from "@/lib/strapi";
import { useTranslations } from "next-intl";
import ImpactStats from "@/app/components/ImpactStats";
import { Badge } from "@/app/components/ui/badge";
import Reviews from "@/app/components/Reviews";
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
        <SectionTitle>{t("schedule.title")}</SectionTitle>
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
                {t("schedule.enrollment_deadline")}
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
                {t("schedule.classes_period")}
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
  const targetEnd = t("what_is.preview_end");
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
      title: t("parents_challenge.items.screens.title"),
      description: t("parents_challenge.items.screens.desc"),
    },
    {
      icon: <Target className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: t("parents_challenge.items.purpose.title"),
      description: t("parents_challenge.items.purpose.desc"),
    },
    {
      icon: <School className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: t("parents_challenge.items.education.title"),
      description: t("parents_challenge.items.education.desc"),
    },
  ];

  const solucoes = [
    {
      icon: (
        <UsersRound className="h-6 w-6 text-orange-600" aria-hidden="true" />
      ),
      title: t("our_solution.items.mentorships.title"),
      description: t("our_solution.items.mentorships.desc"),
    },
    {
      icon: <Laptop className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: t("our_solution.items.projects.title"),
      description: t("our_solution.items.projects.desc"),
    },
    {
      icon: (
        <Lightbulb className="h-6 w-6 text-orange-600" aria-hidden="true" />
      ),
      title: t("our_solution.items.themes.title"),
      description: t("our_solution.items.themes.desc"),
    },
  ];

  const beneficios = [
    {
      icon: <Sparkles className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: t("main_benefits.items.talents.title"),
      description: t("main_benefits.items.talents.desc"),
    },
    {
      icon: <Goal className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: t("main_benefits.items.purpose.title"),
      description: t("main_benefits.items.purpose.desc"),
    },
    {
      icon: (
        <BrainCircuit className="h-6 w-6 text-orange-600" aria-hidden="true" />
      ),
      title: t("main_benefits.items.skills.title"),
      description: t("main_benefits.items.skills.desc"),
    },
    {
      icon: (
        <FlaskConical className="h-6 w-6 text-orange-600" aria-hidden="true" />
      ),
      title: t("main_benefits.items.practical_knowledge.title"),
      description: t("main_benefits.items.practical_knowledge.desc"),
    },
    {
      icon: <Users className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: t("main_benefits.items.connections.title"),
      description: t("main_benefits.items.connections.desc"),
    },
    {
      icon: <Clock className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: t("main_benefits.items.flexibility.title"),
      description: t("main_benefits.items.flexibility.desc"),
    },
  ];

  const comoFuncionaSteps = [
    {
      n: "1",
      t: t("how_it_works.steps.1.title"),
      d: t("how_it_works.steps.1.desc"),
    },
    {
      n: "2",
      t: t("how_it_works.steps.2.title"),
      d: t("how_it_works.steps.2.desc"),
    },
    {
      n: "3",
      t: t("how_it_works.steps.3.title"),
      d: t("how_it_works.steps.3.desc"),
    },
    {
      n: "4",
      t: t("how_it_works.steps.4.title"),
      d: t("how_it_works.steps.4.desc"),
    },
    {
      n: "5",
      t: t("how_it_works.steps.5.title"),
      d: t("how_it_works.steps.5.desc"),
    },
    {
      n: "6",
      t: t("how_it_works.steps.6.title"),
      d: t("how_it_works.steps.6.desc"),
    },
    {
      n: "7",
      t: t("how_it_works.steps.7.title"),
      d: t("how_it_works.steps.7.desc"),
    },
  ];

  const diferenciais = [
    {
      icon: <FileText className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: t("differentiators.items.report.title"),
      description: t("differentiators.items.report.desc"),
    },
    {
      icon: <Package className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: t("differentiators.items.full_development.title"),
      description: t("differentiators.items.full_development.desc"),
    },
    {
      icon: <Globe className="h-6 w-6 text-orange-600" aria-hidden="true" />,
      title: t("differentiators.items.global_vision.title"),
      description: t("differentiators.items.global_vision.desc"),
    },
  ];

  const competencies = t("impact_section.competencies", {
    returnObjects: true,
  }) as string[];

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
      <Section
        className="relative overflow-hidden text-white py-10 sm:py-12"
        aria-labelledby="hero-title"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e1b4b] to-[#3B82F6]" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:py-12">
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl">
              {t("subtitle")}
            </p>
            <div className="mt-2 flex flex-wrap gap-3 justify-center">
              <Badge
                variant="outline"
                className="bg-white text-[#1e1b4b] border-white hover:bg-white hover:text-[#1e1b4b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
              >
                {t("badges.mentorships")}
              </Badge>
              <Badge
                variant="outline"
                className="bg-white text-[#1e1b4b] border-white hover:bg-white hover:text-[#1e1b4b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
              >
                {t("badges.projects")}
              </Badge>
              <Badge
                variant="outline"
                className="bg-white text-[#1e1b4b] border-white hover:bg-white hover:text-[#1e1b4b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
              >
                {t("badges.talents")}
              </Badge>
            </div>
          </div>
        </div>
      </Section>

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
              {t("parents_challenge.title")}
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
              {t("our_solution.title")}
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
              {t("parents_challenge.title")}
            </h3>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 pl-8">
              {t("our_solution.title")}
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
        <SectionTitle>{t("main_benefits.title")}</SectionTitle>
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
        <SectionTitle>{t("how_it_works.title")}</SectionTitle>
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
      <section className="bg-theme-orange">
        <div className="w-full px-6 md:px-10 lg:px-20 py-10 sm:py-14">
          <h2 className="text-center text-white text-3xl md:text-4xl font-bold mb-8">
            {t("courses_section.title")}
          </h2>
          <div className="max-w-[1400px] mx-auto -mt-6 sm:-mt-10">
            <CarouselClient locale={params.locale} showTitle={false} />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Reviews />

      {/* Differentiators Section */}
      <Section className="bg-slate-50">
        <SectionTitle>{t("differentiators.title")}</SectionTitle>
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
        <SectionTitle>{t("mentors_section.title")}</SectionTitle>
        <p className="text-gray-700 leading-relaxed max-w-5xl mx-auto mb-10 text-center">
          {t("mentors_section.desc")}
        </p>
        <MentorsGrid locale={params.locale} />
      </Section>

      {/* Impact Section */}
      <Section className="bg-slate-50">
        <SectionTitle>{t("impact_section.title")}</SectionTitle>
        <ImpactStats />
        <div className="mt-10">
          <h4 className="text-xl font-semibold text-gray-900 text-center">
            {t("impact_section.competencies_title")}
          </h4>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {competencies.map((item) => (
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
          {t("proposal_section.title")}
        </SectionTitle>
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-lg text-white/90 leading-relaxed space-y-4">
            <p>{t("proposal_section.p1")}</p>
            <p>{t("proposal_section.p2")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 mt-10">
            <Card className="bg-white text-gray-900">
              <CardContent className="p-6">
                <strong className="text-gray-900">
                  {t("proposal_section.cards.next_course.title")}
                </strong>
                <div className="text-gray-600">
                  {t("proposal_section.cards.next_course.desc")}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white text-gray-900">
              <CardContent className="p-6">
                <strong className="text-gray-900">
                  {t("proposal_section.cards.skills_feedback.title")}
                </strong>
                <div className="text-gray-600">
                  {t("proposal_section.cards.skills_feedback.desc")}
                </div>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-lg text-white/90 leading-relaxed mt-10">
            {t.rich("proposal_section.summary", {
              strong: (chunks) => <strong className="text-white">{chunks}</strong>,
            })}
          </p>
        </div>
      </Section>

      {/* CTA Section */}
      <section className="bg-theme-orange text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 id="cta-title" className="text-3xl md:text-4xl font-bold">
            {t("cta_section.title")}
          </h2>
          <p className="mt-4 text-white/90 text-lg max-w-2xl mx-auto">
            {t("cta_section.desc")}
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
                {t("cta_section.button")}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
