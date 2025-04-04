"use client";
import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = "AIzaSyBqEPj8Y1bY5CPwwcw24KqnbPZL9D88K-Y"; // Replace with your actual key or use environment variables
import { useState, useEffect, useRef } from "react"; // Import useEffect and useRef
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
import { ArrowLeft, Loader2, Lightbulb, TimerIcon } from "lucide-react"; // Import Lightbulb and TimerIcon icon
import Link from "next/link";
import { QuizTopicSelector } from "@/components/quiz-topic-selector";
import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Import Popover components

// --- Timer Configuration ---
const QUIZ_DURATION_SECONDS = 300; // 5 minutes
const LOCAL_STORAGE_KEY = "quizHistory";

// --- Helper function to format time ---
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

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
  const [quizQuestions, setquizQuestions] = useState<any[]>([]); // Initialize as empty array

  // --- Timer State ---
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to hold interval ID

  // --- Remove Mock Questions and API call outside component ---
  // The initial state for quizQuestions is now an empty array
  // The API call logic is moved inside getquiz

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
  };

  // --- Timer Effect ---
  useEffect(() => {
    if (quizStarted && quizQuestions.length > 0) {
      // Only start the timer if quiz has started AND questions are loaded
      setTimeLeft(QUIZ_DURATION_SECONDS); // Reset timer when quiz starts

      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerIntervalRef.current!);
            timerIntervalRef.current = null;
            // Time's up! Auto-submit. Check if already submitting.
            if (!isSubmitting) {
              console.log("Time expired, submitting quiz...");
              handleSubmitQuiz(true); // Pass a flag indicating auto-submit due to time
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      // Cleanup function
      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
          console.log("Timer cleared on cleanup");
        }
      };
    } else {
      // Ensure timer stops if quiz hasn't started or questions aren't loaded
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
        console.log("Timer cleared because quiz stopped or no questions");
      }
    }
    // Dependencies: Run when quizStarted changes or when questions are loaded
  }, [quizStarted, quizQuestions.length, isSubmitting]);

  const getquiz = () => {
    if (!selectedTopic) return; // Don't fetch if no topic selected

    console.log(
      `Workspaceing quiz content for topic: ${selectedTopic}, difficulty: ${difficulty}`
    );
    setLoading(true); // Set loading to true when fetching quiz content
    setQuizStarted(false); // Ensure quiz isn't marked as started until fetch succeeds

    // Clear previous timer if any (e.g., if user retries)
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    axios
      .post("https://gemini-backend-uiuz.onrender.com/gemini", {
        // Consider using environment variables for the URL
        prompt: `Generate 5 unique and not overused/common quiz questions on the topic of ${selectedTopic} at a ${difficulty} level.
        Format the response as a valid JSON array. Each object MUST have "id", "question", "options" (array of 4 strings), "correctAnswer" (string matching one option), and "hints" (string).
        Example format: [{"id":1, "question":"...", "options":["A","B","C","D"], "correctAnswer":"B", "hints":"..."}]
        Provide ONLY the JSON array, no introductory text, no markdown code blocks (\`\`\`json), just the raw array.`,
      })
      .then((res) => {
        console.log("Raw Response Data:", res.data); // Log the whole response data

        // Access the response string correctly based on backend structure
        // Adjust this line if your backend sends the string in a different property (e.g., res.data.quizData)
        let jsonResponse =
          typeof res.data === "string"
            ? res.data
            : res.data.response || JSON.stringify(res.data);

        if (!jsonResponse || typeof jsonResponse !== "string") {
          throw new Error("Invalid response format received from backend.");
        }

        console.log("Raw JSON String:", jsonResponse);

        // Clean potential markdown formatting (though the prompt requests not to include it)
        jsonResponse = jsonResponse
          .replace(/^```json\s*/, "") // Remove starting ```json
          .replace(/```$/, "") // Remove ending ```
          .trim();

        try {
          const parsedData = JSON.parse(jsonResponse);

          // --- Data Validation ---
          if (!Array.isArray(parsedData) || parsedData.length === 0) {
            throw new Error("Parsed data is not a valid non-empty array.");
          }
          // Add more checks if needed (e.g., check if each question has the required fields)
          const isValid = parsedData.every(
            (q) =>
              q.id &&
              q.question &&
              Array.isArray(q.options) &&
              q.correctAnswer &&
              q.hints !== undefined
          );
          if (!isValid) {
            throw new Error(
              "One or more questions in the parsed data have missing fields."
            );
          }

          console.log("Parsed Quiz Data:", parsedData);
          setquizQuestions(parsedData);
          setQuizStarted(true); // Set quiz started *after* successfully getting questions
          setCurrentQuestion(0);
          setSelectedAnswers({});
          setTimeLeft(QUIZ_DURATION_SECONDS); // Reset timer state visually
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError);
          console.error("Problematic JSON string:", jsonResponse); // Log the string that failed parsing
          alert(
            "Failed to load quiz questions due to invalid format. Please try again."
          );
          setQuizStarted(false); // Ensure quiz doesn't start if parsing fails
          setquizQuestions([]); // Clear potentially bad data
        }
      })
      .catch((err) => {
        console.error("Error fetching quiz:", err);
        alert(
          `Failed to fetch quiz questions. ${
            err.message || ""
          } Please check the console for details and try again.`
        );
        setQuizStarted(false);
        setquizQuestions([]);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after fetching or error
      });
  };

  // StartQuiz now only calls getquiz, the rest is handled by getquiz's success path
  const startQuiz = () => {
    getquiz();
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
    quizQuestions.forEach((question, index) => {
      // Ensure comparison is robust (e.g., trim whitespace if necessary)
      if (selectedAnswers[index]?.trim() === question.correctAnswer?.trim()) {
        score++;
      }
    });
    return score;
  };

  // Modified handleSubmitQuiz to accept an optional flag and calculate timeSpent
   const handleSubmitQuiz = (timedOut = false) => {
     // Check submitting state at the very beginning
     if (isSubmitting) {
       console.log("Submission already in progress, exiting.");
       return;
     }

     console.log("Setting isSubmitting to true");
     setIsSubmitting(true); // Set submitting state

     // Stop the timer immediately
     if (timerIntervalRef.current) {
       clearInterval(timerIntervalRef.current);
       timerIntervalRef.current = null;
       console.log("Timer cleared on submit");
     }

     const timeSpent = QUIZ_DURATION_SECONDS - timeLeft;
     const scoreCount = calculateScore();
     const totalQuestions = quizQuestions.length;
     const percentage =
       totalQuestions > 0 ? Math.round((scoreCount / totalQuestions) * 100) : 0; // Calculate percentage score

     console.log(
       `Quiz submitted. Timed out: ${timedOut}, Score: ${scoreCount}/${totalQuestions} (${percentage}%), Time spent: ${timeSpent}s`
     );

     // --- Save to Local Storage ---
     try {
       const newResult: QuizResult = {
         id: Date.now().toString(), // Simple unique ID
         topic: selectedTopic,
         score: percentage, // Store percentage
         difficulty: difficulty, // Use the state value directly
         totalQuestions: totalQuestions,
         timeSpent: timeSpent,
         date: new Date().toISOString(), // Standard ISO format
       };

       // Get existing history or initialize empty array
       const existingHistoryString = localStorage.getItem(LOCAL_STORAGE_KEY);
       let history: QuizResult[] = [];
       if (existingHistoryString) {
         try {
           history = JSON.parse(existingHistoryString);
           if (!Array.isArray(history)) {
             // Basic validation
             console.warn(
               "Invalid history data found in localStorage, resetting."
             );
             history = [];
           }
         } catch (parseError) {
           console.error(
             "Error parsing history from localStorage:",
             parseError
           );
           history = []; // Reset history if parsing fails
         }
       }

       // Add the new result and save back
       history.push(newResult);
       localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
       console.log("Quiz result saved to localStorage:", newResult);
     } catch (storageError) {
       console.error("Error saving quiz result to localStorage:", storageError);
       // Optionally inform the user that history couldn't be saved
       alert("Could not save quiz result to history due to a storage error.");
     } finally {
       // --- Navigation ---
       // Navigate to results page, passing necessary info
       router.push(
         `/results?score=${scoreCount}&total=${totalQuestions}&difficulty=${difficulty}&topic=${selectedTopic}&timeSpent=${timeSpent}`
       );
       // Note: We don't set isSubmitting back to false here because we are navigating away.
       // If you were *not* navigating, you would reset it here.
     }
   };

  // --- UI Rendering ---

  // Selection Screen
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
                Select a topic and difficulty to begin your quiz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <QuizTopicSelector
                onSelectTopic={handleTopicSelect}
                selectedTopic={selectedTopic}
              />
              <div>
                <Label htmlFor="difficulty">Choose your difficulty level</Label>
                <RadioGroup
                  id="difficulty"
                  value={difficulty}
                  onValueChange={setDifficulty} // Update difficulty state
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Easy" id="easy" />
                    <Label htmlFor="easy">Easy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Hard" id="hard" />
                    <Label htmlFor="hard">Hard</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={startQuiz}
                disabled={!selectedTopic || loading} // Disable if loading or no topic
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Quiz...
                  </>
                ) : (
                  "Start Quiz"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Loading state after clicking start but before questions arrive
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        <span className="ml-4 text-xl">Generating your quiz...</span>
      </div>
    );
  }

  // Error state if questions failed to load
  if (!loading && quizQuestions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-red-600 mb-4">
            Failed to load quiz questions. Please try selecting the topic again.
          </p>
          <Button onClick={() => setQuizStarted(false)}>Go Back</Button>{" "}
          {/* Allow user to go back */}
        </div>
      </div>
    );
  }

  // Quiz Active Screen
  const currentQuestionData = quizQuestions[currentQuestion];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          {/* Consider replacing Link with a button that resets state */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (timerIntervalRef.current)
                clearInterval(timerIntervalRef.current);
              setQuizStarted(false); // Go back to topic selection
              setquizQuestions([]); // Clear questions
            }}
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Exit Quiz
          </Button>
          {/* --- Timer Display --- */}
          <div className="flex items-center text-sm font-medium bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
            <TimerIcon className="mr-2 h-4 w-4 text-purple-600" />
            Time Left: {formatTime(timeLeft)}
          </div>
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
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl mr-4">
                {" "}
                {/* Added margin */}
                {currentQuestionData.question}
              </CardTitle>
              {/* Only show Popover if hints exist */}
              {currentQuestionData.hints && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0"
                    >
                      <Lightbulb className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm font-semibold mb-2">Hint:</p>
                    {currentQuestionData.hints}
                  </PopoverContent>
                </Popover>
              )}
            </div>
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
                  className={`flex items-center space-x-3 rounded-md border p-3 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 has-[input:checked]:border-purple-500 has-[input:checked]:bg-purple-50 dark:has-[input:checked]:bg-purple-900/30`} // Highlight selected
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-grow cursor-pointer text-sm" // Ensure label is clickable and text size is consistent
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
              disabled={currentQuestion === 0 || isSubmitting} // Disable if submitting
            >
              Previous
            </Button>

            {currentQuestion < quizQuestions.length - 1 ? (
              <Button
                onClick={goToNextQuestion}
                disabled={!selectedAnswers[currentQuestion] || isSubmitting} // Disable if submitting
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={() => handleSubmitQuiz()} // Call without flag for manual submit
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

        {/* Question Navigation Dots */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-1">
            {quizQuestions.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentQuestion
                    ? "bg-purple-600 scale-110" // Highlight current question
                    : selectedAnswers[index]
                    ? "bg-slate-400 hover:bg-slate-500" // Answered
                    : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600" // Unanswered
                }`}
                // Only allow jumping if not submitting
                onClick={() => !isSubmitting && setCurrentQuestion(index)}
                aria-label={`Go to question ${index + 1}`}
                disabled={isSubmitting} // Disable during submission
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
