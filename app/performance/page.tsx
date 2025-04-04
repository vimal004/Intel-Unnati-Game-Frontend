// src/app/performance/page.tsx
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
import { ArrowLeft, BarChart3, Brain, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { QuizResult } from "@/types/quiz"; // Import the shared type

type PerformanceData = {
  topic: string;
  scores: number[];
  averageScore: number;
  improvement: number;
  mostCommonDifficulty: string;
};

// Key must match the one used in QuizPage
const LOCAL_STORAGE_KEY = "quizHistory";

export default function PerformancePage() {
  const [performanceData, setPerformanceData] = useState<
    Record<string, PerformanceData>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  // const username = "user123"; // In a real app, this would come from auth
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      let loadedHistory: QuizResult[] = [];

      if (storedHistory) {
        try {
          loadedHistory = JSON.parse(storedHistory);
          if (!Array.isArray(loadedHistory)) {
            console.warn(
              "Invalid history data found in localStorage, resetting."
            );
            loadedHistory = [];
          }
        } catch (parseError) {
          console.error("Error parsing history from localStorage:", parseError);
          loadedHistory = [];
        }
      }
      setQuizHistory(loadedHistory);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      setQuizHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && quizHistory.length > 0) {
      const calculatedPerformance: Record<string, PerformanceData> = {};

      // Group scores by topic
      const scoresByTopic: Record<string, number[]> = {};
      const difficultiesByTopic: Record<
        string,
        ("Easy" | "Medium" | "Hard")[]
      > = {};

      quizHistory.forEach((result) => {
        if (result.topic) {
          if (!scoresByTopic[result.topic]) {
            scoresByTopic[result.topic] = [];
          }
          scoresByTopic[result.topic].push(result.score);

          if (!difficultiesByTopic[result.topic]) {
            difficultiesByTopic[result.topic] = [];
          }
          difficultiesByTopic[result.topic].push(result.difficulty);
        }
      });

      for (const topic in scoresByTopic) {
        const scores = scoresByTopic[topic];
        const averageScore =
          scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const improvement =
          scores.length > 1 ? scores[scores.length - 1] - scores[0] : 0;

        const difficulties = difficultiesByTopic[topic];
        const difficultyCounts: Record<string, number> = {
          Easy: 0,
          Medium: 0,
          Hard: 0,
        };
        difficulties.forEach((diff) => {
          difficultyCounts[diff]++;
        });

        let mostCommonDifficulty: "easy" | "medium" | "hard" = "medium";
        let maxCount = 0;
        for (const diff in difficultyCounts) {
          if (difficultyCounts[diff] > maxCount) {
            maxCount = difficultyCounts[diff];
            mostCommonDifficulty = diff.toLowerCase() as
              | "easy"
              | "medium"
              | "hard";
          }
        }

        calculatedPerformance[topic] = {
          topic,
          scores,
          averageScore,
          improvement,
          mostCommonDifficulty,
        };
      }

      setPerformanceData(calculatedPerformance);
    }
  }, [isLoading, quizHistory]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "hard":
        return "text-red-500";
      default:
        return "text-blue-500";
    }
  };

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
          <CardHeader>
            <CardTitle className="text-2xl">Performance Insights</CardTitle>
            <CardDescription>
              AI-powered analysis of your quiz performance
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
              </div>
            ) : Object.keys(performanceData).length > 0 ? (
              <Tabs defaultValue={Object.keys(performanceData)[0]}>
                <TabsList className="grid grid-cols-3 mb-8">
                  {Object.keys(performanceData).map((topic) => (
                    <TabsTrigger key={topic} value={topic}>
                      {topic}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(performanceData).map(([topic, data]) => (
                  <TabsContent key={topic} value={topic} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Average Score
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">
                            {data.averageScore.toFixed(1)}%
                          </div>
                          <Progress
                            value={data.averageScore}
                            className="h-2 mt-2"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Improvement
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center">
                          <div className="text-3xl font-bold">
                            {data.improvement}%
                          </div>
                          <TrendingUp className="ml-2 h-5 w-5 text-green-500" />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Difficulty Level
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">
                            <span
                              className={getDifficultyColor(
                                data.mostCommonDifficulty
                              )}
                            >
                              {data.mostCommonDifficulty}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Score Progression
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 flex items-end justify-between gap-2">
                          {data.scores.map((score, index) => (
                            <div
                              key={index}
                              className="relative flex flex-col items-center flex-1"
                            >
                              <div
                                className="w-full bg-purple-500 rounded-t-sm transition-all duration-500"
                                style={{ height: `${score}%` }}
                                title={`Quiz ${index + 1}: ${score}%`} // Added tooltip here
                              ></div>
                              <span className="text-xs mt-2">
                                Quiz {index + 1}
                              </span>
                              <span className="text-xs font-medium">
                                {score}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          AI Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-start space-x-3">
                          <Brain className="w-5 h-5 text-purple-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                              Based on your performance in {topic}, here are
                              some personalized recommendations:
                            </p>
                            <ul className="space-y-2 text-sm">
                              {data.averageScore < 60 ? (
                                <>
                                  <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>
                                      Focus on building foundational knowledge
                                      in {topic} before advancing to more
                                      complex topics.
                                    </span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>
                                      Consider reviewing basic concepts and
                                      taking more beginner-level quizzes.
                                    </span>
                                  </li>
                                </>
                              ) : data.averageScore < 80 ? (
                                <>
                                  <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>
                                      You're making good progress! Try to focus
                                      on specific areas where you scored lower.
                                    </span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>
                                      Consider taking more quizzes at the{" "}
                                      {data.mostCommonDifficulty} difficulty
                                      level to solidify your knowledge.
                                    </span>
                                  </li>
                                </>
                              ) : (
                                <>
                                  <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>
                                      Excellent work! You're performing very
                                      well in {topic}.
                                    </span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>
                                      Consider challenging yourself with more
                                      advanced topics or higher difficulty
                                      quizzes.
                                    </span>
                                  </li>
                                </>
                              )}
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>
                                  Your improvement of {data.improvement}% shows
                                  your dedication is paying off!
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No performance data yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  Take some quizzes to see your performance insights
                </p>
                <Button asChild>
                  <Link href="/quiz">Take Your First Quiz</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
