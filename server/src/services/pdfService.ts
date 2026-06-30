//converts resume to plain text

import pdf from "pdf-parse";

export async function extractResumeText(file: Express.Multer.File) {
  const data = await pdf(file.buffer);

  return data.text;
}