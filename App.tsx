import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './src/pages/login';
import Register from './src/pages/register';
import Courses from './src/pages/courses';
import CourseDetail from './src/pages/courseDetail';
import Favorites from './src/pages/favorites';
import Profile from './src/pages/profile';
import { ThemeProvider } from './src/global/ThemeContext';

type Page = 'login' | 'register' | 'courses' | 'courseDetail' | 'profile' | 'favorites';
type Course = {
  id: string;
  title: string;
  image: any;
  short: string;
  description: string;
  duration: string;
  activities: string[];
}

export default function App() {
  const [page, setPage] = React.useState<Page>('login');
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [currentUser, setCurrentUser] = React.useState<{name:string,email:string, avatar?: string} | null>(null);
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

  function handleUpdateUser(updates: Partial<{name:string,email:string,avatar?:string}>) {
    console.log('handleUpdateUser called', updates);
    setCurrentUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      console.log('currentUser updated ->', next);
      return next;
    });
  }

  function handleAuthSuccess(user: {name:string,email:string}) {
    (async () => {
      try {
        const img = await AsyncStorage.getItem(`profileImage:${user.email}`);
        setCurrentUser(img ? { ...user, avatar: img } : user);
      } catch (err) {
        setCurrentUser(user);
      }
      loadFavoritesFor(user.email);
      setPage('courses');
    })();
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
      {page === 'login' && (
        <Login onNavigateToRegister={() => setPage('register')} onAuthSuccess={handleAuthSuccess} />
      )}
      {page === 'register' && (
        <Register onNavigateToLogin={() => setPage('login')} onAuthSuccess={handleAuthSuccess} />
      )}
      {page === 'courses' && (
        <Courses onBack={() => handleLogout()} onOpenCourse={goToCourseDetail} onOpenFavorites={() => setPage('favorites')} onOpenProfile={() => setPage('profile')} currentUser={currentUser} favorites={favorites} onToggleFavorite={handleToggleFavorite} onLogout={handleLogout} />
      )}
      {page === 'courseDetail' && selectedCourse && (
        <CourseDetail course={selectedCourse} onBack={() => setPage('courses')} onToggleFavorite={handleToggleFavorite} favorites={favorites} />
      )}
      {page === 'favorites' && (
        <Favorites onBack={() => setPage('courses')} onOpenCourse={goToCourseDetail} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
      )}
      {page === 'profile' && (
        <Profile user={currentUser} onBack={() => setPage('courses')} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
      )}
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
