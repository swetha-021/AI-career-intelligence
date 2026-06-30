export interface CareerResponse {
  success: boolean;

  company: string;

  data: {
    analysis: {
      roleSummary: string;
      keywords: string[];
      technicalSkills: string[];
      softSkills: string[];
      experienceRequired: string;
      education: string;
      responsibilities: string[];
      toolsAndTechnologies: string[];
    };

    coverLetter: string;

    recruiterMessage: string;

    recruiterSearchQuery: string;
  };
}