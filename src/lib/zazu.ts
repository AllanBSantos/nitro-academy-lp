interface OnboardingRequest {
  studentName: string;
  guardianName: string;
  studentPhone: string;
  guardianPhone: string;
  studentCPF: string;
}

interface OnboardingResponse {
  success: boolean;
  error?: string;
}

export async function startOnboarding(
  data: OnboardingRequest
): Promise<OnboardingResponse> {
  try {
    const response = await fetch("/api/zazu/onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to start onboarding");
    }
    return result;
  } catch (error) {
    console.error("Error starting onboarding:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to start onboarding",
    };
  }
}
