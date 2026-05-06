import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import HomePage from './components/HomePage'
import LevelMap from './components/LevelMap'
import AdminPanel from './components/admin/AdminPanel'
import AuthScreen from './components/AuthScreen'
import ProfileScreen from './components/ProfileScreen'
import CoursesPage from './components/courses/CoursesPage'
import ChaptersPage from './components/courses/ChaptersPage'
import TopicsPage from './components/courses/TopicsPage'

type Page = 'home' | 'map' | 'admin' | 'profile' | 'courses' | 'chapters' | 'topics'

interface Course { id: number; title: string; emoji: string; color: string; description: string; chapterCount: number }
interface Chapter { id: number; title: string; description: string; order: number; topicCount: number }
interface Topic { id: number; title: string; description: string; order: number; lessonCount: number }

function App() {
  const { user, loading } = useAuth()
  const [page, setPage] = useState<Page>('home')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  if (loading) return null
  if (!user) return <AuthScreen />

  if (page === 'admin') return <AdminPanel onBack={() => setPage('home')} />
  if (page === 'profile') return <ProfileScreen onBack={() => setPage('home')} />
  if (page === 'map') return <LevelMap onAdmin={() => setPage('admin')} onProfile={() => setPage('profile')} onHome={() => setPage('home')} />

  if (page === 'courses') return (
    <CoursesPage
      onBack={() => setPage('home')}
      onCourse={course => { setSelectedCourse(course); setPage('chapters') }}
    />
  )

  if (page === 'chapters' && selectedCourse) return (
    <ChaptersPage
      course={selectedCourse}
      onBack={() => setPage('courses')}
      onChapter={chapter => { setSelectedChapter(chapter); setPage('topics') }}
    />
  )

  if (page === 'topics' && selectedCourse && selectedChapter) return (
    <TopicsPage
      course={selectedCourse}
      chapter={selectedChapter}
      onBack={() => setPage('chapters')}
      onTopic={topic => { setSelectedTopic(topic); }}
    />
  )

  return (
    <HomePage
      onLevelMap={() => setPage('map')}
      onCourses={() => setPage('courses')}
      onProfile={() => setPage('profile')}
    />
  )
}

export default App