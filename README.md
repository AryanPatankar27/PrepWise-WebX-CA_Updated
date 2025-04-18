# PrepWise 2.0

PrepWise is an intelligent exam preparation platform that helps students generate and practice multiple-choice questions from educational content, including both topic-based and PDF study materials.

## Features

- **Topic-Based MCQs**: Generate challenging multiple-choice questions on any educational topic
- **PDF-Based MCQs**: Upload your study materials (PDF) and generate relevant multiple-choice questions
- **Intelligent Question Analysis**: Uses Google's Gemini-2.0-Flash AI to analyze content and create context-aware questions
- **Interactive Practice Mode**: Answer questions, receive instant feedback, and track progress
- **Score Tracking**: Review performance metrics to identify strengths and areas for improvement

## Tech Stack

### Frontend
- **React**: UI library for building the user interface
- **TypeScript**: For type-safe JavaScript code
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Next-generation frontend build tool

### Backend
- **Python Flask**: Lightweight web server for handling API requests
- **MongoDB**: NoSQL database for storing MCQ results and user data

### AI/ML
- **Google Gemini-2.0-Flash API**: Advanced language model for generating MCQs
- **PDF.js**: For extracting text from PDF documents

### Tools & Utilities
- **Axios**: HTTP client for API requests
- **React Router**: For application routing
- **Flask-CORS**: For handling Cross-Origin Resource Sharing

## Installation

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- MongoDB

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create a .env.local file with your Gemini API key
echo "VITE_GEMINI_API_KEY=your_gemini_api_key_here" > .env.local

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend/python_api

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

## Usage

1. **Topic-Based Questions**:
   - Navigate to the "Topic-Based MCQs" tab
   - Enter a subject or topic (e.g., "Data Structures", "Machine Learning")
   - Click "Generate MCQ" to create questions
   - Answer the questions and view explanations

2. **PDF-Based Questions**:
   - Navigate to the "PDF-Based MCQs" tab
   - Upload a PDF document containing educational content
   - Click "Generate PDF MCQs" to create questions based on the content
   - Answer the questions to test your understanding of the material

## Project Structure

```
prepwise2.0/
├── frontend/                  # React frontend application
│   ├── public/                # Static files
│   ├── src/                   # Source code
│   │   ├── components/        # React components
│   │   ├── context/           # Context providers
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   │   ├── geminiApi.ts   # Gemini API integration
│   │   │   ├── pdfService.ts  # PDF processing
│   │   │   └── dbService.ts   # Database services
│   │   └── utils/             # Utility functions
│   ├── .env.local             # Environment variables (not in git)
│   └── package.json           # Dependencies
│
└── backend/                   # Backend server code
    └── python_api/            # Flask API server
        ├── app.py             # Main application file
        └── requirements.txt   # Python dependencies
```

## Development

- The frontend runs on http://localhost:5173
- The backend API runs on http://localhost:5000
- MongoDB should be running on default port 27017

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini API for AI capabilities
- Mozilla PDF.js for PDF text extraction
