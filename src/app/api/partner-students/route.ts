/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { normalizeName } from "@/lib/utils";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const escolas = searchParams.getAll("escola");
    const turmas = searchParams.getAll("turma");
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "100";
    const enrollmentStatus = searchParams.get("enrollmentStatus"); // "enrolled", "not_enrolled", or undefined for all

    let url = `${STRAPI_API_URL}/api/alunos-escola-parceira?sort=nome:asc&pagination[pageSize]=${pageSize}&pagination[page]=${page}`;

    // Add school filters
    if (escolas.length > 0) {
      if (escolas.length === 1) {
        url += `&filters[escola][$eq]=${encodeURIComponent(escolas[0])}`;
      } else {
        escolas.forEach((escola, index) => {
          url += `&filters[escola][$in][${index}]=${encodeURIComponent(
            escola
          )}`;
        });
      }
    }

    // Add class filters
    if (turmas.length > 0) {
      if (turmas.length === 1) {
        url += `&filters[turma][$eq]=${encodeURIComponent(turmas[0])}`;
      } else {
        turmas.forEach((turma, index) => {
          url += `&filters[turma][$in][${index}]=${encodeURIComponent(turma)}`;
        });
      }
    }

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Disable fetch caching
    });

    if (!response.ok) {
      const errorResult = await response.json();
      console.log("Erro ao buscar alunos:", errorResult);
      return NextResponse.json(
        { error: "Erro ao buscar alunos" },
        { status: response.status }
      );
    }

    const result = await response.json();

    let enrolledStudents: any[] = [];
    try {
      const enrolledStudentsResponse = await fetch(
        `${STRAPI_API_URL}/api/alunos?pagination[pageSize]=1000&populate[cursos][populate]=*`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (enrolledStudentsResponse.ok) {
        const enrolledData = await enrolledStudentsResponse.json();
        enrolledStudents = enrolledData.data || [];
      }
    } catch (error) {
      console.error("Erro ao buscar alunos cadastrados:", error);
    }

    const processedData = result.data.map((partnerStudent: any) => {
      try {
        const partnerName =
          partnerStudent.attributes?.nome || partnerStudent.nome;
        const normalizedPartnerName = normalizeName(partnerName);

        const enrolledStudent = enrolledStudents.find((enrolled: any) => {
          const enrolledName = enrolled.attributes?.nome || enrolled.nome;
          if (!enrolledName) return false;

          const normalizedEnrolledName = normalizeName(enrolledName);
          return normalizedPartnerName === normalizedEnrolledName;
        });

        const isEnrolled = !!enrolledStudent;

        let courseInfo = null;
        if (enrolledStudent) {
          const cursos =
            enrolledStudent.attributes?.cursos?.data ||
            enrolledStudent.cursos?.data ||
            enrolledStudent.attributes?.cursos ||
            enrolledStudent.cursos ||
            [];

          if (cursos.length > 0) {
            const course = cursos[0];
            const courseAttributes = course.attributes || course;

            courseInfo = {
              courseName: courseAttributes.titulo,
              schedule: courseAttributes.cronograma?.[0] || null,
            };
          }
        }

        if (partnerStudent.attributes) {
          return {
            ...partnerStudent,
            attributes: {
              ...partnerStudent.attributes,
              isEnrolled,
              courseInfo,
            },
          };
        } else {
          return {
            ...partnerStudent,
            attributes: {
              nome: partnerStudent.nome,
              cpf: partnerStudent.cpf,
              escola: partnerStudent.escola,
              turma: partnerStudent.turma,
              isEnrolled,
              courseInfo,
            },
          };
        }
      } catch (error) {
        console.error("Erro ao processar aluno:", partnerStudent, error);
        return {
          ...partnerStudent,
          attributes: {
            nome: partnerStudent.attributes?.nome || partnerStudent.nome,
            cpf: partnerStudent.attributes?.cpf || partnerStudent.cpf,
            escola: partnerStudent.attributes?.escola || partnerStudent.escola,
            turma: partnerStudent.attributes?.turma || partnerStudent.turma,
            isEnrolled: false,
            courseInfo: null,
          },
        };
      }
    });

    let filteredData = processedData;
    if (enrollmentStatus === "enrolled") {
      filteredData = processedData.filter(
        (student: any) => student.attributes.isEnrolled
      );
    } else if (enrollmentStatus === "not_enrolled") {
      filteredData = processedData.filter(
        (student: any) => !student.attributes.isEnrolled
      );
    }

    const finalResult = {
      data: filteredData,
      meta: result.meta,
    };

    const responseData = NextResponse.json(finalResult);
    responseData.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    responseData.headers.set("Pragma", "no-cache");
    responseData.headers.set("Expires", "0");

    return responseData;
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
