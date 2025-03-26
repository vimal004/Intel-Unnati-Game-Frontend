"use client"
import { Check } from "lucide-react"

type TopicSelectorProps = {
  onSelectTopic: (topic: string) => void
  selectedTopic: string | null
}

type Topic = {
  id: string
  name: string
  icon: string
  description: string
}

export function QuizTopicSelector({ onSelectTopic, selectedTopic }: TopicSelectorProps) {
  const topics: Topic[] = [
    {
      id: "science",
      name: "Science",
      icon: "🔬",
      description: "Physics, Chemistry, Biology and more",
    },
    {
      id: "math",
      name: "Mathematics",
      icon: "🧮",
      description: "Algebra, Geometry, Calculus and more",
    },
    {
      id: "history",
      name: "History",
      icon: "🏛️",
      description: "World History, Ancient Civilizations and more",
    },
    {
      id: "geography",
      name: "Geography",
      icon: "🌍",
      description: "Countries, Capitals, Landforms and more",
    },
    {
      id: "literature",
      name: "Literature",
      icon: "📚",
      description: "Books, Authors, Literary Movements and more",
    },
    {
      id: "technology",
      name: "Technology",
      icon: "💻",
      description: "Computers, Programming, AI and more",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {topics.map((topic) => (
        <div
          key={topic.id}
          className={`
            relative p-4 rounded-lg border-2 cursor-pointer transition-all
            ${
              selectedTopic === topic.name
                ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
            }
          `}
          onClick={() => onSelectTopic(topic.name)}
        >
          {selectedTopic === topic.name && (
            <div className="absolute top-2 right-2 h-5 w-5 bg-purple-500 rounded-full flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="text-2xl">{topic.icon}</div>
            <div>
              <h3 className="font-medium">{topic.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{topic.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

