import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { getCardsContent } from "@/lib/courses";
import { CardProps } from "@/types/card";

export function Projects() {
  // Fetch courses from Strapi using existing function
  const [courses, setCourses] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchName, setSearchName] = useState("");
  const [selectedDay, setSelectedDay] = useState("todos");
  const [selectedTime, setSelectedTime] = useState("todos");
  const [selectedLanguage, setSelectedLanguage] = useState("todos");
  const [selectedMentor, setSelectedMentor] = useState("todos");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(6);

  // Load courses on component mount
  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCardsContent("pt");
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setError("Erro ao carregar cursos");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  // Filter options
  const days = [
    { value: "todos", label: "Todos os dias" },
    { value: "segunda", label: "Segunda-feira" },
    { value: "terca", label: "Terça-feira" },
    { value: "quarta", label: "Quarta-feira" },
    { value: "quinta", label: "Quinta-feira" },
  ];

  const times = [
    { value: "todos", label: "Todos os horários" },
    { value: "14h", label: "14h" },
    { value: "15h", label: "15h" },
    { value: "16h", label: "16h" },
    { value: "17h", label: "17h" },
    { value: "18h", label: "18h" },
    { value: "19h", label: "19h" },
    { value: "20h", label: "20h" },
  ];

  const languages = [
    { value: "todos", label: "Todos os idiomas" },
    { value: "portugues", label: "Português" },
    { value: "ingles", label: "Inglês" },
  ];

  // Generate mentors list from actual courses
  const mentors = [
    { value: "todos", label: "Todos os mentores" },
    ...Array.from(
      new Set(
        courses
          .filter((course) => course.mentor?.name)
          .map((course) => ({
            value: course.mentor!.name.toLowerCase().replace(/\s+/g, "-"),
            label: course.mentor!.name,
          }))
      )
    ),
  ];

  // Helper function to remove accents for search
  const removeAccents = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // Transform CardProps to the format expected by the component
  const transformCourseToProject = (course: CardProps) => {
    const cronograma = Array.isArray(course.cronograma)
      ? course.cronograma[0]
      : course.cronograma;

    // Map day names
    const dayMap: Record<string, string> = {
      "Segunda-Feira": "segunda",
      "Terça-Feira": "terca",
      "Quarta-Feira": "quarta",
      "Quinta-Feira": "quinta",
      "Sexta-Feira": "sexta",
    };

    // Extract time from schedule
    const timeMatch = cronograma?.horario_aula?.match(/(\d{2}):(\d{2})/);
    const time = timeMatch ? `${timeMatch[1]}h` : "14h";

    // Map language
    const languageMap: Record<string, string> = {
      portugues: "portugues",
      ingles: "ingles",
      espanhol: "espanhol",
    };

    // Map mentor name to slug
    const mentorSlug =
      course.mentor?.name?.toLowerCase().replace(/\s+/g, "-") || "mentor";

    // Determine category based on course tags - use specific tag or fallback to first available tag
    const category =
      course.tags && course.tags.length > 0
        ? course.tags[0].nome
        : "Tecnologia";

    // Format start date
    const startDate = cronograma?.data_inicio
      ? new Date(cronograma.data_inicio).toLocaleDateString("pt-BR", {
          month: "long",
          year: "2-digit",
        })
      : "Março/26";

    return {
      id: course.id,
      documentId: course.documentId,
      title: course.title || "Curso",
      description: course.description || "Descrição do curso",
      category,
      day: cronograma?.dia_semana
        ? dayMap[cronograma.dia_semana] || "segunda"
        : "segunda",
      time,
      startDate,
      language: languageMap[course.lingua || "portugues"] || "portugues",
      mentor: mentorSlug,
      mentorName: course.mentor?.name || "Mentor",
      mentorPhoto:
        course.mentor?.image ||
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      mentorCountry: course.mentor?.pais || "BR",
      mentorRating:
        course.mentor?.reviews && course.mentor.reviews.length > 0
          ? course.mentor.reviews[0].nota
          : null,
      mentorReviews: course.mentor?.reviews?.length || 0,
      planType: course.plano || "gold",
      image:
        course.image ||
        "https://images.unsplash.com/photo-1712903911017-7c10a3c4b3e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcHJvamVjdCUyMHByZXNlbnRhdGlvbnxlbnwxfHx8fDE3NTk5OTE2OTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      slug: course.slug,
      link_pagamento: course.link_pagamento,
      preco: course.price?.total || 0,
      parcelas: course.price?.installments || 1,
      moeda: course.moeda || "Real",
      inscricoes_abertas: course.inscricoes_abertas || false,
    };
  };

  // Use real courses from Strapi or fallback to mock data
  const projects =
    loading || error || courses.length === 0
      ? [
          {
            id: "mock-1",
            documentId: "mock-1",
            title: "App de Sustentabilidade",
            description:
              "Desenvolvimento de aplicativo para conscientização ambiental",
            category: "Tecnologia",
            day: "segunda",
            time: "14h",
            startDate: "Março/26",
            language: "portugues",
            mentor: "ana-silva",
            mentorName: "Ana Silva",
            mentorPhoto:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
            mentorCountry: "BR",
            mentorRating: 4.8,
            mentorReviews: 127,
            planType: "gold",
            image:
              "https://images.unsplash.com/photo-1712903911017-7c10a3c4b3e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcHJvamVjdCUyMHByZXNlbnRhdGlvbnxlbnwxfHx8fDE3NTk5OTE2OTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
            slug: "app-sustentabilidade",
            link_pagamento: "#",
            preco: 0,
            parcelas: 1,
            moeda: "Real",
            inscricoes_abertas: false,
          },
          {
            id: "mock-2",
            documentId: "mock-2",
            title: "Startup Social",
            description: "Projeto de impacto social para comunidades locais",
            category: "Negócios",
            day: "terca",
            time: "10h",
            startDate: "Abril/26",
            language: "portugues",
            mentor: "carlos-mendes",
            mentorName: "Carlos Mendes",
            mentorPhoto:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            mentorCountry: "PT",
            mentorRating: 4.9,
            mentorReviews: 203,
            planType: "black",
            image:
              "https://images.unsplash.com/photo-1598618589695-e601731aed51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVlbmFnZXJzJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzYwMDIyMjk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
            slug: "startup-social",
            link_pagamento: "#",
            preco: 0,
            parcelas: 1,
            moeda: "Real",
            inscricoes_abertas: false,
          },
          {
            id: "mock-3",
            documentId: "mock-3",
            title: "Design Thinking Lab",
            description: "Soluções criativas para problemas do dia a dia",
            category: "Design",
            day: "quarta",
            time: "15h",
            startDate: "Março/26",
            language: "ingles",
            mentor: "fernanda-costa",
            mentorName: "Fernanda Costa",
            mentorPhoto:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
            mentorCountry: "US",
            mentorRating: 4.7,
            mentorReviews: 156,
            planType: "gold",
            image:
              "https://images.unsplash.com/photo-1758612214848-04e700d192ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlciUyMHN0dWRlbnQlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MDAyMjI5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
            slug: "design-thinking-lab",
            link_pagamento: "#",
            preco: 0,
            parcelas: 1,
            moeda: "Real",
            inscricoes_abertas: false,
          },
          {
            id: "mock-4",
            documentId: "mock-4",
            title: "Inovação Educacional",
            description: "Repensando métodos de ensino e aprendizagem",
            category: "Inovação",
            day: "quinta",
            time: "19h",
            startDate: "Maio/26",
            language: "portugues",
            mentor: "pedro-oliveira",
            mentorName: "Pedro Oliveira",
            mentorPhoto:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
            mentorCountry: "BR",
            mentorRating: 5.0,
            mentorReviews: 89,
            planType: "black",
            image:
              "https://images.unsplash.com/photo-1540058404349-2e5fabf32d75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1lbnRvciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjAwMjIyOTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
            slug: "inovacao-educacional",
            link_pagamento: "#",
            preco: 0,
            parcelas: 1,
            moeda: "Real",
            inscricoes_abertas: false,
          },
          {
            id: "mock-5",
            documentId: "mock-5",
            title: "E-commerce do Futuro",
            description:
              "Plataforma digital com foco em experiência do usuário",
            category: "Tecnologia",
            day: "sexta",
            time: "16h",
            startDate: "Abril/26",
            language: "ingles",
            mentor: "juliana-santos",
            mentorName: "Juliana Santos",
            mentorPhoto:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
            mentorCountry: "CA",
            mentorRating: 4.6,
            mentorReviews: 142,
            planType: "gold",
            image:
              "https://images.unsplash.com/photo-1712903911017-7c10a3c4b3e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcHJvamVjdCUyMHByZXNlbnRhdGlvbnxlbnwxfHx8fDE3NTk5OTE2OTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
            slug: "ecommerce-futuro",
            link_pagamento: "#",
            preco: 0,
            parcelas: 1,
            moeda: "Real",
            inscricoes_abertas: false,
          },
          {
            id: "mock-6",
            documentId: "mock-6",
            title: "Branding Pessoal",
            description:
              "Construção de marca pessoal para jovens profissionais",
            category: "Design",
            day: "segunda",
            time: "09h",
            startDate: "Junho/26",
            language: "portugues",
            mentor: "ana-silva",
            mentorName: "Ana Silva",
            mentorPhoto:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
            mentorCountry: "BR",
            mentorRating: 4.8,
            mentorReviews: 127,
            planType: "black",
            image:
              "https://images.unsplash.com/photo-1598618589695-e601731aed51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVlbmFnZXJzJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzYwMDIyMjk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
            slug: "branding-pessoal",
            link_pagamento: "#",
            preco: 0,
            parcelas: 1,
            moeda: "Real",
            inscricoes_abertas: false,
          },
          {
            id: "mock-7",
            documentId: "mock-7",
            title: "Inteligência Artificial para Iniciantes",
            description: "Introdução prática ao mundo da IA e machine learning",
            category: "Tecnologia",
            day: "sabado",
            time: "11h",
            startDate: "Março/26",
            language: "espanhol",
            mentor: "carlos-mendes",
            mentorName: "Carlos Mendes",
            mentorPhoto:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            mentorCountry: "PT",
            mentorRating: 4.9,
            mentorReviews: 203,
            planType: "gold",
            image:
              "https://images.unsplash.com/photo-1758612214848-04e700d192ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlciUyMHN0dWRlbnQlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MDAyMjI5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
            slug: "ia-iniciantes",
            link_pagamento: "#",
            preco: 0,
            parcelas: 1,
            moeda: "Real",
            inscricoes_abertas: false,
          },
          {
            id: "mock-8",
            documentId: "mock-8",
            title: "Marketing Digital Avançado",
            description: "Estratégias modernas de marketing e growth hacking",
            category: "Negócios",
            day: "quarta",
            time: "20h",
            startDate: "Maio/26",
            language: "portugues",
            mentor: "fernanda-costa",
            mentorName: "Fernanda Costa",
            mentorPhoto:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
            mentorCountry: "US",
            mentorRating: 4.7,
            mentorReviews: 156,
            planType: "black",
            image:
              "https://images.unsplash.com/photo-1540058404349-2e5fabf32d75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1lbnRvciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjAwMjIyOTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
            slug: "marketing-digital-avancado",
            link_pagamento: "#",
            preco: 0,
            parcelas: 1,
            moeda: "Real",
            inscricoes_abertas: false,
          },
        ]
      : courses.map(transformCourseToProject);

  // Filter logic
  const filteredProjects = projects.filter((project) => {
    const matchesName = removeAccents(project.title).includes(
      removeAccents(searchName)
    );
    const matchesDay = selectedDay === "todos" || project.day === selectedDay;
    const matchesTime =
      selectedTime === "todos" || project.time === selectedTime;
    const matchesLanguage =
      selectedLanguage === "todos" || project.language === selectedLanguage;
    const matchesMentor =
      selectedMentor === "todos" || project.mentor === selectedMentor;

    return (
      matchesName &&
      matchesDay &&
      matchesTime &&
      matchesLanguage &&
      matchesMentor
    );
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchName("");
    setSelectedDay("todos");
    setSelectedTime("todos");
    setSelectedLanguage("todos");
    setSelectedMentor("todos");
    setDisplayedCount(6);
  };

  // Check if any filter is active
  const hasActiveFilters =
    searchName !== "" ||
    selectedDay !== "todos" ||
    selectedTime !== "todos" ||
    selectedLanguage !== "todos" ||
    selectedMentor !== "todos";

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(6);
  }, [searchName, selectedDay, selectedTime, selectedLanguage, selectedMentor]);

  // Helper function to get country flag emoji
  const getCountryFlag = (countryCode: string) => {
    const flags: { [key: string]: string } = {
      BR: "🇧🇷",
      Brasil: "🇧🇷",
      PT: "🇵🇹",
      Portugal: "🇵🇹",
      US: "🇺🇸",
      "Estados Unidos": "🇺🇸",
      USA: "🇺🇸",
      CA: "🇨🇦",
      Canadá: "🇨🇦",
      Canada: "🇨🇦",
      ES: "🇪🇸",
      Espanha: "🇪🇸",
      UK: "🇬🇧",
      "Reino Unido": "🇬🇧",
      Inglaterra: "🇬🇧",
      FR: "🇫🇷",
      França: "🇫🇷",
      France: "🇫🇷",
      DE: "🇩🇪",
      Alemanha: "🇩🇪",
      Germany: "🇩🇪",
      IT: "🇮🇹",
      Itália: "🇮🇹",
      Italy: "🇮🇹",
      AR: "🇦🇷",
      Argentina: "🇦🇷",
      MX: "🇲🇽",
      México: "🇲🇽",
      Mexico: "🇲🇽",
      CL: "🇨🇱",
      Chile: "🇨🇱",
      CO: "🇨🇴",
      Colômbia: "🇨🇴",
      Colombia: "🇨🇴",
    };
    return flags[countryCode] || "🌍";
  };

  return (
    <section id="projetos" className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl text-[#19184b]">
            Nossos <span className="text-[#f54a12]">Projetos</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Conheça os projetos desenvolvidos pelos nossos alunos
          </p>
        </div>

        {/* Advanced Filters */}
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300">
            {/* Filter Header */}
            <div className="flex items-center justify-between p-5 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#f54a12]/10 rounded-lg">
                  <SlidersHorizontal className="w-5 h-5 text-[#f54a12]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#19184b]">
                    Filtros de Busca
                  </h3>
                  <p className="hidden md:block text-sm text-gray-500">
                    {hasActiveFilters
                      ? `${
                          [
                            searchName !== "",
                            selectedDay !== "todos",
                            selectedTime !== "todos",
                            selectedLanguage !== "todos",
                            selectedMentor !== "todos",
                          ].filter(Boolean).length
                        } filtro(s) ativo(s)`
                      : "Refine sua busca por projetos"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    size="sm"
                    className="text-[#f54a12] hover:text-[#d43e0f] hover:bg-[#f54a12]/10"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Limpar
                  </Button>
                )}

                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#19184b] hover:bg-gray-100"
                  >
                    {isFiltersOpen ? (
                      <>
                        <ChevronUp className="w-5 h-5 mr-2" />
                        Ocultar filtros
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-5 h-5 mr-2" />
                        Mostrar filtros
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            {/* Collapsible Filter Content */}
            <CollapsibleContent>
              <div className="p-6 pt-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {/* Search by Name */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-medium">
                      Nome do Projeto
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Buscar..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="pl-10 bg-white border-gray-300 focus:border-[#f54a12] focus:ring-[#f54a12] transition-all text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Day of Week */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-medium">
                      Dia da Semana
                    </label>
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger className="bg-white border-gray-300 focus:border-[#f54a12] focus:ring-[#f54a12] transition-all text-gray-900">
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Time */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-medium">
                      Horário
                    </label>
                    <Select
                      value={selectedTime}
                      onValueChange={setSelectedTime}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-[#f54a12] focus:ring-[#f54a12] transition-all text-gray-900">
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {times.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Language */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-medium">
                      Idioma
                    </label>
                    <Select
                      value={selectedLanguage}
                      onValueChange={setSelectedLanguage}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-[#f54a12] focus:ring-[#f54a12] transition-all text-gray-900">
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem
                            key={language.value}
                            value={language.value}
                          >
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mentor */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-medium">
                      Mentor
                    </label>
                    <Select
                      value={selectedMentor}
                      onValueChange={setSelectedMentor}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-[#f54a12] focus:ring-[#f54a12] transition-all text-gray-900">
                        <SelectValue placeholder="Selecione o mentor" />
                      </SelectTrigger>
                      <SelectContent>
                        {mentors.map((mentor) => (
                          <SelectItem key={mentor.value} value={mentor.value}>
                            {mentor.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Active filters badges */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">
                      Filtros ativos:
                    </span>
                    {searchName !== "" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f54a12]/10 text-[#f54a12] rounded-full text-sm">
                        <Search className="w-3 h-3" />
                        {searchName}
                        <button
                          onClick={() => setSearchName("")}
                          className="ml-1 hover:bg-[#f54a12]/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedDay !== "todos" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#599fe9]/10 text-[#599fe9] rounded-full text-sm">
                        {days.find((d) => d.value === selectedDay)?.label}
                        <button
                          onClick={() => setSelectedDay("todos")}
                          className="ml-1 hover:bg-[#599fe9]/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedTime !== "todos" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#599fe9]/10 text-[#599fe9] rounded-full text-sm">
                        {times.find((t) => t.value === selectedTime)?.label}
                        <button
                          onClick={() => setSelectedTime("todos")}
                          className="ml-1 hover:bg-[#599fe9]/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedLanguage !== "todos" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#599fe9]/10 text-[#599fe9] rounded-full text-sm">
                        {
                          languages.find((l) => l.value === selectedLanguage)
                            ?.label
                        }
                        <button
                          onClick={() => setSelectedLanguage("todos")}
                          className="ml-1 hover:bg-[#599fe9]/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedMentor !== "todos" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#599fe9]/10 text-[#599fe9] rounded-full text-sm">
                        {mentors.find((m) => m.value === selectedMentor)?.label}
                        <button
                          onClick={() => setSelectedMentor("todos")}
                          className="ml-1 hover:bg-[#599fe9]/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </CollapsibleContent>

            {/* Results count - Always visible */}
            <div className="px-5 py-3 bg-white/60 backdrop-blur-sm border-t border-gray-200 text-center text-sm text-gray-600">
              {filteredProjects.length === projects.length ? (
                <span>
                  Mostrando{" "}
                  <span className="text-[#f54a12] font-medium">
                    {filteredProjects.length}
                  </span>{" "}
                  projetos
                </span>
              ) : (
                <span>
                  Encontrado{" "}
                  <span className="text-[#f54a12] font-medium">
                    {filteredProjects.length}
                  </span>{" "}
                  de {projects.length} projetos
                </span>
              )}
            </div>
          </div>
        </Collapsible>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#f54a12]"></div>
              Carregando projetos...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <p className="text-lg font-medium">Erro ao carregar projetos</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-[#f54a12] text-[#f54a12] hover:bg-[#f54a12] hover:text-white"
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && filteredProjects.length > 0 ? (
          <TooltipProvider>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredProjects
                .slice(0, displayedCount)
                .map((project, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Language Badge - Top Left */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute top-4 left-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg cursor-pointer hover:bg-blue-600 transition-colors">
                            {project.language === "portugues"
                              ? "PT-BR"
                              : project.language === "ingles"
                              ? "EN"
                              : project.language === "espanhol"
                              ? "ES"
                              : "PT-BR"}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {project.language === "portugues"
                              ? "Curso em Português"
                              : project.language === "ingles"
                              ? "Curso em Inglês"
                              : project.language === "espanhol"
                              ? "Curso em Espanhol"
                              : "Curso em Português"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`absolute top-4 right-4 w-8 h-8 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${
                              project.planType === "gold"
                                ? "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600"
                                : "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
                            }`}
                          >
                            <span className="text-white text-xs">
                              {project.planType === "gold" ? "G" : "B"}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {project.planType === "gold"
                              ? "Plano Gold"
                              : "Plano Black"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl text-[#19184b] mb-2">
                        {project.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2 text-sm text-gray-500">
                        <span className="inline-flex items-center">
                          📅 {days.find((d) => d.value === project.day)?.label}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center">
                          🕐 {project.time}
                        </span>
                      </div>
                      <div className="mb-4 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <span className="font-medium">Inicia em:</span>{" "}
                          {project.startDate}
                        </span>
                      </div>

                      {/* Mentor Section */}
                      <div className="border-t border-gray-200 pt-4 mb-4">
                        {project.mentorName &&
                        project.mentorName !== "Mentor" ? (
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <ImageWithFallback
                                src={project.mentorPhoto}
                                alt={project.mentorName}
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                              />
                              <span className="absolute -bottom-1 -right-1 text-lg">
                                {getCountryFlag(project.mentorCountry)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-[#19184b]">
                                {project.mentorName}
                              </p>
                              <div className="flex items-center gap-2 text-sm">
                                {project.mentorRating &&
                                project.mentorReviews > 0 ? (
                                  <>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                      <Star className="w-4 h-4 fill-current" />
                                      <span className="text-[#19184b]">
                                        {project.mentorRating}
                                      </span>
                                    </div>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-500">
                                      ({project.mentorReviews} reviews)
                                    </span>
                                  </>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                    Novo mentor
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-gray-200">
                              <span className="text-gray-400 text-lg">👥</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500 font-medium">
                                Mentor em definição
                              </p>
                              <p className="text-xs text-gray-400">
                                Em breve anunciaremos o mentor deste curso
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <Link
                        href={`/pt/curso/${project.slug}`}
                        className="flex items-center gap-2 text-[#f54a12] group-hover:gap-3 transition-all duration-300"
                      >
                        Saiba mais
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </TooltipProvider>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl text-[#19184b] mb-2">
              Nenhum projeto encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros para ver mais resultados
            </p>
            <Button
              onClick={clearFilters}
              className="bg-[#f54a12] hover:bg-[#d43e0f] text-white"
            >
              Limpar todos os filtros
            </Button>
          </div>
        )}

        {/* Load More Button */}
        {filteredProjects.length > displayedCount && (
          <div className="text-center">
            <Button
              onClick={() => setDisplayedCount((prev) => prev + 6)}
              className="bg-[#f54a12] hover:bg-[#d43e0f] text-white px-8 py-6 rounded-xl"
            >
              Carregar mais
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
