import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import { GoogleGenAI } from '@google/genai';

export const parseResumeFromUrl = async (pdfUrl) => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not found. Skipping AI Resume Parsing.');
    return null;
  }

  try {
    // 1. Fetch PDF from Cloudinary URL
    const response = await fetch(pdfUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Parse PDF to text
    const data = await pdf(buffer);
    const text = data.text;

    if (!text || text.trim() === '') {
        console.warn('Extracted empty text from PDF.');
        return null;
    }

    // 3. Ask Gemini to extract structured data
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
    Extract the following information from the resume text below:
    1. A short, professional bio (2-3 sentences).
    2. A comma-separated list of technical skills.
    3. A brief summary of work experience (max 3-4 sentences).

    Return ONLY a valid JSON object with the exact following keys. Do NOT wrap the JSON in markdown blocks (e.g. \`\`\`json). Just return the raw JSON object.
    {
      "bio": "...",
      "skills": "...",
      "experience": "..."
    }

    Resume Text:
    ${text.substring(0, 8000)}
    `;

    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    const responseText = result.text.trim();
    
    // In case the model still returns markdown backticks, strip them
    let jsonStr = responseText;
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error parsing resume with AI:', error);
    return null;
  }
};
