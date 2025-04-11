import { notFound } from "next/navigation";
import { getCardsContent } from "@/lib/courses";
import Header from "@/components/Header";
import CourseContent from "@/components/CourseContent";

// This function tells Next.js which paths to pre-render
export async function generateStaticParams() {
  const cardsContent = await getCardsContent();
  return cardsContent.map((course) => ({
    slug: course.slug,
  }));
}

export default async function CourseDetails({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}) {
  const cardsContent = await getCardsContent(locale);
  const course = cardsContent.find((course) => course.slug === slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-orange-600">
      <Header />
      <CourseContent course={course} />
    </div>
  );
}
