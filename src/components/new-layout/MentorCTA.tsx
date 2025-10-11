import { Button } from "./ui/button";
import { Lightbulb, Users, TrendingUp, ArrowRight } from "lucide-react";
import {
  fetchMentorsCount,
  fetchStudentsCount,
  fetchCoursesCount,
} from "@/lib/strapi";

async function MentorCTAContent() {
  const [mentorsCount, studentsCount, coursesCount] = await Promise.all([
    fetchMentorsCount(),
    fetchStudentsCount(),
    fetchCoursesCount(),
  ]);
  const benefits = [
    {
      icon: Lightbulb,
      title: "Compartilhe Conhecimento",
      description: "Inspire a próxima geração de talentos",
    },
    {
      icon: Users,
      title: "Faça Networking",
      description: "Conecte-se com outros profissionais",
    },
    {
      icon: TrendingUp,
      title: "Desenvolva-se",
      description: "Aprimore suas habilidades de liderança",
    },
  ];

  return (
    <section
      id="mentor"
      className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#19184b] to-[#1e1b4b] rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-2 gap-12 p-8 md:p-12">
            {/* Left: Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl text-[#f9f9fa]">
                Seja um <span className="text-[#f54a12]">Mentor</span> Nitro
              </h2>
              <p className="text-lg text-[#f9f9fa]/80">
                Faça parte de uma comunidade de profissionais que acreditam no
                poder transformador da educação. Compartilhe sua experiência e
                ajude jovens talentos a alcançarem seu potencial máximo.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#f54a12]/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#f54a12]" />
                      </div>
                      <div>
                        <h4 className="text-[#f9f9fa] mb-1">{benefit.title}</h4>
                        <p className="text-[#f9f9fa]/70 text-sm">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                className="bg-[#f54a12] hover:bg-[#d43e0f] text-white px-8 py-6 rounded-xl group"
                onClick={() =>
                  window.open(
                    "https://u4zgaidr6x8.typeform.com/nitroprof?typeform-source=www.nitro.academy",
                    "_blank"
                  )
                }
              >
                Quero ser Mentor
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Right: Stats/Features */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="text-4xl text-[#f54a12] mb-2">
                  {mentorsCount}+
                </div>
                <p className="text-[#f9f9fa]/80">Mentores ativos</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="text-4xl text-[#599fe9] mb-2">
                  {studentsCount}+
                </div>
                <p className="text-[#f9f9fa]/80">Alunos impactados</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="text-4xl text-[#03A9F4] mb-2">
                  {coursesCount}
                </div>
                <p className="text-[#f9f9fa]/80">Projetos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MentorCTA() {
  return <MentorCTAContent />;
}
