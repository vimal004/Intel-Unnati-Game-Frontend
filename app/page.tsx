import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Brain, History, Trophy } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            AI-Powered Quiz Game
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Test your knowledge with our adaptive quizzes that use AI to personalize your learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Take a Quiz</CardTitle>
              <CardDescription>Choose from various topics and test your knowledge</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Link href="/quiz">
                <Button className="group">
                  Start Quiz
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Quiz History</CardTitle>
              <CardDescription>View your past quiz results and performance</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Link href="/history">
                <Button variant="outline" className="group">
                  View History
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Performance</CardTitle>
              <CardDescription>Get AI-powered insights on your quiz performance</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Link href="/performance">
                <Button variant="outline" className="group">
                  View Insights
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

