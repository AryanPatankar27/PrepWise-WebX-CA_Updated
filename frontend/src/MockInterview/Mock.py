import streamlit as st
import os
import requests
import json
import pypdf
import speech_recognition as sr
from dotenv import load_dotenv

load_dotenv()
CONSOLEGROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
CONSOLEGROQ_API_KEY = os.getenv("CONSOLEGROQ_API_KEY")

def extract_text_from_pdf(pdf_file, max_characters=7000):
     pdf_reader = pypdf.PdfReader(pdf_file)
     text = ""
     for page in pdf_reader.pages:
         text += page.extract_text()
         if len(text) >= max_characters:
             break
     return text[:max_characters]

def call_consolegroq_api(prompt, system_message, temperature=0.7):
    headers = {
        "Authorization": f"Bearer {CONSOLEGROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.2-90b-vision-preview",
        "temperature": temperature,
        "max_tokens": 2048,
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt}
        ]
    }
    response = requests.post(CONSOLEGROQ_API_URL, headers=headers, json=payload)
    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        st.error(f"Error: {response.status_code} {response.text}")
        return None

def generate_question(topic, pdf_content=None):
    system_message = """You are an expert technical interviewer. Generate questions in the following formats:

    For MCQ:
    Type: MCQ
    Question: [Detailed question text]
    Options:
    a) [Detailed option]
    b) [Detailed option]
    c) [Detailed option]
    d) [Detailed option]
    Correct: [a/b/c/d]
    Explanation: [Detailed explanation]

    Ensure questions are challenging and test deep understanding."""

    prompt = f"""Topic: {topic}
    Content: {pdf_content if pdf_content else 'General knowledge about the topic.'}
    Generate an MCQ question."""

    return call_consolegroq_api(prompt, system_message)

def evaluate_answer(question_data, user_answer):
    correct_option = question_data.get('correct', '').lower()
    score = 10 if user_answer.lower() == correct_option else 0

    feedback = f"Score: {score}\n"
    feedback += "Analysis:\n"
    feedback += "• Excellent answer\n" if score == 10 else "• Incorrect answer\n"
    feedback += "• Your choice matched the correct answer." if score == 10 else f"• The correct answer was {correct_option}."
    return feedback

def parse_question(response):
    lines = response.split('\n')
    question = next((line.split(': ')[1] for line in lines if line.startswith('Question:')), '')

    options_start = lines.index('Options:')
    options = [line.strip() for line in lines[options_start+1:options_start+5]]
    correct = next((line.split(': ')[1] for line in lines if line.startswith('Correct:')), '')
    explanation = next((line.split(': ')[1] for line in lines if line.startswith('Explanation:')), '')
    
    return {
        'type': 'MCQ',
        'question': question,
        'options': options,
        'correct': correct,
        'explanation': explanation
    }

def recognize_speech():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        with st.spinner("Listening..."):
            audio = recognizer.listen(source)
            try:
                recognized_text = recognizer.recognize_google(audio)
                if recognized_text.lower().startswith("option"):
                    return recognized_text.split()[1].lower()
                else:
                    return recognized_text
            except:
                st.error("Speech recognition failed. Please try again.")
                return None

# Initialize session state
if 'questions' not in st.session_state:
    st.session_state.questions = []
if 'current_question' not in st.session_state:
    st.session_state.current_question = None
if 'pdf_content' not in st.session_state:
    st.session_state.pdf_content = None

st.set_page_config(page_title="Technical Interview Practice", layout="wide")

# Custom CSS
st.markdown("""
<style>
    /* Global styles */
    .stApp {
        background: linear-gradient(135deg, #f3e8ff 0%, #ffffff 50%, #f3e8ff 100%);
    }
    
    /* Header styling */
   .main-header {
    color: #4f46e5; 
    font-family: 'Poppins', sans-serif; 
    padding: 1.5rem 0; /* Balanced spacing for larger headers */
    text-align: center;
    font-size: 3rem; /* Slightly larger font size for emphasis */
    font-weight: 700; /* Bold, but not overly heavy */
    margin-bottom: 2rem; /* Creates visual separation */
    background: linear-gradient(to right, #ffffff, #e0e7ff); /* Soft gradient for a subtle highlight */
    border-radius: 12px; /* Slightly more rounded corners */
    box-shadow: 0 6px 12px -2px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* More depth with soft shadows */
    border: 1px solid #e5e7eb; /* Light border for structure */
    max-width: 800px; /* Limits the width of the header to maintain focus */
    margin-left: auto;
    margin-right: auto; /* Center the header on the page */
}

    
    /* Card container */
    .card {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;
    }
    
    /* Question styling */
    .question-header {
        color: #6b21a8;
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }
    
    /* Button styling */
    .stButton > button {
        background-color: #8b5cf6;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.5rem 1rem;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        background-color: #7c3aed;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    /* Radio button styling */
    .stRadio > label {
        color: #4c1d95;
        font-weight: 500;
    }
    
    /* Select box styling */
    .stSelectbox > div > div {
        background-color: white;
        border: 1px solid #d8b4fe;
        border-radius: 8px;
    }
    
    /* File uploader styling */
    .stFileUploader > div {
        background-color: white;
        border: 2px dashed #d8b4fe;
        border-radius: 8px;
        padding: 1rem;
    }
    
    /* Feedback messages */
    .success-feedback {
        color: #15803d;
        background-color: #dcfce7;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
    }
    
    .error-feedback {
        color: #991b1b;
        background-color: #fee2e2;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Main UI
st.markdown('<h1 class="main-header">Exam Preparation </h1>', unsafe_allow_html=True)

with st.container():
    col1, col2 = st.columns([2, 1])
    with col1:
        topic = st.selectbox("📚 Select Topic:", 
                           ["Algorithms", "Data Structures", "Machine Learning", 
                            "Operating Systems", "Networking"])
    with col2:
        uploaded_file = st.file_uploader("📄 Upload Study Material (PDF)", 
                                       type="pdf")
    st.markdown('</div>', unsafe_allow_html=True)

# Action buttons
col1, col2 = st.columns(2)
with col1:
    if st.button("🎯 Generate Topic MCQ"):
        with st.spinner("Generating question..."):
            question_response = generate_question(topic)
            if question_response:
                st.session_state.current_question = parse_question(question_response)
                st.session_state.questions.append(question_response)

with col2:
     if st.button("📚 Generate PDF MCQ"):
         if st.session_state.pdf_content:
             with st.spinner("Analyzing PDF and generating question..."):
                 question_response = generate_question(topic, st.session_state.pdf_content)
                 if question_response:
                     st.session_state.current_question = parse_question(question_response)
                     st.session_state.questions.append(question_response)
         else:
             st.error("Please upload study material first.")

# Display current question
if st.session_state.current_question:
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown('<div class="question-header">📝 Question</div>', unsafe_allow_html=True)
    st.write(st.session_state.current_question['question'])

    options = st.session_state.current_question['options']
    selected_option = st.radio("Select your answer:", options)

    col1, col2, col3 = st.columns([1, 1, 1])
    with col1:
        if st.button("✅ Submit Answer"):
            feedback = evaluate_answer(st.session_state.current_question, selected_option)
            if "Score: 10" in feedback:
                st.markdown(f'<div class="success-feedback">{feedback}</div>', unsafe_allow_html=True)
            else:
                st.markdown(f'<div class="error-feedback">{feedback}</div>', unsafe_allow_html=True)

    with col2:
        if st.button("🎤 Speak Answer"):
            spoken_option = recognize_speech()
            if spoken_option:
                st.info(f"Your answer: {spoken_option}")
                feedback = evaluate_answer(st.session_state.current_question, spoken_option)
                if "Score: 10" in feedback:
                    st.markdown(f'<div class="success-feedback">{feedback}</div>', unsafe_allow_html=True)
                else:
                    st.markdown(f'<div class="error-feedback">{feedback}</div>', unsafe_allow_html=True)

    with col3:
        if st.button("➡️ Next Question"):
            with st.spinner("Generating next question..."):
                if st.session_state.pdf_content:
                    question_response = generate_question(topic, st.session_state.pdf_content)
                else:
                    question_response = generate_question(topic)
                
                if question_response:
                    st.session_state.current_question = parse_question(question_response)
                    st.session_state.questions.append(question_response)
    
    st.markdown('</div>', unsafe_allow_html=True)