// Direct API implementation without using @google/generative-ai package
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Check if API key is configured
if (!API_KEY) {
  console.warn('VITE_GEMINI_API_KEY is not set. API calls will fail.');
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

/**
 * Generate multiple-choice questions based on a given topic
 * @param topic The topic to generate MCQs for
 * @param temperature Controls randomness (0.0 to 1.0)
 * @returns A single MCQ object with question, options, and explanation
 */
export async function generateMCQ(topic: string, temperature = 0.7) {
  try {
    // Generate content
    const prompt = `
      Generate a challenging multiple-choice question about ${topic}.
      Make sure the question requires critical thinking and is not trivial.
      
      Format the response as a JSON object with the following structure:
      {
        "question": "The question text",
        "options": [
          {"id": "A", "text": "First option", "correct": false},
          {"id": "B", "text": "Second option", "correct": false},
          {"id": "C", "text": "Third option", "correct": true},
          {"id": "D", "text": "Fourth option", "correct": false}
        ],
        "explanation": "Detailed explanation of the correct answer"
      }
      
      Ensure:
      1. Only ONE option is marked as correct
      2. All options are plausible but only one is correct
      3. The explanation provides thorough reasoning
      4. Return valid, parseable JSON only
    `;

    const requestBody = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract text from the response
    const text = data.candidates[0].content.parts[0].text;

    // Extract JSON content (handling potential formatting issues)
    const jsonMatch = text.match(/{[\s\S]*}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;

    // Parse and validate the JSON
    const mcqData = JSON.parse(jsonStr);

    // Ensure the structure is correct and only one option is marked as correct
    validateMCQStructure(mcqData);

    return mcqData;
  } catch (error) {
    console.error("Error generating MCQ:", error);
    throw new Error("Failed to generate MCQ. Please try a different topic.");
  }
}

/**
 * Generate multiple-choice questions based on PDF content
 * @param pdfText The extracted text from the PDF
 * @returns Array of MCQ objects
 */
export async function generateMCQFromPDF(pdfText: string): Promise<any[]> {
  try {
    // Clean the PDF text to remove excessive whitespace and format issues
    const cleanedText = cleanPDFText(pdfText);
    
    // Truncate text if too long (Gemini has context limitations)
    // Set to 60,000 characters which is well within Gemini Pro's context window
    // while still allowing for robust content analysis
    const truncatedText = truncateText(cleanedText, 60000);
    
    console.log(`Sending ${truncatedText.length} characters to Gemini API`);

    // Construct a more effective prompt that combines analysis and generation
    const prompt = `
      You are an expert educator and assessment creator. I'm providing you with text extracted from an educational PDF document. 
      Your task is to:
      
      1. First, analyze the content to identify the main topics, key concepts, important facts, and relationships between ideas.
      2. Based on your analysis, generate 5 challenging multiple-choice questions that:
         - Cover the most important concepts from different sections of the document
         - Test comprehension, application, and critical thinking (not just fact recall)
         - Are specifically related to the content provided - don't invent topics not covered
         - Include references to specific concepts, terminology, or examples from the PDF
         - Have varying difficulty levels (include some advanced questions)
      
      Use this exact format for each question:
      {
        "question": "The question text, referencing specific content from the PDF",
        "options": [
          {"id": "A", "text": "First option", "correct": false},
          {"id": "B", "text": "Second option", "correct": false},
          {"id": "C", "text": "Third option", "correct": true},
          {"id": "D", "text": "Fourth option", "correct": false}
        ],
        "explanation": "Detailed explanation referencing specific PDF content"
      }
      
      Here is the PDF content to analyze:
      
      ---BEGIN DOCUMENT---
      ${truncatedText}
      ---END DOCUMENT---
      
      Return a JSON array containing exactly 5 MCQ objects with the structure shown above. 
      Include only the JSON array, no other text or explanation.
    `;

    // Generate content with optimized parameters
    const requestBody = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2, // Lower temperature for more focused, accurate responses
        maxOutputTokens: 24000, // Increased to handle detailed explanations for 5 questions
        topK: 40,
        topP: 0.95,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract text from the response
    const text = data.candidates[0].content.parts[0].text;

    // Process the response to extract valid JSON
    try {
      // Look for an array pattern in the response
      const jsonMatch = text.match(/\[\s*{[\s\S]*}\s*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      
      // Parse the extracted JSON
      const mcqArray = JSON.parse(jsonStr);
      
      // Validate each MCQ in the array
      if (!Array.isArray(mcqArray)) {
        throw new Error("Response is not an array");
      }
      
      // Ensure we have valid questions (up to 5)
      const validatedMCQs = mcqArray
        .slice(0, 5) // Limit to 5 questions
        .filter(mcq => {
          try {
            validateMCQStructure(mcq);
            return true;
          } catch (e) {
            console.warn("Invalid MCQ structure, filtering out:", e);
            return false;
          }
        });
      
      if (validatedMCQs.length === 0) {
        throw new Error("No valid MCQs found in response");
      }
      
      return validatedMCQs;
    } catch (jsonError) {
      console.error("Error parsing JSON response:", jsonError);
      
      // Fallback: Try to extract individual MCQ objects if array parsing failed
      try {
        const mcqMatches = [...text.matchAll(/{[\s\S]*?explanation[\s\S]*?}/g)];
        
        if (mcqMatches.length > 0) {
          const extractedMCQs = mcqMatches
            .map(match => {
              try {
                return JSON.parse(match[0]);
              } catch (e) {
                return null;
              }
            })
            .filter(mcq => mcq !== null)
            .slice(0, 5);
            
          if (extractedMCQs.length > 0) {
            return extractedMCQs;
          }
        }
      } catch (fallbackError) {
        console.error("Fallback extraction failed:", fallbackError);
      }
      
      // If all parsing attempts fail, return fallback questions
      return getFallbackQuestions();
    }
  } catch (error) {
    console.error("Error generating MCQs from PDF:", error);
    return getFallbackQuestions();
  }
}

/**
 * Truncate text to the specified length
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength);
}

/**
 * Clean PDF text to improve quality
 */
function cleanPDFText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .replace(/(\r\n|\n|\r)/gm, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Clean up any resulting multiple spaces
    .trim() // Remove leading/trailing whitespace
    .replace(/- /g, '') // Remove hyphenation artifacts common in PDFs
    .replace(/\s\.\s/g, '. ') // Fix spacing around periods
    .replace(/\s,\s/g, ', ') // Fix spacing around commas
    .replace(/\s+\)/g, ')') // Fix spacing before closing parentheses
    .replace(/\(\s+/g, '(') // Fix spacing after opening parentheses
    .replace(/\.\s+([A-Z])/g, '. $1'); // Ensure proper spacing after sentences
}

/**
 * Validate the structure of an MCQ object
 */
function validateMCQStructure(mcq: any): void {
  // Check if the MCQ has the required properties
  if (!mcq.question || !mcq.options || !mcq.explanation) {
    throw new Error("MCQ missing required fields");
  }

  // Check if options is an array
  if (!Array.isArray(mcq.options)) {
    throw new Error("MCQ options is not an array");
  }

  // Check if there are at least 2 options
  if (mcq.options.length < 2) {
    throw new Error("MCQ must have at least 2 options");
  }

  // Check if exactly one option is marked as correct
  const correctOptions = mcq.options.filter((option: any) => option.correct);
  if (correctOptions.length !== 1) {
    // If no correct option or multiple correct options, fix it
    // Mark all as false, then mark the first one as correct
    mcq.options.forEach((option: any) => { option.correct = false; });
    mcq.options[0].correct = true;
  }

  // Ensure each option has id, text, and correct properties
  mcq.options.forEach((option: any, index: number) => {
    if (!option.id || !option.text || typeof option.correct !== 'boolean') {
      throw new Error(`Option ${index} has invalid structure`);
    }
  });
}

/**
 * Get fallback questions if PDF MCQ generation fails
 */
function getFallbackQuestions(): any[] {
  return [
    {
      question: "What is the primary use case for Flask in web development?",
      options: [
        { id: "A", text: "Heavy computational processing", correct: false },
        { id: "B", text: "Building lightweight web applications and APIs", correct: true },
        { id: "C", text: "Enterprise-level applications with complex databases", correct: false },
        { id: "D", text: "Mobile application development", correct: false }
      ],
      explanation: "Flask is a micro web framework written in Python that is designed for building lightweight web applications and APIs. It is known for its simplicity and flexibility, making it ideal for small to medium projects."
    },
    {
      question: "Which of the following is NOT a key component of Flask?",
      options: [
        { id: "A", text: "Werkzeug", correct: false },
        { id: "B", text: "Jinja", correct: false },
        { id: "C", text: "SQLAlchemy", correct: true },
        { id: "D", text: "Route decorators", correct: false }
      ],
      explanation: "SQLAlchemy is not a built-in component of Flask. It's a popular ORM that can be used with Flask but requires separate installation. Werkzeug (WSGI utility library), Jinja (template engine), and route decorators are all core components of Flask."
    }
  ];
}

/**
 * Evaluate a user's answer to a question
 * @param question The question text
 * @param userAnswer The user's answer
 * @param correctAnswer The correct answer
 * @param temperature Controls randomness
 * @returns Feedback in JSON format
 */
export async function evaluateAnswer(
  question: string,
  userAnswer: string,
  correctAnswer: string,
  temperature = 0.5
) {
  try {
    // Generate content
    const prompt = `
      You are an expert educator. Evaluate this student's answer.
      
      Question: ${question}
      
      User's answer: ${userAnswer}
      
      Correct answer: ${correctAnswer}
      
      Provide feedback in the following JSON format:
      {
        "isCorrect": boolean (true if essentially correct, false otherwise),
        "score": number (0-10 rating of the answer),
        "feedback": "Detailed, helpful feedback that explains any mistakes and reinforces correct understanding"
      }
      
      Be somewhat lenient - if the user's answer captures the main idea correctly but uses different wording, consider it correct.
      Return only valid JSON in your response.
    `;

    const requestBody = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: 1024,
      },
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract text from the response
    const text = data.candidates[0].content.parts[0].text;

    // Extract JSON content
    const jsonMatch = text.match(/{[\s\S]*}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;

    // Parse the JSON
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error evaluating answer:", error);
    // Return default feedback if evaluation fails
    return {
      isCorrect: false,
      score: 0,
      feedback: "Sorry, I couldn't evaluate your answer. Please try again."
    };
  }
}

// Define MCQ-related types
export interface MCQOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface MCQ {
  question: string;
  options: MCQOption[];
  explanation: string;
}