import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "../utils/logger";

export async function parseResumeWithGemini(
  resumeText: string,
  userEmail: string
): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured");
  }

  logger.info(`Sending resume text to Gemini for parsing. Text length: ${resumeText.length}`);
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using gemini-1.5-flash which is widely compatible and fast
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" } as any
    });

    const prompt = `
Analyze the following extracted resume text and structure it into a JSON object.
Ensure that the output strictly adheres to the following JSON schema and includes all fields:

Schema:
{
  "name": "Full Name",
  "email": "Email address",
  "skills": ["Skill1", "Skill2"],
  "education": [
    {
      "degree": "Degree (e.g. Bachelor of Science)",
      "fieldOfStudy": "Field of Study (e.g. Computer Science)",
      "school": "University/School name",
      "startYear": "Start Year",
      "endYear": "End Year or Present"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "Start Date (e.g. YYYY-MM)",
      "endDate": "End Date or Present",
      "description": "Short summary of responsibilities and achievements",
      "skillsUsed": ["SkillA", "SkillB"]
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Issue Date (e.g. YYYY-MM)",
      "url": "Verification URL (or empty string)"
    }
  ],
  "projects": [
    {
      "title": "Project Title",
      "description": "Short project overview",
      "skills": ["Skill1", "Skill2"],
      "githubUrl": "Repository Link (or empty string)",
      "liveUrl": "Demo Link (or empty string)"
    }
  ],
  "roadmap": [
    {
      "title": "Roadmap Phase/Milestone (e.g. Master AWS Cloud Development)",
      "description": "Short description of what the user should achieve in this phase",
      "duration": "Estimated duration (e.g., 3 months)",
      "skillsToLearn": ["Skill1", "Skill2"],
      "steps": ["Step 1", "Step 2"]
    }
  ]
}

If any section or value is missing from the resume text, infer it where possible or use sensible default empty values/arrays (do not leave out fields). Also, construct a tailored career roadmap with 3 logical sequential phases based on the user's current experience level and skills to guide their career growth.

Extracted Resume Text:
${resumeText}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (!text) {
      throw new Error("Gemini returned empty text response");
    }

    const parsedData = JSON.parse(text);
    // Ensure the email matches the authenticated user email
    parsedData.email = userEmail || parsedData.email || "";

    logger.info(`Successfully parsed resume with Gemini. Extracted name: ${parsedData.name}`);
    return parsedData;
  } catch (error) {
    logger.error("Gemini API parsing failed", error);
    throw error;
  }
}
