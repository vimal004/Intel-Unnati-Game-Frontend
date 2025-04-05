# **Models for Quiz Generator**

Welcome to the **Models** directory of the **AI-Powered Adaptive Quiz Game**! This section contains the core models and app files responsible for quiz generation, difficulty prediction, and personalized recommendations in the quiz game.

---

## 📂 **Contents**

- **🧠 [Adaptive_Model_Intel_Project.ipynb](Adaptive_Model_Intel_Project.ipynb)**:  
  This Jupyter notebook contains the primary machine learning model for the adaptive quiz system, focusing on personalized quiz question generation based on user input and performance.

- **🔧 [quiz_generator_t5_MS_APP.ipynb](quiz_generator_t5_MS_APP.ipynb)**:  
  This notebook includes the **T5** model fine-tuned to generate quiz questions dynamically from context or passages, tailored specifically for our quiz platform.

- **📝 [quiz_generator_t5_FineTuned_new.ipynb](quiz_generator_t5_FineTuned_new.ipynb)**:  
  A refined version of the **T5** model, fine-tuned with new datasets for more accurate quiz question generation based on user interactions and progress.

- **⚙️ [ms_quiz_app.py](ms_quiz_app.py)**:  
  This script serves as part of the backend for the quiz system. It interacts with the user interface and models for generating and handling quiz questions. It also manages quiz state, user inputs, and transitions between different stages of the quiz.

- **🔄 [quiz.py](quiz.py)**:  
  Contains the core logic for quiz generation and the interaction between the frontend and machine learning models. It also handles user responses, collects performance data, and adjusts quiz difficulty dynamically based on the feedback.

- **🎯 [app.py](app.py)**:  
  The final **Streamlit** app that provides an interactive user interface for quiz-taking. The app is the main interface for students to choose their subject, set quiz parameters, and start the quiz. It integrates the **quiz.py** logic and uses **Streamlit** components to display the quiz dynamically, track progress, and show real-time feedback.

---

## ⚙️ **Purpose of the Models**

The models and scripts in this directory work together to create a **personalized quiz generation** and **adaptive learning system**:

- **🧩 Quiz Generation**:  
  The **T5** model generates dynamic quiz questions from text input, such as passages, topics, or user-provided data. This allows the system to create new questions that are contextually relevant and adaptable to the student’s progress.

- **🎯 Personalized Recommendations**:  
  **SVD** (Singular Value Decomposition) is used to recommend questions that align with the student’s performance and weaknesses. It analyzes previous quiz data and recommends questions that provide a balanced learning challenge.

- **📊 Difficulty Adjustment**:  
  **XGBoost** analyzes performance data such as **correct answers**, **time per question**, and **retries** to predict the ideal difficulty level for future questions. This real-time adjustment helps keep the quiz engaging and effective.

---

## 🚀 **How to Use the Models**

### 1. **Training the Models**:
   - To train the models, run the respective **Jupyter Notebooks** in this directory. The notebooks include:
     - **Adaptive_Model_Intel_Project.ipynb** for adaptive quiz question generation.
     - **quiz_generator_t5_MS_APP.ipynb** and **quiz_generator_t5_FineTuned_new.ipynb** for fine-tuning the **T5** model on quiz generation tasks.
   
   - These notebooks also involve data preprocessing steps, ensuring that the data fed into the models is structured and clean.

### 2. **Model Inference**:
   - Once the models are trained, they can be deployed for inference using **Streamlit** in the **app.py** file.
   - **app.py** runs the frontend UI, integrates with the models, and handles user input (such as responses and time taken) to dynamically adjust quiz content.

---

## 🏃‍♂️ **How to Run the Streamlit App (`app.py`)**

### Step-by-Step Guide:

1. **Install Dependencies**:
   First, ensure you have **Streamlit** and other required dependencies installed. You can do this by running the following in your terminal:

   ```bash
   pip install streamlit
   pip install -r requirements.txt  # If a requirements.txt is provided with additional libraries
   ```

2. **Run the Streamlit App**:
   Navigate to the directory containing the **`app.py`** file and run the following command:

   ```bash
   streamlit run app.py
   ```

3. **Open the App**:
   After running the above command, the Streamlit app will start, and it will display a URL in the terminal (usually something like `http://localhost:8501`).

   Open your web browser and navigate to this URL to start using the quiz game!

4. **Interact with the Quiz**:
   - Choose the subject (Mathematics, Science, etc.).
   - Answer the quiz questions.
   - View your performance and personalized feedback.

---

## 🌱 **Additional Notes**

- The **Streamlit** app (`app.py`) is the main interface for interacting with the models. It handles user inputs, quiz logic, and feedback loops.
- The **T5** model generates dynamic questions, **XGBoost** adjusts difficulty in real-time, and **SVD** helps provide personalized quiz recommendations.
- These models work together to create a **seamless, adaptive learning environment**.

---

For further questions or contributions, please refer to the main repository for detailed guidelines.

Happy learning! 🚀
