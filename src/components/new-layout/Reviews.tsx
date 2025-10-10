import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { fetchTestimonials } from "@/lib/strapi";
import { ReviewCard } from "@/types/strapi";

export function Reviews() {
  const [showAll, setShowAll] = useState(false);
  const [reviews, setReviews] = useState<ReviewCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews from Strapi
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const reviewsData = await fetchTestimonials("pt-BR");
        if (reviewsData.length > 0) {
          console.log(`Loaded ${reviewsData.length} reviews from Strapi`);
          setReviews(reviewsData);
        } else {
          console.log("No reviews found in Strapi, using fallback mock data");
          // Use mock data when Strapi returns empty array
          setReviews([
            {
              id: 1,
              name: "Lucas Martins",
              gender: "boy",
              rating: 5,
              comment:
                "A Nitro mudou minha visão sobre educação. Aprendi muito mais do que imaginava!",
              date: "Há 2 semanas",
            },
            {
              id: 2,
              name: "Julia Santos",
              gender: "girl",
              rating: 5,
              comment:
                "Os projetos são incríveis e os mentores são super inspiradores. Recomendo!",
              date: "Há 1 mês",
            },
            {
              id: 3,
              name: "Pedro Oliveira",
              gender: "boy",
              rating: 5,
              comment:
                "Desenvolvimento de habilidades que vou usar para o resto da vida.",
              date: "Há 3 semanas",
            },
            {
              id: 4,
              name: "Beatriz Costa",
              gender: "girl",
              rating: 5,
              comment:
                "A metodologia é diferente de tudo que já vi. Aprendo fazendo!",
              date: "Há 1 semana",
            },
            {
              id: 5,
              name: "Gabriel Ferreira",
              gender: "boy",
              rating: 5,
              comment:
                "Os mentores são profissionais de verdade, compartilhando experiências reais.",
              date: "Há 2 meses",
            },
            {
              id: 6,
              name: "Marina Silva",
              gender: "girl",
              rating: 5,
              comment:
                "Minha filha está muito mais engajada e motivada com os estudos.",
              date: "Há 3 semanas",
            },
          ]);
        }
        setError(null);
      } catch (err) {
        console.error("Error loading reviews:", err);
        setError("Erro ao carregar avaliações");
        // Fallback to mock data if API fails
        console.log("Using fallback mock data for reviews");
        setReviews([
          {
            id: 1,
            name: "Lucas Martins",
            gender: "boy",
            rating: 5,
            comment:
              "A Nitro mudou minha visão sobre educação. Aprendi muito mais do que imaginava!",
            date: "Há 2 semanas",
          },
          {
            id: 2,
            name: "Julia Santos",
            gender: "girl",
            rating: 5,
            comment:
              "Os projetos são incríveis e os mentores são super inspiradores. Recomendo!",
            date: "Há 1 mês",
          },
          {
            id: 3,
            name: "Pedro Oliveira",
            gender: "boy",
            rating: 5,
            comment:
              "Desenvolvimento de habilidades que vou usar para o resto da vida.",
            date: "Há 3 semanas",
          },
          {
            id: 4,
            name: "Beatriz Costa",
            gender: "girl",
            rating: 5,
            comment:
              "A metodologia é diferente de tudo que já vi. Aprendo fazendo!",
            date: "Há 1 semana",
          },
          {
            id: 5,
            name: "Gabriel Ferreira",
            gender: "boy",
            rating: 5,
            comment:
              "Os mentores são profissionais de verdade, compartilhando experiências reais.",
            date: "Há 2 meses",
          },
          {
            id: 6,
            name: "Marina Silva",
            gender: "girl",
            rating: 5,
            comment:
              "Minha filha está muito mais engajada e motivada com os estudos.",
            date: "Há 3 semanas",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 2);

  const getAvatarColor = (gender: string) => {
    return gender === "boy"
      ? "from-[#3B82F6] to-[#599fe9]"
      : "from-[#f54a12] to-[#d43e0f]";
  };

  const getAvatarEmoji = (gender: string) => {
    return gender === "boy" ? "👦" : "👧";
  };

  // Don't render if loading and no reviews
  if (loading && reviews.length === 0) {
    return (
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl text-[#19184b]">
              Avaliações e <span className="text-[#f54a12]">Feedbacks</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Veja o que alunos e pais dizem sobre a Nitro Academy
            </p>
          </motion.div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f54a12]"></div>
          </div>
        </div>
      </section>
    );
  }

  // Always render the section, even if no reviews from Strapi
  // The fallback mock data will be used

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl text-[#19184b]">
            Avaliações e <span className="text-[#f54a12]">Feedbacks</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Veja o que alunos e pais dizem sobre a Nitro Academy
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AnimatePresence mode="popLayout">
            {displayedReviews.map((review, index) => (
              <motion.div
                key={`${review.id}-${index}`}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                layout
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${getAvatarColor(
                      review.gender
                    )} rounded-full flex items-center justify-center text-2xl`}
                  >
                    {getAvatarEmoji(review.gender)}
                  </div>

                  <div className="flex-1">
                    {/* Name */}
                    <div className="mb-2">
                      <h4 className="text-lg text-[#19184b]">{review.name}</h4>
                    </div>

                    {/* Comment */}
                    <p className="text-gray-600 mb-3">{review.comment}</p>

                    {/* Date */}
                    <p className="text-sm text-gray-400">{review.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show More/Less Button - Only show if more than 2 reviews */}
        {reviews.length > 2 && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#f54a12] text-[#f54a12] bg-white rounded-full font-medium hover:bg-[#f54a12] hover:text-white transition-all duration-300"
            >
              {showAll ? "Ver menos" : "Ver mais avaliações"}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${
                  showAll ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
