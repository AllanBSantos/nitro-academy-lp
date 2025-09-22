import Header from "@/components/Header";

export default function TrailDetails() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Página em Desenvolvimento
          </h1>
          <p className="text-xl text-gray-600">
            Esta trilha está sendo preparada com muito carinho para você!
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Em breve você poderá explorar todos os detalhes desta trilha.
          </p>
        </div>
      </div>
    </div>
  );
}
