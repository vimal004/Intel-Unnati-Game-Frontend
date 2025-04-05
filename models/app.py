import streamlit as st
from quiz import get_question, start_quiz  # Import the quiz function from quiz.py

# Set page title
st.set_page_config(page_title="Interactive Quiz", page_icon="🧠", layout="wide")

# Session State: Store selected subject
if "selected_subject" not in st.session_state:
    st.session_state.selected_subject = None

# Session State: Store quiz parameters
if "num_questions" not in st.session_state:
    st.session_state.num_questions = None
if "time_per_question" not in st.session_state:
    st.session_state.time_per_question = None

# 🎯 Home Page UI
def home_page():
    st.title("🎯 Welcome to the Interactive Quiz!")
    st.subheader("📚 Choose a Subject to Start Your Quiz")

    # Subject Selection Cards
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("📐 Mathematics", key="maths"):
            st.session_state.selected_subject = "Mathematics"
            st.session_state.num_questions = None  # Reset num_questions
            st.session_state.time_per_question = None  # Reset time per question
            st.session_state.quiz_started = False  # Ensure quiz has not started
            st.rerun()  # Redirect to parameter setup page

    with col2:
        if st.button("🔬 Science", key="science"):
            st.session_state.selected_subject = "Science"
            st.session_state.num_questions = None  # Reset num_questions
            st.session_state.time_per_question = None  # Reset time per question
            st.session_state.quiz_started = False  # Ensure quiz has not started
            st.rerun()  # Redirect to parameter setup page

# Set quiz parameters
def set_quiz_parameters():
    st.title("Set Quiz Parameters")

    st.session_state.num_questions = st.number_input("How many questions would you like?", min_value=1, max_value=20, value=10)
    st.session_state.time_per_question = st.number_input("Time per question (in seconds):", min_value=1, max_value=60, value=30)

    if st.button("Start Quiz"):
        # Initialize session state variables
        st.session_state.start_time = None
        st.session_state.score = 0
        st.session_state.total_attempts = 0
        st.session_state.streak = 0
        st.session_state.questions_asked = 0
        st.session_state.completed = False  # Track if quiz is complete
        st.session_state.quiz_started = True  # Flag quiz start
        st.session_state.current_question = get_question(st.session_state.selected_subject)
        st.rerun()

# 🚀 Run Home Page, Quiz Parameters, or Quiz
if st.session_state.selected_subject is None:
    home_page()
elif st.session_state.quiz_started is False:
    set_quiz_parameters()
else:
    start_quiz(st.session_state.selected_subject)
