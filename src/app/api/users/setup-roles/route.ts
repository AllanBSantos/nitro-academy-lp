import { NextResponse } from "next/server";

export async function POST() {
  try {
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
    const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

    if (!STRAPI_URL) {
      return NextResponse.json(
        { error: "STRAPI_URL not configured" },
        { status: 500 }
      );
    }

    if (!ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "STRAPI_TOKEN not configured" },
        { status: 500 }
      );
    }

    console.log("Setting up roles in Strapi...");

    // First, get existing roles to check what's already there
    const existingRolesResponse = await fetch(
      `${STRAPI_URL}/api/users-permissions/roles`,
      {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      }
    );

    if (!existingRolesResponse.ok) {
      throw new Error("Failed to fetch existing roles");
    }

    const existingRoles = await existingRolesResponse.json();
    console.log("Existing roles:", existingRoles);

    // Check if mentor role exists
    const mentorRole = existingRoles.roles?.find(
      (r: Record<string, unknown>) => r.type === "mentor"
    );
    const studentRole = existingRoles.roles?.find(
      (r: Record<string, unknown>) => r.type === "student"
    );

    const results: Record<string, unknown> = {};

    // Create mentor role if it doesn't exist
    if (!mentorRole) {
      console.log("Creating mentor role...");
      const mentorResponse = await fetch(
        `${STRAPI_URL}/api/users-permissions/roles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
          body: JSON.stringify({
            name: "Mentor",
            description:
              "Role para mentores que podem gerenciar seus próprios cursos",
            type: "mentor",
            permissions: {
              "api::curso.curso": {
                controllers: {
                  curso: {
                    find: { enabled: true, policy: "" },
                    findOne: { enabled: true, policy: "" },
                  },
                },
              },
              "plugin::users-permissions.user": {
                controllers: {
                  user: {
                    find: { enabled: true, policy: "" },
                    findOne: { enabled: true, policy: "" },
                    update: { enabled: true, policy: "" },
                  },
                },
              },
            },
          }),
        }
      );

      if (mentorResponse.ok) {
        const mentorData = await mentorResponse.json();
        results.mentor = { created: true, data: mentorData };
        console.log("Mentor role created successfully");
      } else {
        const errorData = await mentorResponse.json().catch(() => ({}));
        results.mentor = { created: false, error: errorData };
        console.error("Failed to create mentor role:", errorData);
      }
    } else {
      results.mentor = { created: false, exists: true, id: mentorRole.id };
      console.log("Mentor role already exists");
    }

    // Create student role if it doesn't exist
    if (!studentRole) {
      console.log("Creating student role...");
      const studentResponse = await fetch(
        `${STRAPI_URL}/api/users-permissions/roles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
          body: JSON.stringify({
            name: "Student",
            description: "Role para estudantes que podem acessar o dashboard",
            type: "student",
            permissions: {
              "plugin::users-permissions.user": {
                controllers: {
                  user: {
                    find: { enabled: true, policy: "" },
                    findOne: { enabled: true, policy: "" },
                    update: { enabled: true, policy: "" },
                  },
                },
              },
            },
          }),
        }
      );

      if (studentResponse.ok) {
        const studentData = await studentResponse.json();
        results.student = { created: true, data: studentData };
        console.log("Student role created successfully");
      } else {
        const errorData = await studentResponse.json().catch(() => ({}));
        results.student = { created: false, error: errorData };
        console.error("Failed to create student role:", errorData);
      }
    } else {
      results.student = { created: false, exists: true, id: studentRole.id };
      console.log("Student role already exists");
    }

    console.log("Role setup completed:", results);
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Error in setup-roles API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
