"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { QuizTopicSelector } from "@/components/quiz-topic-selector";
import axios from "axios";

export default function QuizPage() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("user123"); // In a real app, this would come from auth
  const [difficulty, setDifficulty] = useState("Easy");
  const [loading, setLoading] = useState(false);

  // Mock quiz questions based on selected topic
  const [quizQuestions, setquizQuestions] = useState([
    {
      id: 1,
      question: `${selectedTopic} Question 1: Lorem ipsum dolor sit amet?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option A",
    },
    {
      id: 2,
      question: `${selectedTopic} Question 2: Consectetur adipiscing elit?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option C",
    },
    {
      id: 3,
      question: `${selectedTopic} Question 3: Sed do eiusmod tempor incididunt?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option B",
    },
    {
      id: 4,
      question: `${selectedTopic} Question 4: Ut labore et dolore magna aliqua?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option D",
    },
    {
      id: 5,
      question: `${selectedTopic} Question 5: Ut enim ad minim veniam?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option A",
    },
  ]);

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
  };

  const getquiz = () => {
    console.log("Fetching quiz content");
    console.log(selectedTopic);
    setLoading(true); // Set loading to true when fetching quiz content

    axios
      .post("https://gemini-backend-uiuz.onrender.com/gemini", {
        prompt: `Generate 5 quiz questions on the topic of ${selectedTopic} at a ${difficulty} level unique and not overused/common. 
      Format the response as a valid JSON array:
      [{"id":1, "question":"...", "options":["A","B","C","D"], "correctAnswer":"..."}] no triple quotes json and stuff just provide the json`,
      })
      .then((res) => {
        console.log("quiz started");

        try {
          console.log("Raw Response:", res.data.response);

          // Ensure `res.data.response` is a string
          let jsonResponse = res.data.response;

          // Remove all occurrences of backticks and "json" (to handle edge cases)
          jsonResponse = jsonResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

          // Now parse the cleaned JSON string
          const parsedData = JSON.parse(jsonResponse);

          // Set the quiz questions state
          setquizQuestions(parsedData);
          setQuizStarted(true);
          setLoading(false); // Set loading to false after fetching quiz content  
        } catch (error) {
          console.error("Error parsing response:", error);
        }
      })

      .catch((err) => console.error("Error fetching quiz:", err));
  };

  const startQuiz = () => {
    getquiz();
    setCurrentQuestion(0);
    setSelectedAnswers({});
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer,
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    Object.keys(selectedAnswers).forEach((questionIndex) => {
      const index = Number.parseInt(questionIndex);
      if (selectedAnswers[index] === quizQuestions[index].correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);

    try {
      // Calculate score
      const score = calculateScore();
      const totalQuestions = quizQuestions.length;
      const percentage = (score / totalQuestions) * 100;

      // 1. Submit quiz data to backend
      const quizData = {
        username,
        topic: selectedTopic,
        score,
        totalQuestions,
        answers: selectedAnswers,
      };

      // Using Axios in a real implementation
      // await axios.post('https://backend-intel-unnati.onrender.com', quizData);

      // 2. Get AI prediction for difficulty
      const performanceData = {
        score: percentage,
        topic: selectedTopic,
        timeSpent: 300, // Mock time spent in seconds
      };

      // Using Axios in a real implementation
      // const predictionResponse = await axios.post(
      //   'https://flask-backend-intel-unnati.onrender.com/predict',
      //   performanceData
      // );
      // const difficulty = predictionResponse.data.difficulty;

      // Mock difficulty prediction
      const difficulty =
        percentage > 80 ? "easy" : percentage > 50 ? "medium" : "hard";

      // 3. Submit performance data
      const performanceSubmitData = {
        username,
        topic: selectedTopic,
        score: percentage,
        difficulty,
        date: new Date().toISOString(),
      };

      // Using Axios in a real implementation
      // await axios.post('https://backend-intel-unnati.onrender.com/quiz/submit', performanceSubmitData);

      // Navigate to results page with data
      router.push(
        `/results?score=${score}&total=${totalQuestions}&difficulty=${difficulty}&topic=${selectedTopic}`
      );
    } catch (error) {
      console.error("Error submitting quiz:", error);
      // Handle error state here
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quizStarted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Start a New Quiz</CardTitle>
              <CardDescription>
                Select a topic to begin your quiz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizTopicSelector
                onSelectTopic={handleTopicSelect}
                selectedTopic={selectedTopic}
              />
            </CardContent>
            <CardFooter>
              <Button
                onClick={startQuiz}
                disabled={!selectedTopic}
                className="w-full"
              >
                {loading ? "Loading your quiz..." : "Start Quiz"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestionData = quizQuestions[currentQuestion];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/quiz"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Exit Quiz
          </Link>
          <div className="text-sm font-medium">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mb-4">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestion + 1) / quizQuestions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
            <CardTitle className="text-xl">
              {currentQuestionData.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswers[currentQuestion] || ""}
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {currentQuestionData.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 rounded-md border p-3 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-grow cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {currentQuestion < quizQuestions.length - 1 ? (
              <Button
                onClick={goToNextQuestion}
                disabled={!selectedAnswers[currentQuestion]}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmitQuiz}
                disabled={!selectedAnswers[currentQuestion] || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Quiz"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="mt-6 flex justify-center">
          <div className="flex space-x-1">
            {quizQuestions.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentQuestion
                    ? "bg-purple-600"
                    : selectedAnswers[index]
                    ? "bg-slate-400"
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
                onClick={() => setCurrentQuestion(index)}
                aria-label={`Go to question ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
