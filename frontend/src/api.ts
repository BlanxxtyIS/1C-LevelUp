const BASE_URL = 'http://localhost:5184'

export async function getOrCreateTestUser() {
  const res = await fetch(`${BASE_URL}/users/test`, { method: 'POST' })
  return res.json()
}

export async function getLessons(userId: number) {
  const res = await fetch(`${BASE_URL}/lessons/${userId}`)
  return res.json()
}

export async function getLessonQuestions(lessonId: number) {
  const res = await fetch(`${BASE_URL}/lessons/${lessonId}/questions`)
  return res.json()
}

export async function saveProgress(userId: number, lessonId: number, xpEarned: number) {
  const res = await fetch(`${BASE_URL}/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, lessonId, xpEarned })
  })
  return res.json()
}

export async function getUserProfile(userId: number) {
  const res = await fetch(`${BASE_URL}/users/${userId}`)
  return res.json()
}

//Admin API
export async function adminGetLessons() {
    const res = await fetch(`${BASE_URL}/admin/lessons`)
    return res.json()
}

export async function adminCreateLesson(data: {
  title: string; description: string; xpReward: number; order: number; topic: string
}) {
  const res = await fetch(`${BASE_URL}/admin/lessons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminUpdateLesson(id: number, data: {
  title: string; description: string; xpReward: number; order: number; topic: string
}) {
  const res = await fetch(`${BASE_URL}/admin/lessons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminDeleteLesson(id: number) {
  await fetch(`${BASE_URL}/admin/lessons/${id}`, { method: 'DELETE' })
}

export async function adminGetQuestions(lessonId: number) {
  const res = await fetch(`${BASE_URL}/admin/lessons/${lessonId}/questions`)
  return res.json()
}

export async function adminCreateQuestion(lessonId: number, data: {
  text: string; options: string[]; correctIndex: number; explanation: string
}) {
  const res = await fetch(`${BASE_URL}/admin/lessons/${lessonId}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminUpdateQuestion(id: number, data: {
  text: string; options: string[]; correctIndex: number; explanation: string
}) {
  const res = await fetch(`${BASE_URL}/admin/questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminDeleteQuestion(id: number) {
  await fetch(`${BASE_URL}/admin/questions/${id}`, { method: 'DELETE' })
}

// Auth API
export async function register(username: string, email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  })
  return res.json()
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return res.json()
}

export async function getMe(token: string) {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) return null
  return res.json()
}

// Courses API
export async function getCourses() {
  const res = await fetch(`${BASE_URL}/courses`)
  return res.json()
}

export async function getCourseChapters(courseId: number) {
  const res = await fetch(`${BASE_URL}/courses/${courseId}/chapters`)
  return res.json()
}

export async function getChapterTopics(chapterId: number) {
  const res = await fetch(`${BASE_URL}/chapters/${chapterId}/topics`)
  return res.json()
}

export async function getTopicLessons(topicId: number) {
  const res = await fetch(`${BASE_URL}/topics/${topicId}/lessons`)
  return res.json()
}

// Admin Courses API
export async function adminGetCourses() {
  const res = await fetch(`${BASE_URL}/admin/courses`)
  return res.json()
}

export async function adminCreateCourse(data: { title: string; description: string; emoji: string; color: string; order: number }) {
  const res = await fetch(`${BASE_URL}/admin/courses`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminUpdateCourse(id: number, data: { title: string; description: string; emoji: string; color: string; order: number }) {
  const res = await fetch(`${BASE_URL}/admin/courses/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminDeleteCourse(id: number) {
  await fetch(`${BASE_URL}/admin/courses/${id}`, { method: 'DELETE' })
}

export async function adminGetChapters(courseId: number) {
  const res = await fetch(`${BASE_URL}/admin/courses/${courseId}/chapters`)
  return res.json()
}

export async function adminCreateChapter(courseId: number, data: { title: string; description: string; order: number }) {
  const res = await fetch(`${BASE_URL}/admin/courses/${courseId}/chapters`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminUpdateChapter(id: number, data: { title: string; description: string; order: number }) {
  const res = await fetch(`${BASE_URL}/admin/chapters/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminDeleteChapter(id: number) {
  await fetch(`${BASE_URL}/admin/chapters/${id}`, { method: 'DELETE' })
}

export async function adminGetTopics(chapterId: number) {
  const res = await fetch(`${BASE_URL}/admin/chapters/${chapterId}/topics`)
  return res.json()
}

export async function adminCreateTopic(chapterId: number, data: { title: string; description: string; order: number }) {
  const res = await fetch(`${BASE_URL}/admin/chapters/${chapterId}/topics`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminUpdateTopic(id: number, data: { title: string; description: string; order: number }) {
  const res = await fetch(`${BASE_URL}/admin/topics/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminDeleteTopic(id: number) {
  await fetch(`${BASE_URL}/admin/topics/${id}`, { method: 'DELETE' })
}

export async function adminGetTopicLessons(topicId: number) {
  const res = await fetch(`${BASE_URL}/admin/topics/${topicId}/lessons`)
  return res.json()
}

export async function adminCreateTopicLesson(topicId: number, data: { title: string; description: string; xpReward: number; order: number }) {
  const res = await fetch(`${BASE_URL}/admin/topics/${topicId}/lessons`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminUpdateTopicLesson(id: number, data: { title: string; description: string; xpReward: number; order: number }) {
  const res = await fetch(`${BASE_URL}/admin/lessons/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminDeleteTopicLesson(id: number) {
  await fetch(`${BASE_URL}/admin/lessons/${id}`, { method: 'DELETE' })
}