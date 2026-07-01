"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeJob = analyzeJob;
const openai_1 = __importDefault(require("../config/openai"));
async function analyzeJob(jobDescription) {
    const response = await openai_1.default.chat.completions.create({
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
//# sourceMappingURL=analyzeService.js.map