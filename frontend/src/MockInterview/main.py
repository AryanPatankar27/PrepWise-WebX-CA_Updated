import streamlit as st
import time
import json
from groq import Groq
import speech_recognition as sr
import threading
from queue import Queue
import random
import pyaudio

# Streamlit configuration
st.set_page_config(page_title="AI Technical Interview Assistant", layout="wide")

# Initialize session state variables
if 'current_question_index' not in st.session_state:
    st.session_state.current_question_index = 0
if 'questions' not in st.session_state:
    st.session_state.questions = []
if 'responses' not in st.session_state:
    st.session_state.responses = []
if 'interview_complete' not in st.session_state:
    st.session_state.interview_complete = False
if 'is_recording' not in st.session_state:
    st.session_state.is_recording = False
if 'current_response' not in st.session_state:
    st.session_state.current_response = ""
if 'text_queue' not in st.session_state:
    st.session_state.text_queue = Queue()
if 'speech_text' not in st.session_state:
    st.session_state.speech_text = ""

# API Configuration
GROQ_API_KEY = "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"  # Replace with your actual API key

class VoiceRecognizer:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.is_recording = False
        self.mic = None
        self.thread = None
        self.text_queue = st.session_state.text_queue

    def start_recording(self):
        """Start voice recording and recognition"""
        self.is_recording = True
        self.thread = threading.Thread(target=self._record_audio)
        self.thread.daemon = True
        self.thread.start()

    def stop_recording(self):
        """Stop voice recording"""
        self.is_recording = False
        if self.thread:
            self.thread.join()

    def _record_audio(self):
        """Record and transcribe audio in real-time"""
        try:
            with sr.Microphone() as source:
                # Adjust for ambient noise
                self.recognizer.adjust_for_ambient_noise(source, duration=0.5)
                
                while self.is_recording:
                    try:
                        # Listen for audio input
                        audio = self.recognizer.listen(source, timeout=2, phrase_time_limit=10)
                        
                        # Transcribe audio to text
                        text = self.recognizer.recognize_google(audio)
                        if text:
                            # Add transcribed text to queue
                            self.text_queue.put(text + " ")
                            # Update session state
                            st.session_state.speech_text += text + " "
                            st.session_state.current_response = st.session_state.speech_text
                    except sr.UnknownValueError:
                        continue
                    except sr.WaitTimeoutError:
                        continue
                    except sr.RequestError as e:
                        st.error(f"Could not request results: {str(e)}")
                        break
                    except Exception as e:
                        st.error(f"Error during recording: {str(e)}")
                        break
        except Exception as e:
            st.error(f"Microphone error: {str(e)}")

class InterviewSystem:
    def __init__(self):
        self.groq_client = Groq(api_key=GROQ_API_KEY)
        self.model = "llama-3.3-70b-versatile"
        self.question_cache = {}

    def generate_questions(self, topic="python"):
        """Generate interview questions using the Groq API"""
        cache_key = f"{topic.lower()}_questions"
        
        if cache_key not in self.question_cache:
            system_prompt = """You are an expert technical interviewer. Generate 7 technical interview questions in JSON format.
            Each question should be unique and cover different aspects of the technology.
            Question structure:
            {
                "question": "The interview question",
                "expected_points": ["Key point 1", "Key point 2", "Key point 3"],
                "difficulty": "easy/medium/hard",
                "reference": "Link or resource for further reading",
                "topic_area": "Specific area within the technology"
            }"""
            
            user_prompt = f"Generate diverse technical interview questions about {topic} programming. Include detailed expected points for evaluation."

            try:
                completion = self.groq_client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.9,
                    max_tokens=4000
                )

                questions = self._parse_questions(completion.choices[0].message.content)
                if questions:
                    self.question_cache[cache_key] = questions
            except Exception as e:
                st.error(f"Error generating questions: {str(e)}")
                return []

        # Randomly select 5 questions from cache
        all_questions = self.question_cache.get(cache_key, [])
        return random.sample(all_questions, min(5, len(all_questions)))

    def _parse_questions(self, content):
        """Parse questions from API response"""
        try:
            start_idx = content.find('[')
            end_idx = content.rfind(']') + 1
            if start_idx != -1 and end_idx != -1:
                json_content = content[start_idx:end_idx]
                questions = json.loads(json_content)
            else:
                questions = json.loads(content)

            # Validate questions
            validated_questions = []
            required_fields = ['question', 'expected_points', 'difficulty', 'reference', 'topic_area']
            
            for q in questions:
                if all(field in q for field in required_fields):
                    validated_questions.append(q)
            
            return validated_questions
        except json.JSONDecodeError:
            return []

    def evaluate_response(self, question, response):
        """Evaluate interview response"""
        try:
            evaluation_prompt = f"""
            Question: {question['question']}
            Expected points: {', '.join(question['expected_points'])}
            Actual response: {response}
            
            Evaluate this response in JSON format:
            {{
                "score": <0-100>,
                "feedback": "Detailed feedback",
                "key_points_covered": ["point1", "point2"],
                "missing_concepts": ["concept1", "concept2"],
                "improvement_suggestions": ["suggestion1", "suggestion2"]
            }}
            """
            
            completion = self.groq_client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert technical interviewer."},
                    {"role": "user", "content": evaluation_prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )

            return self._parse_evaluation(completion.choices[0].message.content)
        except Exception as e:
            st.error(f"Evaluation error: {str(e)}")
            return None

    def _parse_evaluation(self, content):
        """Parse evaluation from API response"""
        try:
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            if start_idx != -1 and end_idx != -1:
                return json.loads(content[start_idx:end_idx])
            return json.loads(content)
        except json.JSONDecodeError:
            return None

def update_text_area():
    """Update text area with transcribed text from queue"""
    while not st.session_state.text_queue.empty():
        text = st.session_state.text_queue.get()
        if text:
            st.session_state.current_response += text

def main():
    st.title("AI Technical Interview Assistant")

    # Initialize systems
    interview_system = InterviewSystem()
    voice_recognizer = VoiceRecognizer()

    # Sidebar
    with st.sidebar:
        st.header("Interview Settings")
        topic = st.selectbox(
            "Select Programming Topic",
            ["Python", "JavaScript", "Java", "C++", "React", "SQL", "System Design"]
        )
        
        if st.button("Start New Interview"):
            # Preserve question cache while clearing other state
            current_cache = interview_system.question_cache.copy()
            for key in list(st.session_state.keys()):
                del st.session_state[key]
            st.session_state.text_queue = Queue()
            interview_system.question_cache = current_cache
            st.rerun()

    # Generate questions if needed
    if len(st.session_state.questions) == 0:
        with st.spinner("Preparing interview questions..."):
            questions = interview_system.generate_questions(topic.lower())
            if questions:
                st.session_state.questions = questions
            else:
                st.error("Failed to generate questions. Please try again.")
                return

    # Display progress
    if len(st.session_state.questions) > 0:
        progress = st.session_state.current_question_index / len(st.session_state.questions)
        st.progress(progress, text=f"Question {st.session_state.current_question_index + 1} of {len(st.session_state.questions)}")

    # Main interview loop
    if not st.session_state.interview_complete:
        current_question = st.session_state.questions[st.session_state.current_question_index]

        # Display question
        st.subheader(f"Question {st.session_state.current_question_index + 1}:")
        st.write(current_question['question'])
        
        col1, col2 = st.columns(2)
        with col1:
            st.info(f"Difficulty: {current_question['difficulty']}")
        with col2:
            st.info(f"Topic: {current_question['topic_area']}")

        # Voice controls
        col1, col2 = st.columns([1, 3])
        with col1:
            if not st.session_state.is_recording:
                if st.button("🎤 Start Recording"):
                    st.session_state.is_recording = True
                    voice_recognizer.start_recording()
                    
            else:
                if st.button("⏹️ Stop Recording"):
                    st.session_state.is_recording = False
                    voice_recognizer.stop_recording()
                    

        # Update transcribed text
        if st.session_state.is_recording:
            update_text_area()

        # Response area
        response = st.text_area(
            "Your response (speak or type):",
            value=st.session_state.current_response,
            height=200,
            key="response_area"
        )

        # Update response if manually edited
        if response != st.session_state.current_response:
            st.session_state.current_response = response
            st.session_state.speech_text = response

        # Control buttons
        col1, col2 = st.columns(2)
        with col1:
            if st.button("Submit Response"):
                if response.strip():
                    with st.spinner("Evaluating your response..."):
                        evaluation = interview_system.evaluate_response(
                            current_question,
                            response
                        )
                        if evaluation:
                            st.session_state.responses.append({
                                "question": current_question,
                                "response": response,
                                "evaluation": evaluation
                            })
                            
                            # Display evaluation
                            st.write("### Evaluation Results")
                            score = evaluation['score']
                            
                            if score >= 80:
                                st.success(f"Score: {score}/100")
                            elif score >= 60:
                                st.warning(f"Score: {score}/100")
                            else:
                                st.error(f"Score: {score}/100")

                            st.write("#### Feedback")
                            st.write(evaluation['feedback'])
                            
                            st.write("#### Key Points Covered")
                            for point in evaluation['key_points_covered']:
                                st.write(f"• {point}")

                            if score < 70:
                                st.warning("#### Areas for Improvement")
                                for concept in evaluation['missing_concepts']:
                                    st.write(f"• {concept}")
                                
                                st.write("#### Suggestions")
                                for suggestion in evaluation['improvement_suggestions']:
                                    st.write(f"• {suggestion}")

                            # Next question
                            if st.button("Next Question"):
                                st.session_state.current_question_index += 1
                                st.session_state.current_response = ""
                                st.session_state.speech_text = ""
                                if st.session_state.current_question_index >= len(st.session_state.questions):
                                    st.session_state.interview_complete = True
                                st.rerun()

        with col2:
            if st.button("Clear Response"):
                st.session_state.current_response = ""
                st.session_state.speech_text = ""
                st.rerun()

    else:
        # Display final results
        st.success("🎉 Interview Complete!")
        
        scores = [r['evaluation']['score'] for r in st.session_state.responses]
        avg_score = sum(scores) / len(scores)
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Overall Score", f"{avg_score:.1f}%")
        with col2:
            st.metric("Highest Score", f"{max(scores)}%")
        with col3:
            st.metric("Lowest Score", f"{min(scores)}%")

        # Export results
        if st.button("Export Results"):
            results = {
                "date": time.strftime("%Y-%m-%d %H:%M:%S"),
                "topic": topic,
                "overall_score": avg_score,
                "responses": st.session_state.responses
            }
            st.download_button(
                "Download Results",
                data=json.dumps(results, indent=2),
                file_name=f"interview_results_{time.strftime('%Y%m%d_%H%M')}.json",
                mime="application/json"
            )

if __name__ == "__main__":
    main()