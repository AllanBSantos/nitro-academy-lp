"use client";

import { TrailCardProps } from "../types/card";
import { useEffect, useState } from "react";
import Footer from "../app/components/Footer";
import TrailDescription from "../app/components/trail/TrailDescription";
import TrailCoursesList from "../app/components/trail/TrailCoursesList";
import TrailMentors from "../app/components/trail/TrailMentors";

interface TrailContentProps {
  trail: TrailCardProps;
  locale?: string;
}

export default function TrailContent({ trail }: TrailContentProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div className="text-white text-center">Loading...</div>;

  return (
    <>
      <TrailDescription trail={trail} />
      <TrailCoursesList trail={trail} />
      <TrailMentors trail={trail} />
      <Footer />
    </>
  );
}
