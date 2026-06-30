
import { useState } from "react";
import { generateCareerIntelligence } from "../services/api";


import Navbar from "../components/Navbar";

import axios from "axios";

function CareerIntelligence() {
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();

    formData.append("company", company);
    formData.append("jobDescription", jobDescription);

    if (resume) {
      formData.append("resume", resume);
    }

    try {
      const data = await generateCareerIntelligence(formData);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  } catch (err) {
    console.error(err);
  }
};

const saveApplication = async () => {
  if (!resume || !result) return;

  const formData = new FormData();

  formData.append("company", company);
  formData.append("coverLetter", result.data.coverLetter);
  formData.append("resume", resume);

  try {
    await axios.post(
      "http://localhost:5000/applications",
      formData
    );

    alert("Application saved!");
  } catch (error) {
    console.error(error);
  }
};

  return (
    <>
    
    <Navbar />

  <div className="min-h-screen py-10" style={{ backgroundColor: "#470B10" }}>
    <div className="mx-auto max-w-5xl rounded-2xl p-8 shadow-2xl" style={{ backgroundColor: "#DBC1B2" }}>

      <h1 className="text-4xl font-bold text-[#000]">
        AI Career Intelligence
      </h1>

      <p className="mt-2 text-[#6D4A4A]">
        Analyze job descriptions, generate cover letters, and prepare recruiter outreach.
      </p>

      <div className="mt-8 space-y-5">

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Company name
        </label>

        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full rounded-lg border border-[#B89D90] bg-[#F8F2EE] p-3 focus:border-[#470B10] focus:outline-none"
        />

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Job Description
        </label>

        <textarea
          rows={12}
          placeholder="Paste Job Description..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full rounded-lg border border-[#B89D90] bg-[#F8F2EE] p-3 focus:border-[#470B10] focus:outline-none"
        />

        <div>
          {/* <label className="mb-2 block text-sm font-medium text-slate-700">
            Resume (Optional)
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              if (e.target.files) {
                setResume(e.target.files[0]);
              }
            }}
          />

          {resume && (
            <p className="mt-2 text-sm text-slate-600">
              Selected: {resume.name}
            </p>
          )} */}

            <div>
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Resume (Optional)
  </label>

  <label
    htmlFor="resume-upload"
    className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-blue-500 hover:bg-blue-50"
  >
    <div>
      <p className="font-medium text-slate-700">
        {resume ? resume.name : "📄 Upload Resume (PDF)"}
      </p>

      <p className="text-sm text-slate-500">
        Click to browse your files
      </p>
    </div>

    <span className="rounded-md bg-blue-600 px-4 py-2 text-white">
      {resume ? "Change" : "Upload"}
    </span>
  </label>

  <input
    id="resume-upload"
    type="file"
    accept=".pdf"
    className="hidden"
    onChange={(e) => {
      if (e.target.files?.length) {
        setResume(e.target.files[0]);
      }
    }}
  />
</div>


        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full cursor-pointer rounded-lg bg-[#71161f] py-3 text-lg font-semibold text-white transition hover:bg-[#470B10] disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate Career Intelligence"}
        </button>

      </div>

      {result && (

        <div className="mt-10 space-y-8">

          <div className="rounded-xl border border-[#B89D90] bg-[#F8F2EE] p-5">
            <h2 className="mb-2 text-xl font-bold">
              Role Summary
            </h2>

            <p>{result.data.analysis.roleSummary}</p>
          </div>

          <div className="rounded-lg border bg-slate-50 p-5">
            <h2 className="mb-3 text-xl font-bold">
              ATS Keywords
            </h2>

            <div className="flex flex-wrap gap-2">
              {result.data.analysis.keywords.map((keyword: string) => (
                <span
                  key={keyword}
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* <div className="rounded-lg border bg-slate-50 p-5">
            <h2 className="mb-2 text-xl font-bold">
              Cover Letter
            </h2>

            <p className="whitespace-pre-wrap">
              {result.data.coverLetter}
            </p>
          </div> */}

          <div className="rounded-lg border bg-slate-50 p-5">

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Cover Letter
              </h2>

              <button
                onClick={() => copyToClipboard(result.data.coverLetter)}
                className="rounded-md bg-slate-200 px-3 py-1 text-sm font-medium hover:bg-slate-300"
              >
                📋 Copy
              </button>
            </div>

            <p className="whitespace-pre-wrap">
              {result.data.coverLetter}
            </p>

          </div>

          {/* <div className="rounded-lg border bg-slate-50 p-5">
            <h2 className="mb-2 text-xl font-bold">
              Recruiter Message
            </h2>

            <p>{result.data.recruiterMessage}</p>
            
          </div> */}

          <div className="rounded-lg border bg-slate-50 p-5">

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Recruiter Outreach
            </h2>

            <button
              onClick={() => copyToClipboard(result.data.recruiterMessage)}
              className="rounded-md bg-slate-200 px-3 py-1 text-sm font-medium hover:bg-slate-300"
            >
              📋 Copy
            </button>
          </div>

          <p className="whitespace-pre-wrap">
            {result.data.recruiterMessage}
          </p>

        </div>

          <div className="rounded-lg border bg-slate-50 p-5">
            <h2 className="mb-2 text-xl font-bold">
              Recruiter Search Query
            </h2>

            <code className="text-blue-700">
              <a
              href={result.data.recruiterSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              🔍 Search Recruiters on Google
            </a>
            </code>
          </div>

          <button
              onClick={saveApplication}
              className="w-full rounded-lg cursor-pointer bg-green-700 py-3 text-lg font-semibold text-white hover:bg-green-800"
            >
              💾 Save Application
            </button>

        </div>
        

      )}
    </div>
  </div>
  </>
  
);

}

export default CareerIntelligence;