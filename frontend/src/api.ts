const BASE_URL = 'http://localhost:5184'

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

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

//Admin API
export async function adminGetLessons() {
  const res = await fetch(`${BASE_URL}/admin/lessons`, { headers: authHeaders() })
  return res.json()
}

export async function adminCreateLesson(data: any) {
  const res = await fetch(`${BASE_URL}/admin/lessons`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminUpdateLesson(id: number, data: any) {
  const res = await fetch(`${BASE_URL}/admin/lessons/${id}`, {
    method: 'PUT', headers: authHeaders(), body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminDeleteLesson(id: number) {
  await fetch(`${BASE_URL}/admin/lessons/${id}`, { method: 'DELETE', headers: authHeaders() })
}

export async function adminGetQuestions(lessonId: number) {
  const res = await fetch(`${BASE_URL}/admin/lessons/${lessonId}/questions`, { headers: authHeaders() })
  return res.json()
}

export async function adminCreateQuestion(lessonId: number, data: any) {
  const res = await fetch(`${BASE_URL}/admin/lessons/${lessonId}/questions`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminUpdateQuestion(id: number, data: any) {
  const res = await fetch(`${BASE_URL}/admin/questions/${id}`, {
    method: 'PUT', headers: authHeaders(), body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminDeleteQuestion(id: number) {
  await fetch(`${BASE_URL}/admin/questions/${id}`, { method: 'DELETE', headers: authHeaders() })
}

export async function adminGetCourses() {
  const res = await fetch(`${BASE_URL}/admin/courses`, { headers: authHeaders() })
  return res.json()
}

export async function adminCreateCourse(data: any) {
  const res = await fetch(`${BASE_URL}/admin/courses`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminUpdateCourse(id: number, data: any) {
  const res = await fetch(`${BASE_URL}/admin/courses/${id}`, {
    method: 'PUT', headers: authHeaders(), body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminDeleteCourse(id: number) {
  await fetch(`${BASE_URL}/admin/courses/${id}`, { method: 'DELETE', headers: authHeaders() })
}

export async function adminGetChapters(courseId: number) {
  const res = await fetch(`${BASE_URL}/admin/courses/${courseId}/chapters`, { headers: authHeaders() })
  return res.json()
}

export async function adminCreateChapter(courseId: number, data: any) {
  const res = await fetch(`${BASE_URL}/admin/courses/${courseId}/chapters`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminUpdateChapter(id: number, data: any) {
  const res = await fetch(`${BASE_URL}/admin/chapters/${id}`, {
    method: 'PUT', headers: authHeaders(), body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminDeleteChapter(id: number) {
  await fetch(`${BASE_URL}/admin/chapters/${id}`, { method: 'DELETE', headers: authHeaders() })
}

export async function adminGetTopics(chapterId: number) {
  const res = await fetch(`${BASE_URL}/admin/chapters/${chapterId}/topics`, { headers: authHeaders() })
  return res.json()
}

export async function adminCreateTopic(chapterId: number, data: any) {
  const res = await fetch(`${BASE_URL}/admin/chapters/${chapterId}/topics`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminUpdateTopic(id: number, data: any) {
  const res = await fetch(`${BASE_URL}/admin/topics/${id}`, {
    method: 'PUT', headers: authHeaders(), body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminDeleteTopic(id: number) {
  await fetch(`${BASE_URL}/admin/topics/${id}`, { method: 'DELETE', headers: authHeaders() })
}

export async function adminGetTopicLessons(topicId: number) {
  const res = await fetch(`${BASE_URL}/admin/topics/${topicId}/lessons`, { headers: authHeaders() })
  return res.json()
}

export async function adminCreateTopicLesson(topicId: number, data: any) {
  const res = await fetch(`${BASE_URL}/admin/topics/${topicId}/lessons`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminUpdateTopicLesson(id: number, data: any) {
  const res = await fetch(`${BASE_URL}/admin/lessons/${id}`, {
    method: 'PUT', headers: authHeaders(), body: JSON.stringify(data)
  })
  return res.json()
}

export async function adminDeleteTopicLesson(id: number) {
  await fetch(`${BASE_URL}/admin/lessons/${id}`, { method: 'DELETE', headers: authHeaders() })
}

export async function adminGetUsers() {
  const res = await fetch(`${BASE_URL}/admin/users`, { headers: authHeaders() })
  return res.json()
}

export async function adminUpdateUserRole(id: number, role: string) {
  const res = await fetch(`${BASE_URL}/admin/users/${id}/role`, {
    method: 'PUT', headers: authHeaders(), body: JSON.stringify({ role })
  })
  return res.json()
}

export async function adminDeleteUser(id: number) {
  await fetch(`${BASE_URL}/admin/users/${id}`, { method: 'DELETE', headers: authHeaders() })
}

export async function saveTopicLessonProgress(userId: number, lessonId: number, xpEarned: number) {
  const res = await fetch(`${BASE_URL}/progress/topic-lesson`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, lessonId, xpEarned })
  })
  return res.json()
}

export async function getCompletedLessons(userId: number) {
  const res = await fetch(`${BASE_URL}/progress/${userId}/completed`)
  return res.json()
}