import openai from "../config/openai";

export async function generateCoverLetter(
  company: string,
  jobDescription: string
) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",

    messages: [
      {
        role: "system",
        content: `
You are an expert career coach.

Write a professional cover letter.

Keep it under 300 words.

Do NOT invent experience.

Leave placeholders if information is missing.

Return ONLY the cover letter.
`
      },

      {
        role: "user",
        content: `
Company:
${company}

Job Description:

${jobDescription}
`
      }
    ]
  });

  return response.choices[0].message.content;
}