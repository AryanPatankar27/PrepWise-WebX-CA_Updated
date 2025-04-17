# Prepwise 2.0

An application for exam preparation with AI-generated MCQs.

## Features

- Generate MCQs from specific topics using Gemini 2.0 Flash
- Upload PDFs to generate contextual questions
- Answer evaluation with feedback
- Interactive UI for a seamless learning experience

## Setup Instructions

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Environment Variables

Create a `.env` file in the frontend directory with the following content:

```
VITE_GEMINI_API_KEY=your_gemini_api_key
```

You can obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/).

### Installation

1. Clone this repository
2. Install dependencies:

```bash
cd frontend
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Select a topic from the dropdown or upload a PDF file
2. Click on "Generate Topic MCQ" or "Generate PDF MCQ"
3. Answer the question by selecting an option
4. Submit your answer to see feedback
5. Click "Next Question" to proceed

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini 2.0 Flash API

