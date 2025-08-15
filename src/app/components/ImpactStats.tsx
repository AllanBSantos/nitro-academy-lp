import { fetchSchoolsCount, fetchStudentsCount } from "@/lib/strapi";

export default async function ImpactStats() {
  const [schoolsImpacted, studentsImpacted] = await Promise.all([
    fetchSchoolsCount(),
    fetchStudentsCount(),
  ]);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="text-5xl font-extrabold text-orange-600">
          {schoolsImpacted}
        </div>
        <div className="text-gray-600 mt-1">Escolas Impactadas</div>
      </div>
      <div className="text-center">
        <div className="text-5xl font-extrabold text-orange-600">
          {studentsImpacted}
        </div>
        <div className="text-gray-600 mt-1">Alunos Impactados</div>
      </div>
      <div className="text-center">
        <div className="text-5xl font-extrabold text-orange-600">6h</div>
        <div className="text-gray-600 mt-1">de Curso com Certificação</div>
      </div>
    </div>
  );
}
