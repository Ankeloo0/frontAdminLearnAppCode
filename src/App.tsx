import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Users from './pages/Users/Users'
import Subjects from './pages/Subjects/Subjects'
import Topics from './pages/Topics/Topics'
import TopicsSubject from './pages/Topics/TopicsSubject'
import Subtopics from './pages/Topics/SubTopics'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path='/' element={<Login />} />

        {/* Ruta protegida */}
        <Route
          path='/home'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path='/users'
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path='/subjects'
          element={
            <ProtectedRoute>
              <Subjects />
            </ProtectedRoute>
          }
        />
        <Route
          path='/topics'
          element={
            <ProtectedRoute>
              <Topics />
            </ProtectedRoute>
          }
        />
        <Route
          path='/topics/:id'
          element={
            <ProtectedRoute>
              <TopicsSubject />
            </ProtectedRoute>
          }
        />
        <Route
          path='/subtopics/:topicId'
          element={
            <ProtectedRoute>
              <Subtopics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App