const API_URL = "http://localhost:5000";

export async function generateCareerIntelligence(formData: FormData) {
  const response = await fetch(`${API_URL}/career-intelligence`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to generate career intelligence");
  }

  return response.json();
}