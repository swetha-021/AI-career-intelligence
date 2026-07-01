import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

interface Application {
  id: number;
  company: string;
  coverLetter: string;
  appliedDate: string;
}

export default function JobTracker() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/applications"
      );

      setApplications(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const viewCoverLetter = async (id: number) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/applications/${id}/cover-letter`
    );

    setCoverLetter(response.data.coverLetter);

  } catch (error) {
    console.error(error);
  }
};

return (
  <>
    <Navbar />

    <div
      className="min-h-screen py-10"
      style={{ backgroundColor: "#470B10" }}
    >
      <div
        className="mx-auto max-w-5xl rounded-2xl p-8 shadow-2xl"
        style={{ backgroundColor: "#DBC1B2" }}
      >
        <h1 className="text-4xl font-bold text-black">
          Job Tracker
        </h1>

        <p className="mt-2 text-[#6D4A4A]">
          Track every application you've generated and saved.
        </p>

        <div className="mt-8 overflow-x-auto rounded-xl border border-[#B89D90] bg-[#F8F2EE]">
          <table className="min-w-full">
            <thead className="bg-[#470B10] text-white">
              <tr>
                <th className="px-6 py-4 text-left">Company</th>
                <th className="px-6 py-4 text-left">Resume</th>
                <th className="px-6 py-4 text-left">Cover Letter</th>
                <th className="px-6 py-4 text-left">Applied Date</th>
              </tr>
            </thead>

            <tbody>
              {applications.length > 0 ? (
                applications.map((application) => (
                  <tr
                    key={application.id}
                    className="border-b border-[#D2B7A8] hover:bg-[#F2E5DD]"
                  >
                    <td className="px-6 py-4 font-medium">
                      {application.company}
                    </td>

                    <td className="px-6 py-4">
                      <a
                        href={`http://localhost:5000/applications/${application.id}/resume`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        📄 View Resume
                      </a>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => viewCoverLetter(application.id)}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        📋 View
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(application.appliedDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No saved applications yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

              {coverLetter && (
        <div className="mt-8 rounded-xl border border-[#B89D90] bg-[#F8F2EE] p-6">
          <h2 className="mb-4 text-2xl font-bold">
            Cover Letter
          </h2>

          <p className="whitespace-pre-wrap">
            {coverLetter}
          </p>
        </div>
      )}
      </div>
    </div>
  </>
);
}