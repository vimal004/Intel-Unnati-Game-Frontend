import streamlit as st
import random
import time
from datasets import load_dataset

# ✅ Load the datasets dynamically
def load_quiz_datasets():
    # ✅ Load Mathematics Dataset
    mathqa_dataset = load_dataset("math_qa", trust_remote_code=True)

    math_questions = []
    for data in mathqa_dataset["train"]:
        context = data["Problem"]
        options = data["options"].split(", ")  # Convert options string to list
        correct_answer = options[ord(data["correct"]) - ord("a")]  # Convert 'a', 'b' -> index

        # Handle formatting for questions like "What are the two numbers?"
        if "two numbers" in context:
            if len(options) % 2 != 0:
                options.append("N/A")  # Add a dummy value to make the number even

            formatted_options = [
                f"{options[i]} {options[i + 1]}" for i in range(0, len(options), 2)
            ]
            math_questions.append({
                "question": context,
                "options": formatted_options,
                "answer": correct_answer,
                "topic": "Mathematics"
            })
        else:
            math_questions.append({
                "question": context,
                "options": options,
                "answer": correct_answer,
                "topic": "Mathematics"
            })

    # ✅ Load Science Dataset
    sciq_dataset = load_dataset("ai2_arc", "ARC-Easy")
    science_questions = []
    for data in sciq_dataset["train"]:
        question = data["question"]
        choices = data["choices"]["text"]
        labels = data["choices"]["label"]
        answer_index = data["answerKey"]
        if answer_index in labels:
            answer_text = choices[labels.index(answer_index)]
        else:
            answer_text = "Unknown"

        science_questions.append({
            "question": question,
            "options": choices,
            "answer": answer_text,
            "topic": "Science"
        })

    return math_questions, science_questions


# Load dataset
math_questions, science_questions = load_quiz_datasets()

# ✅ Function to get a random question
def get_question(topic):
    if topic == "Mathematics":
        return random.choice(math_questions)
    elif topic == "Science":
        return random.choice(science_questions)

# ✅ Quiz Page with Timer, Progress Bar & Streak Counter
def start_quiz(subject):
    st.title("🧠 Interactive Quiz Generator")

    # Back to Home Button
    if st.button("⬅ Back to Home"):
        st.session_state.selected_subject = None
        st.session_state.quiz_started = False
        st.rerun()

    st.subheader(f"📖 Subject: {subject}")

    # Initialize session state variables
    if "current_question" not in st.session_state or "subject" not in st.session_state or st.session_state.subject != subject:
        st.session_state.current_question = get_question(subject)
        st.session_state.subject = subject
        st.session_state.score = 0
        st.session_state.total_attempts = 0
        st.session_state.streak = 0
        st.session_state.questions_asked = 0
        st.session_state.completed = False

    # Timer logic
    if st.session_state.start_time is None:
        st.session_state.start_time = time.time()

    elapsed_time = time.time() - st.session_state.start_time
    time_left = max(0, st.session_state.time_per_question - int(elapsed_time))
    st.write(f"⏳ Time left: {time_left} seconds")

    # Display streak message 🔥
    if st.session_state.streak >= 3:
        st.success(f"🔥 Streak: {st.session_state.streak} correct answers in a row! Keep going!")
    elif st.session_state.streak == 2:
        st.info(f"Good start! 2 correct answers in a row.")

    # Display question number
    question_number = st.session_state.questions_asked + 1
    st.write(f"**Question {question_number} of {st.session_state.num_questions}:** {st.session_state.current_question['question']}")

    # Options as radio buttons
    options = st.session_state.current_question["options"]
    correct_answer = st.session_state.current_question["answer"]
    user_choice = st.radio("Choose an option:", options, key="answer", disabled=st.session_state.completed)

    # ✅ Submit Answer
    if st.button("Submit Answer") and not st.session_state.completed:
        st.session_state.total_attempts += 1
        if user_choice == correct_answer:
            st.success("✅ Correct!")
            st.session_state.score += 1
            st.session_state.streak += 1  # Increase streak on correct answer
        else:
            st.error(f"❌ Incorrect! The correct answer was: {correct_answer}")
            st.session_state.streak = 0  # Reset streak on incorrect answer

        # Update progress
        st.session_state.questions_asked += 1
        st.session_state.completed = True

    # Disable answer options when time runs out
    if time_left <= 0:
        st.session_state.completed = True

    # Display Score
    st.write(f"**Score:** {st.session_state.score} / {st.session_state.total_attempts}")

    # ✅ Next Question Button
    if st.button("Next Question"):
        if st.session_state.questions_asked < st.session_state.num_questions:
            st.session_state.completed = False  # Reset for next question
            st.session_state.current_question = get_question(subject)
            st.session_state.start_time = None  # Reset the timer for next question
            st.rerun()
        else:
            # Show final score page when quiz is completed
            show_results()

def show_results():
    st.title("🎉 Quiz Completed!")
    st.subheader(f"Your final score is: {st.session_state.score} out of {st.session_state.num_questions}")
    st.subheader(f"🔥 Streak: {st.session_state.streak} correct answers in a row!")

    st.markdown("### Would you like to try again or go back to the home page?")
    if st.button("Try Again"):
        st.session_state.score = 0
        st.session_state.total_attempts = 0
        st.session_state.streak = 0
        st.session_state.questions_asked = 0
        st.session_state.completed = False
        st.session_state.start_time = None
        st.rerun()
    if st.button("Go to Home"):
        st.session_state.selected_subject = None
        st.rerun()
