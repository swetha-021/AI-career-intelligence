"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCoverLetter = generateCoverLetter;
const openai_1 = __importDefault(require("../config/openai"));
async function generateCoverLetter(company, jobDescription) {
    const response = await openai_1.default.chat.completions.create({
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
//# sourceMappingURL=coverLetterService.js.map