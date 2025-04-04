// src/app/history/page.tsx (or wherever your HistoryPage is)
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Calendar, ChevronDown, Filter, Clock } from "lucide-react"; // Added Clock
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { QuizResult } from "@/types/quiz"; // Import the shared type

// Key must match the one used in QuizPage
const LOCAL_STORAGE_KEY = "quizHistory";

export default function HistoryPage() {
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  // const username = "user123"; // No longer needed for local storage history

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      let loadedHistory: QuizResult[] = [];

      if (storedHistory) {
        try {
          loadedHistory = JSON.parse(storedHistory);
          if (!Array.isArray(loadedHistory)) {
            // Basic validation
            console.warn(
              "Invalid history data found in localStorage, resetting."
            );
            loadedHistory = [];
          }
          // Sort by date descending (newest first)
          loadedHistory.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        } catch (parseError) {
          console.error("Error parsing history from localStorage:", parseError);
          loadedHistory = []; // Reset on parse error
        }
      }

      setQuizHistory(loadedHistory);
      setFilteredHistory(loadedHistory); // Initialize filter with all history
      console.log("Loaded quiz history from localStorage:", loadedHistory);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      // Handle potential localStorage access errors (e.g., disabled by user)
      setQuizHistory([]);
      setFilteredHistory([]);
    } finally {
      // Use a small timeout to prevent flash of loading state if data loads instantly
      setTimeout(() => setIsLoading(false), 150);
    }
  }, []); // Empty dependency array: Load history only once on mount

  const handleFilterChange = (topic: string | null) => {
    setFilter(topic);
    if (topic) {
      setFilteredHistory(quizHistory.filter((quiz) => quiz.topic === topic));
    } else {
      setFilteredHistory(quizHistory); // Show all if filter is cleared
    }
  };

  // Use difficulty from QuizResult type
  const getDifficultyColor = (difficulty: "Easy" | "Medium" | "Hard") => {
    switch (
      difficulty.toLowerCase() // Use lowercase for comparison
    ) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300"; // Fallback
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit", // Add time
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper to format time spent
  const formatTimeSpent = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getUniqueTopics = () => {
    // Filter out null/undefined topics before creating the Set
    const topics = quizHistory
      .map((quiz) => quiz.topic)
      .filter((topic) => topic != null) as string[];
    return Array.from(new Set(topics));
  };

  // --- UI Rendering ---
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-4 mb-4">
            <div>
              <CardTitle className="text-2xl">Quiz History</CardTitle>
              <CardDescription>
                View your past quiz results saved locally
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    disabled={isLoading || quizHistory.length === 0}
                  >
                    <Filter className="h-4 w-4" />
                    <span className="truncate max-w-[100px]">
                      {filter ? filter : "All Topics"}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50 ml-auto flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleFilterChange(null)}>
                    All Topics
                  </DropdownMenuItem>
                  {getUniqueTopics().map((topic) => (
                    <DropdownMenuItem
                      key={topic}
                      onClick={() => handleFilterChange(topic)}
                    >
                      {topic}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/quiz">
                <Button size="sm" className="h-8">
                  Take New Quiz
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              // --- Loading Skeletons ---
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-28" /> {/* Slightly larger */}
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-6 w-16 rounded-md" />
                      <Skeleton className="h-10 w-10 rounded-full" />{" "}
                      {/* Slightly smaller score circle */}
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredHistory.length > 0 ? (
              // --- Display History ---
              <div className="space-y-4">
                {filteredHistory.map((quiz) => (
                  <div
                    key={quiz.id} // Use the generated ID
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="mb-3 sm:mb-0 flex-grow mr-4">
                      <h3 className="font-semibold text-lg">
                        {quiz.topic || "General"} Quiz
                      </h3>
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        {formatDate(quiz.date)}
                      </div>
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                        <Clock className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        {formatTimeSpent(quiz.timeSpent)} taken (
                        {quiz.totalQuestions} questions)
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                      </Badge>
                      {/* Display Percentage Score */}
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border">
                        <span className="text-lg font-semibold">
                          {quiz.score}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // --- Empty State ---
              <div className="text-center py-16">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-4 text-slate-400"
                >
                  <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M4.268 11.188a2.014 2.014 0 1 0 2.848 2.848" />
                  <path d="M1.414 14.121a2.014 2.014 0 1 0 2.848 2.848" />
                  <path d="M4.268 17.07a2.014 2.014 0 1 0 2.848 2.848" />
                  <path d="M7.117 14.121a2.014 2.014 0 1 0 2.848 2.848" />
                  <path d="M1 16h4" />
                  <path d="M5 18h4" />
                </svg>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {filter
                    ? `No quizzes found for "${filter}"`
                    : "No Quiz History Yet"}
                </p>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  {filter
                    ? "Try clearing the filter or taking a quiz on this topic."
                    : "Take your first quiz to start building your history!"}
                </p>
                <Button className="mt-2" asChild>
                  <Link href="/quiz">Take a Quiz</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
