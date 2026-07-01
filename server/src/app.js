"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//import { analyzeJob } from "./services/analyzeService";
//import { generateCoverLetter } from "./services/coverLetterService";
const multer_1 = __importDefault(require("./config/multer"));
const pdfService_1 = require("./services/pdfService");
const careerIntelligenceService_1 = require("./services/careerIntelligenceService");
const database_1 = require("./db/database");
const dbPromise = (0, database_1.initializeDatabase)(); //database is open in the background
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Server Running",
    });
});
// Analyze Job Description
app.post("/career-intelligence", multer_1.default.single("resume"), async (req, res) => {
    try {
        const { company, jobDescription } = req.body;
        let resumeText = "";
        if (req.file) {
            resumeText = await (0, pdfService_1.extractResumeText)(req.file);
            // console.log("******** RESUME ***********");
            // console.log(resumeText);
            // console.log("************************");
        }
        const result = await (0, careerIntelligenceService_1.generateCareerIntelligence)(company, jobDescription, resumeText);
        const parsedResult = JSON.parse(result ?? "{}");
        parsedResult.recruiterSearchUrl =
            `https://www.google.com/search?q=${encodeURIComponent(parsedResult.recruiterSearchQuery)}`;
        res.json({
            success: true,
            company,
            data: parsedResult,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to generate career intelligence.",
        });
    }
});
app.post("/applications", multer_1.default.single("resume"), async (req, res) => {
    try {
        const db = await dbPromise;
        const { company, coverLetter } = req.body;
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume is required.",
            });
        }
        await db.run(`
      INSERT INTO applications
      (company, resume, coverLetter, appliedDate)
      VALUES (?, ?, ?, ?)
      `, [
            company,
            req.file.buffer,
            coverLetter,
            new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
        ]);
        res.json({
            success: true,
            message: "Application saved successfully.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to save application.",
        });
    }
});
app.get("/applications", async (req, res) => {
    try {
        const db = await dbPromise;
        const applications = await db.all(`
      SELECT *
      FROM applications
      ORDER BY appliedDate DESC
      `);
        res.json({
            success: true,
            data: applications,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch applications.",
        });
    }
});
app.get("/applications/:id/resume", async (req, res) => {
    try {
        const db = await dbPromise;
        const application = await db.get(`
      SELECT resume
      FROM applications
      WHERE id = ?
      `, [req.params.id]);
        if (!application) {
            return res.status(404).send("Resume not found");
        }
        res.setHeader("Content-Type", "application/pdf");
        res.send(application.resume);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Failed to fetch resume.");
    }
});
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map