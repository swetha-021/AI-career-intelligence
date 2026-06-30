import openai from "../config/openai";

export async function analyzeJob(jobDescription: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",

    messages: [
      {
        role: "system",
        content: `
        You are an expert technical recruiter and ATS specialist.

        Analyze the job description and return ONLY valid JSON.

        Return this exact structure:

        {
        "roleSummary": "",
        "keywords": [],
        "technicalSkills": [],
        "softSkills": [],
        "experienceRequired": "",
        "education": "",
        "responsibilities": [],
        "toolsAndTechnologies": []
        }

        Rules:
        - Return ONLY JSON.
        - Do not wrap the JSON in markdown.
        - Do not explain anything.
        - Keywords should contain the most ATS-relevant terms.
        `
      },

      {
        role: "user",
        content: jobDescription
      }
    ]
  });

  return response.choices[0].message.content;
}