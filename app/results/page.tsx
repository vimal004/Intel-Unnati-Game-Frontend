"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Award, Brain, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const score = Number.parseInt(searchParams.get("score") || "0")
  const total = Number.parseInt(searchParams.get("total") || "1")
  const difficulty = searchParams.get("difficulty") || "medium"
  const topic = searchParams.get("topic") || "General Knowledge"

  const [progress, setProgress] = useState(0)
  const percentage = Math.round((score / total) * 100)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 100)
    return () => clearTimeout(timer)
  }, [percentage])

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "hard":
        return "text-red-500"
      default:
        return "text-blue-500"
    }
  }

  const getPerformanceMessage = () => {
    if (percentage >= 80) {
      return "Excellent work! You've mastered this topic."
    } else if (percentage >= 60) {
      return "Good job! You have a solid understanding of this topic."
    } else if (percentage >= 40) {
      return "Not bad! With a bit more practice, you'll improve."
    } else {
      return "Keep practicing! This topic needs more of your attention."
    }
  }

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

        <Card className="overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-2xl">Quiz Results</CardTitle>
            <CardDescription>{topic} Quiz</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">
                {score}/{total}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Questions answered correctly</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Score</span>
                <span className="font-medium">{percentage}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Brain className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">AI Difficulty Assessment</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Based on your performance, this quiz was{" "}
                    <span className={`font-medium ${getDifficultyColor()}`}>{difficulty}</span> for you.
                  </p>
                  <p className="text-sm">{getPerformanceMessage()}</p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/quiz">Take Another Quiz</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/history">
                View Quiz History
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

