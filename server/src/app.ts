import express from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

//import { analyzeJob } from "./services/analyzeService";
//import { generateCoverLetter } from "./services/coverLetterService";

import upload from "./config/multer";
import { extractResumeText } from "./services/pdfService";

import { generateCareerIntelligence } from "./services/careerIntelligenceService";

import { initializeDatabase } from "./db/database";


const dbPromise = initializeDatabase(); //database is open in the background
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server Running",
  });
});

// Analyze Job Description
app.post("/career-intelligence", upload.single("resume"),async (req, res) => {
  try {
    const { company, jobDescription } = req.body;

    let resumeText = "";

    if (req.file) {
    resumeText = await extractResumeText(req.file);
    // console.log("******** RESUME ***********");
    // console.log(resumeText);
    // console.log("************************");
    }

    const result = await generateCareerIntelligence(
    company,
    jobDescription,
    resumeText
    );

    const parsedResult = JSON.parse(result ?? "{}");

    parsedResult.recruiterSearchUrl =
    `https://www.google.com/search?q=${encodeURIComponent(
        parsedResult.recruiterSearchQuery
    )}`;

    res.json({
    success: true,
    company,
    data: parsedResult,
    });


   }catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate career intelligence.",
    });
  }
});


app.post("/applications", upload.single("resume"), async (req, res) => {
  try {
    const db = await dbPromise;

    const { company, coverLetter } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume is required.",
      });
    }

    await db.run(
      `
      INSERT INTO applications
      (company, resume, coverLetter, appliedDate)
      VALUES (?, ?, ?, ?)
      `,
      [
        company,
        req.file.buffer,
        coverLetter,
        new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        }),
      ]
    );

    res.json({
      success: true,
      message: "Application saved successfully.",
    });

  } catch (error) {
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

    const applications = await db.all(
      `
      SELECT *
      FROM applications
      ORDER BY appliedDate DESC
      `
    );

    res.json({
      success: true,
      data: applications,
    });

  } catch (error) {
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

    const application = await db.get(
      `
      SELECT resume
      FROM applications
      WHERE id = ?
      `,
      [req.params.id]
    );

    if (!application) {
      return res.status(404).send("Resume not found");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.send(application.resume);

  } catch (error) {
    console.error(error);

    res.status(500).send("Failed to fetch resume.");
  }
});


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});