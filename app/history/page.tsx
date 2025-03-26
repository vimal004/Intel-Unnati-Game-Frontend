"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, ChevronDown, Filter } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

type QuizResult = {
  id: string
  topic: string
  score: number
  difficulty: "easy" | "medium" | "hard"
  date: string
}

export default function HistoryPage() {
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([])
  const [filteredHistory, setFilteredHistory] = useState<QuizResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)
  const username = "user123" // In a real app, this would come from auth

  useEffect(() => {
    // Simulate API call to fetch quiz history
    const fetchQuizHistory = async () => {
      setIsLoading(true)
      try {
        // In a real implementation, this would be:
        // const response = await axios.get(`https://backend-intel-unnati.onrender.com/quiz/${username}`);
        // const data = response.data;

        // Mock data for demonstration
        const mockData: QuizResult[] = [
          {
            id: "1",
            topic: "Science",
            score: 85,
            difficulty: "easy",
            date: "2025-03-25T14:30:00Z",
          },
          {
            id: "2",
            topic: "Math",
            score: 65,
            difficulty: "medium",
            date: "2025-03-24T10:15:00Z",
          },
          {
            id: "3",
            topic: "History",
            score: 40,
            difficulty: "hard",
            date: "2025-03-22T16:45:00Z",
          },
          {
            id: "4",
            topic: "Science",
            score: 70,
            difficulty: "medium",
            date: "2025-03-20T09:30:00Z",
          },
          {
            id: "5",
            topic: "Math",
            score: 90,
            difficulty: "easy",
            date: "2025-03-18T13:20:00Z",
          },
        ]

        // Simulate network delay
        setTimeout(() => {
          setQuizHistory(mockData)
          setFilteredHistory(mockData)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching quiz history:", error)
        setIsLoading(false)
      }
    }

    fetchQuizHistory()
  }, [username])

  const handleFilterChange = (topic: string | null) => {
    setFilter(topic)
    if (topic) {
      setFilteredHistory(quizHistory.filter((quiz) => quiz.topic === topic))
    } else {
      setFilteredHistory(quizHistory)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getUniqueTopics = () => {
    return Array.from(new Set(quizHistory.map((quiz) => quiz.topic)))
  }

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
          <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Quiz History</CardTitle>
              <CardDescription>View your past quiz results and performance</CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-4 w-4" />
                    {filter ? filter : "All Topics"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleFilterChange(null)}>All Topics</DropdownMenuItem>
                  {getUniqueTopics().map((topic) => (
                    <DropdownMenuItem key={topic} onClick={() => handleFilterChange(topic)}>
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
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredHistory.length > 0 ? (
              <div className="space-y-4">
                {filteredHistory.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="mb-3 sm:mb-0">
                      <h3 className="font-medium">{quiz.topic} Quiz</h3>
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(quiz.date)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <span className="font-medium">{quiz.score}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">
                  {filter ? `No quizzes found for ${filter}` : "No quiz history found"}
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/quiz">Take Your First Quiz</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

