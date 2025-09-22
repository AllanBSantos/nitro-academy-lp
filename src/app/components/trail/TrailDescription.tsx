import { TrailCardProps } from "@/types/card";

interface TrailDescriptionProps {
  trail: TrailCardProps;
}

export default function TrailDescription({ trail }: TrailDescriptionProps) {
  return (
    <section className="relative bg-gradient-to-r from-[#1e1b4b] to-[#3B82F6] text-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {trail.nome}
          </h1>

          <div className="mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-lg font-medium">
                  {trail.totalCursos}{" "}
                  {trail.totalCursos === 1 ? "curso" : "cursos"}
                </span>
              </div>
            </div>
          </div>

          <p className="text-lg md:text-xl opacity-90 mb-8 whitespace-pre-line max-w-4xl mx-auto">
            {trail.descricao}
          </p>
        </div>
      </div>
    </section>
  );
}
