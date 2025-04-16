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

## 🎯 Problem Statement

Preparing for competitive exams, crafting professional resumes, practicing topic-specific MCQs, and preparing for interviews often lack:  
- Personalization and efficiency.  
- Tailored solutions that adapt to individual timelines, learning paces, and goals.  
- Interactive tools to build candidates' confidence and readiness.  

PrepWise addresses these challenges by creating an all-in-one platform that enhances the preparation process with AI-driven technologies.

## 👥 Team Details

**Team Name:** Innovation Titans  
**Team Members:**  
- Aryan Patankar (VESIT, Mumbai)
- Vaishnal Mali (VESIT, Mumbai)
- Niraj Kothawade (VESIT, Mumbai)

## 🌐 Domain

EdTech | AI-Driven Solutions | Career Development

## 💡 Core Features

- **AI-Generated Roadmaps**: Personalized plans for competitive exams based on user timelines, learning pace, and goals.
- **Resume Builder**: ATS-friendly editable templates for crafting professional resumes.
- **Exam Preparation**: AI-generated MCQs from specific topics or user-uploaded PDFs.
- **Interview Preparation**: An AI bot simulating interview scenarios by asking topic-specific questions and analyzing responses.

## 🌟 Screenshots 📸

**Landing page**
![WhatsApp Image 2025-01-19 at 20 32 34_5529cfaa](https://github.com/user-attachments/assets/fe2465e6-4b2a-4414-a74b-73079afb8c5c)
![WhatsApp Image 2025-01-19 at 20 33 21_06bda153](https://github.com/user-attachments/assets/676f3be6-a1a3-4342-9e8f-f90cc8c5b655)
![WhatsApp Image 2025-01-19 at 20 34 28_6a9cf162](https://github.com/user-attachments/assets/a8765bec-6c67-4be9-9521-ac7cd9b9544e)

**Login And SignUp**
![WhatsApp Image 2025-01-19 at 20 37 17_86e0611c](https://github.com/user-attachments/assets/4759a9e0-4517-4f35-a731-8e8f92708600)
![WhatsApp Image 2025-01-19 at 20 37 45_c7e83cc3](https://github.com/user-attachments/assets/e4288e74-e305-4f7f-b392-e8f56a763443)

**Dashboard**
![image](https://github.com/user-attachments/assets/52cf0fde-8949-416d-921c-74c79660f5e2)
![image](https://github.com/user-attachments/assets/c4a4fbfe-c652-4dab-98e5-a999714722c9)

**Technical Interview**
![image](https://github.com/user-attachments/assets/cee322f7-4afa-49fd-a32e-bafb699b693a)

**Roadmap**
![image](https://github.com/user-attachments/assets/d7f45229-b6cd-4261-a19a-78a5ec14cbf7)

**Exam Prep**
![image](https://github.com/user-attachments/assets/e8047706-953e-49db-938a-08d96d24014d)

**Resume Builder**
![image](https://github.com/user-attachments/assets/a66c0315-1bae-4183-880a-94c18677c085)

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB
- Streamlit

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vaishnal16/prep-wise.git
   cd prep-wise
   ```

2. Install Frontend Dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install Backend Dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Start the Application:

   For Frontend:
   ```bash
   npm run dev
   ```

   For Backend:
   ```bash
   npm run dev
   ```
   For AI Integration:
   ```bash
   cd frontend/src/MockInterview
   pip install -r requirement.txt
   streamlit run Mock.py
   ```
    ```bash Open New Terminal
   cd frontend/src/MockInterview
   streamlit run main.py
   ```

## 🎯 Future Enhancements

- Multi-language support for wider accessibility
- Expanding the roadmap feature to include more exams and industries
- Cloud infrastructure to support increased user traffic
- Enhanced AI models for better accuracy

## 🏆 Achievements

- Successfully developed an AI-powered preparation platform
- Addressed real-world challenges in career preparation and development
- Delivered a scalable solution for personalized learning and interview readiness

## 💪 Impact

- Empowers users to prepare effectively for exams and interviews
- Saves time with personalized AI-generated content
- Enhances job prospects with professional resume templates
- Increases confidence with interactive tools

## 🛠️ Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI/ML**: Meta Llama-3.2 LLM for generating roadmaps, MCQs, and interview simulations
- **Additional Tools**: Streamlit for UI in AI-based features, Shadcn for UI design

## 🎥 Demo Link

[Watch Demo Here](https://drive.google.com/file/d/1eyT8mFQEynVKEjy92XuIg-exx-AgS3zR/view)

## 🤝 Contributing

We welcome contributions to PrepWise! Please read our contributing guidelines before submitting pull requests.

## 📞 Contact

For any queries regarding the project, please reach out to:  
[aryanpatankar27@gmail.com](mailto:aryanpatankar27@gmail.com),  
[vaishnal16305@gmail.com](mailto:vaishnal16305@gmail.com),
[nirajsk10912@gmail.com](mailto:nirajsk10912@gmail.com) 
