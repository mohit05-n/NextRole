const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

async function parseResumeWithGemini(resumeText, defaultEmail) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured on AWS Lambda.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
Analyze the following extracted resume text and structure it into a JSON object.
Ensure that the output strictly adheres to the following JSON schema and includes all fields:

Schema:
{
  "name": "Full Name",
  "email": "Email address",
  "phone": "Phone number or empty string",
  "location": "Location (City, Country/State) or empty string",
  "summary": "Short professional summary",
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
      "description": "Summary of responsibilities and achievements",
      "skillsUsed": ["SkillA", "SkillB"]
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
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Issue Date (e.g. YYYY-MM)",
      "url": "Verification URL (or empty string)"
    }
  ],
  "achievements": ["Achievement 1", "Achievement 2"],
  "languages": ["Language 1", "Language 2"],
  "softSkills": ["Soft Skill 1", "Soft Skill 2"],
  "atsScore": 75,
  "resumeScore": 80,
  "targetRole": "Suggested target job title based on background"
}

If any section or value is missing from the resume text, infer it where possible or use sensible default empty values/arrays (do not leave out fields). Do not include any markup code fences or notes outside the JSON wrapper.

Extracted Resume Text:
${resumeText}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (!text) {
      throw new Error("Gemini returned empty text response");
    }

    const parsed = JSON.parse(text);
    parsed.email = defaultEmail || parsed.email || "";
    return parsed;
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    throw new Error(`Gemini resume analysis failed: ${error.message}`);
  }
}

async function generateRoadmapWithGemini(skills, experience, targetRole) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
Based on the following technical skills, work experiences, and target role, generate a step-by-step career roadmap split into 3 progressive milestones.

Skills: ${JSON.stringify(skills)}
Experience: ${JSON.stringify(experience)}
Target Role: ${targetRole}

Return a JSON object conforming exactly to this schema:
{
  "roadmap": [
    {
      "title": "Phase Title (e.g., Master AWS Backend Systems)",
      "description": "What to achieve in this phase",
      "duration": "Estimated time (e.g., 3 months)",
      "skillsToLearn": ["Technology A", "Technology B"],
      "steps": ["Step 1 description", "Step 2 description"]
    }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return parsed.roadmap || [];
  } catch (error) {
    console.error("Gemini Roadmap Generation Error:", error);
    throw new Error(`Failed to generate roadmap with Gemini: ${error.message}`);
  }
}

async function generateProjectRecommendationsWithGemini(skills) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
Based on the following list of technical skills, suggest three custom project recommendations: one Beginner, one Intermediate, and one Advanced.

Skills: ${JSON.stringify(skills)}

Return a JSON object conforming exactly to this schema:
{
  "beginner": [
    {
      "title": "Beginner Project Title",
      "description": "Detailed project description outlining what they should build and its core features",
      "skills": ["Skill1", "Skill2"]
    }
  ],
  "intermediate": [
    {
      "title": "Intermediate Project Title",
      "description": "Detailed project description outlining what they should build and its core features",
      "skills": ["Skill1", "Skill2"]
    }
  ],
  "advanced": [
    {
      "title": "Advanced Project Title",
      "description": "Detailed project description outlining what they should build and its core features",
      "skills": ["Skill1", "Skill2"]
    }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Project Recommendations Error:", error);
    throw new Error(`Failed to generate project suggestions: ${error.message}`);
  }
}

async function generateCertificationRecommendationsWithGemini(skills, targetRole, resumeSummary) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
Recommend 3 suitable Amazon Web Services (AWS) Certifications based on the user's current technical skills, target career goal/role, and profile details.

Skills: ${JSON.stringify(skills)}
Target Role: ${targetRole}
Resume Summary: ${resumeSummary}

Return a JSON object conforming exactly to this schema:
{
  "certifications": [
    {
      "name": "AWS Certification Name (e.g. AWS Certified Developer - Associate)",
      "reason": "Clear explanation of why this certification helps their target career role",
      "tier": "Foundational, Associate, Professional, or Specialty"
    }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return parsed.certifications || [];
  } catch (error) {
    console.error("Gemini Certification Recommendations Error:", error);
    throw new Error(`Failed to generate certification suggestions: ${error.message}`);
  }
}

module.exports = {
  parseResumeWithGemini,
  generateRoadmapWithGemini,
  generateProjectRecommendationsWithGemini,
  generateCertificationRecommendationsWithGemini
};
