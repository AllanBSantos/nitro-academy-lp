import { NextRequest, NextResponse } from "next/server";
import {
  fetchCourseWithAdminToken,
  updateCourse,
  updateMentor,
} from "@/lib/strapi";
import { mapStrapiCourseToAdminDetails } from "@/lib/mapAdminCourseDetails";

export async function GET(
  _request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const courseData = await fetchCourseWithAdminToken(params.documentId);
    const mapped = mapStrapiCourseToAdminDetails(courseData as unknown as Parameters<typeof mapStrapiCourseToAdminDetails>[0]);
    return NextResponse.json({ data: mapped });
  } catch {
    return NextResponse.json(
      {
        error: "Erro ao carregar detalhes do curso",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const { courseData, mentorData } = await request.json();

    if (
      (!courseData || Object.keys(courseData).length === 0) &&
      (!mentorData || !mentorData.data || Object.keys(mentorData.data).length === 0)
    ) {
      return NextResponse.json(
        { error: "Nenhuma alteração para salvar." },
        { status: 400 }
      );
    }

    if (courseData && Object.keys(courseData).length > 0) {
      await updateCourse(params.documentId, courseData);
    }

    if (
      mentorData &&
      (mentorData.mentorId || mentorData.mentorDocumentId) &&
      mentorData.data &&
      Object.keys(mentorData.data).length > 0
    ) {
      await updateMentor(
        {
          id: mentorData.mentorId,
          documentId: mentorData.mentorDocumentId,
        },
        mentorData.data
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      {
        error: "Erro ao salvar alterações.",
      },
      { status: 500 }
    );
  }
}

