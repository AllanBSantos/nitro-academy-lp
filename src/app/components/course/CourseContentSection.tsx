import { useState } from "react";

// Mock data for course content
const mockCourseContent = {
  ementaResumida: [
    "Vivência prática do empreendedorismo por meio de simulações em grupo",
    "Desenvolvimento de competências como criatividade, liderança, comunicação e resolução de problemas",
    "Estímulo ao trabalho em equipe, empatia e escuta ativa",
    "Criação e gestão de empresas simuladas, com foco em vendas, marketing e atendimento",
    "Construção de uma mentalidade empreendedora e estratégica",
    "Uso de desafios reais e dinâmicos para engajamento e superação",
    "Análise de resultados e tomada de decisões com base em indicadores",
    "Celebração do processo, aprendizados e conquistas em uma apresentação final",
  ],
  aulas: [
    {
      titulo: "Aula 1",
      descricao:
        "Formação dos grupos e início da criação das empresas simuladas, com definição de produto/serviço, nome e identidade visual",
    },
    {
      titulo: "Aula 2",
      descricao:
        "Apresentação das empresas para os colegas e definição de escopo, canais de comunicação e estratégias iniciais de operação",
    },
    {
      titulo: "Aula 3",
      descricao:
        "Desenvolvimento de habilidades de vendas, com foco em abordagem, apresentação de valor e conversão de clientes",
    },
    {
      titulo: "Aula 4",
      descricao:
        "Exploração do marketing digital com criação de perfis em redes sociais, produção de conteúdo e estratégias de engajamento",
    },
    {
      titulo: "Aula 5",
      descricao:
        "Atendimento ao cliente e pós-venda, com ênfase em escuta ativa, resolução de conflitos e fidelização",
    },
    {
      titulo: "Aula 6",
      descricao:
        "Introdução a indicadores e análise de desempenho das empresas com base em vendas, feedbacks e retenção",
    },
    {
      titulo: "Aula 7",
      descricao:
        "Criação de ações encantadoras para transformar clientes em promotores da marca e fortalecer o relacionamento",
    },
    {
      titulo: "Aula 8",
      descricao:
        "Apresentações finais com compartilhamento dos resultados, reflexões e encerramento simbólico da jornada empreendedora",
    },
  ],
};

export default function CourseContentSection() {
  const [activeModule, setActiveModule] = useState<string | null>("ementa");

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">
          Conteúdo do curso
        </h2>

        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() =>
                setActiveModule(activeModule === "ementa" ? null : "ementa")
              }
              className="w-full flex items-center justify-between p-6 bg-[#1e1b4b] text-white"
            >
              <h3 className="text-xl font-semibold">Ementa Resumida</h3>
              <span className="text-2xl">
                {activeModule === "ementa" ? "−" : "+"}
              </span>
            </button>
            {activeModule === "ementa" && (
              <div className="p-6 bg-white">
                <ul className="space-y-3">
                  {mockCourseContent.ementaResumida.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-[#3B82F6] text-xl">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() =>
                setActiveModule(activeModule === "aulas" ? null : "aulas")
              }
              className="w-full flex items-center justify-between p-6 bg-[#1e1b4b] text-white"
            >
              <h3 className="text-xl font-semibold">Resumo das Aulas</h3>
              <span className="text-2xl">
                {activeModule === "aulas" ? "−" : "+"}
              </span>
            </button>
            {activeModule === "aulas" && (
              <div className="p-6 bg-white">
                <div className="space-y-4">
                  {mockCourseContent.aulas.map((aula, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-semibold text-[#1e1b4b] mb-1">
                          {aula.titulo}
                        </h4>
                        <p className="text-gray-600">{aula.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
