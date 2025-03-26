import axios from "axios"

// Base URLs for the APIs
const BACKEND_URL = "https://backend-intel-unnati.onrender.com"
const FLASK_API_URL = "https://flask-backend-intel-unnati.onrender.com"

// Quiz API functions
export async function submitQuizData(quizData: any) {
  try {
    const response = await axios.post(`${BACKEND_URL}`, quizData)
    return response.data
  } catch (error) {
    console.error("Error submitting quiz data:", error)
    throw error
  }
}

export async function predictDifficulty(performanceData: any) {
  try {
    const response = await axios.post(`${FLASK_API_URL}/predict`, performanceData)
    return response.data
  } catch (error) {
    console.error("Error predicting difficulty:", error)
    throw error
  }
}

export async function submitPerformance(performanceData: any) {
  try {
    const response = await axios.post(`${BACKEND_URL}/quiz/submit`, performanceData)
    return response.data
  } catch (error) {
    console.error("Error submitting performance:", error)
    throw error
  }
}

export async function getQuizHistory(username: string) {
  try {
    const response = await axios.get(`${BACKEND_URL}/quiz/${username}`)
    return response.data
  } catch (error) {
    console.error("Error fetching quiz history:", error)
    throw error
  }
}

export async function getPerformanceData(username: string) {
  try {
    const response = await axios.get(`${BACKEND_URL}/performance/${username}`)
    return response.data
  } catch (error) {
    console.error("Error fetching performance data:", error)
    throw error
  }
}

