import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './src/pages/login';
import Register from './src/pages/register';
import Courses from './src/pages/courses';
import CourseDetail from './src/pages/courseDetail';

type Page = 'login' | 'register' | 'courses' | 'courseDetail';
type Course = {
  id: string;
  title: string;
  image: any;
  short: string;
  description: string;
}

export default function App() {
  const [page, setPage] = React.useState<Page>('login');
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [currentUser, setCurrentUser] = React.useState<{name:string,email:string} | null>(null);
  const [favorites, setFavorites] = React.useState<string[]>([]);

  // load favorites for current user
  async function loadFavoritesFor(userEmail?: string) {
    try {
      const email = userEmail || currentUser?.email;
      if (!email) return;
      const raw = await AsyncStorage.getItem(`favorites:${email}`);
      const favs = raw ? JSON.parse(raw) : [];
      setFavorites(favs);
    } catch (err) {
      console.log('loadFavorites error', err);
    }
  }

  async function saveFavoritesFor(email: string, favs: string[]) {
    try {
      await AsyncStorage.setItem(`favorites:${email}`, JSON.stringify(favs));
    } catch (err) {
      console.log('saveFavorites error', err);
    }
  }

  function goToCourseDetail(course: Course) {
    setSelectedCourse(course);
    setPage('courseDetail');
  }

  function handleLogout() {
    setCurrentUser(null);
    setFavorites([]);
    setPage('login');
  }

  function handleToggleFavorite(courseId: string) {
    if (!currentUser) return;
    setFavorites(prev => {
      const exists = prev.includes(courseId);
      const next = exists ? prev.filter(id => id !== courseId) : [...prev, courseId];
      saveFavoritesFor(currentUser.email, next);
      return next;
    });
  }

  function handleAuthSuccess(user: {name:string,email:string}) {
    setCurrentUser(user);
    loadFavoritesFor(user.email);
    setPage('courses');
  }

  if (page === 'login') {
    return <Login onNavigateToRegister={() => setPage('register')} onAuthSuccess={handleAuthSuccess} />
  }

  if (page === 'register') {
    return <Register onNavigateToLogin={() => setPage('login')} onAuthSuccess={handleAuthSuccess} />
  }

  if (page === 'courses') {
    return <Courses onBack={() => handleLogout()} onOpenCourse={goToCourseDetail} currentUser={currentUser} favorites={favorites} onToggleFavorite={handleToggleFavorite} onLogout={handleLogout} />
  }

  if (page === 'courseDetail' && selectedCourse) {
    return <CourseDetail course={selectedCourse} onBack={() => setPage('courses')} onToggleFavorite={handleToggleFavorite} favorites={favorites} />
  }

  return null;
}
