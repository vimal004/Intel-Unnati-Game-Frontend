import streamlit as st
import random
from datasets import load_dataset

# ✅ Load the datasets dynamically (Cache to prevent repeated loading)
@st.cache_data()
def load_quiz_datasets():
    # ✅ Load Mathematics Dataset
    mathqa_dataset = load_dataset("math_qa", trust_remote_code=True)

    math_questions = []
    for data in mathqa_dataset["train"]:
        context = data["Problem"]
        options = data["options"].split(", ")  # Convert options string to list
        correct_answer = options[ord(data["correct"]) - ord("a")]  # Convert 'a', 'b' -> index
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
        choices = data["choices"]["text"]  # Extract answer choices
        labels = data["choices"]["label"]  # Extract labels (A, B, C, D)
        answer_index = data["answerKey"]

        if answer_index in labels:
            answer_text = choices[labels.index(answer_index)]  # Match label to choice
        else:
            answer_text = "Unknown"  # Handle missing answer key properly

        science_questions.append({
            "question": question,
            "options": choices,
            "answer": answer_text,
            "topic": "Science"
        })

    return math_questions, science_questions

# ✅ Load dataset
math_questions, science_questions = load_quiz_datasets()

# ✅ Function to get a random question
def get_question(topic):
    if topic == "Mathematics":
        return random.choice(math_questions)
    elif topic == "Science":
        return random.choice(science_questions)

# ✅ Streamlit UI starts here
st.title("🧠 Interactive Quiz Generator")

# ✅ Choose subject
subject = st.selectbox("Choose a Subject:", ["Mathematics", "Science"])

# ✅ Reset question if subject is changed
if "selected_subject" not in st.session_state or st.session_state.selected_subject != subject:
    st.session_state.selected_subject = subject
    st.session_state.current_question = get_question(subject)
    st.session_state.score = 0  # Reset Score when subject changes
    st.session_state.total_attempts = 0

# ✅ Display the question
question_data = st.session_state.current_question
st.subheader(f"**Question:** {question_data['question']}")

# ✅ Display options as radio buttons
options = question_data["options"]
correct_answer = question_data["answer"]
user_choice = st.radio("Choose an option:", options, key=question_data["question"])  # Unique key for UI refresh

# ✅ Check Answer Button
if st.button("Submit Answer"):
    st.session_state.total_attempts += 1
    if user_choice == correct_answer:
        st.success("✅ Correct!")
        st.session_state.score += 1
    else:
        st.error(f"❌ Incorrect! The correct answer was: {correct_answer}")

# ✅ Display Score
st.write(f"**Score:** {st.session_state.score} / {st.session_state.total_attempts}")

# ✅ Next Question Button
if st.button("Next Question"):
    st.session_state.current_question = get_question(subject)
    st.rerun()
