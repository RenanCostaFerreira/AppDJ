import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Welcome from './src/pages/welcome';
import Login from './src/pages/login';
import Register from './src/pages/register';
import { User } from './src/types/user';
import Courses from './src/pages/courses';
import CourseDetail from './src/pages/courseDetail';
import Favorites from './src/pages/favorites';
import Profile from './src/pages/profile';
import Discover from './src/pages/discover';
import Admin from './src/pages/admin';
import { ThemeProvider } from './src/global/ThemeContext';
import { Alert, Platform } from 'react-native';
// removed duplicate stray import
type Page = 'login' | 'loginForm' | 'register' | 'courses' | 'courseDetail' | 'profile' | 'favorites' | 'discover' | 'admin';
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
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [registerRole, setRegisterRole] = React.useState<'funcionario'|'responsavel'|'aluno' | undefined>(undefined);
  const [classesVersion, setClassesVersion] = React.useState(0);

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

  function handleUpdateUser(updates: Partial<User>) {
    console.log('handleUpdateUser called', updates);
    setCurrentUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      console.log('currentUser updated ->', next);
      return next;
    });
    // persist changes into AsyncStorage users array
    (async () => {
      try {
        const usersRaw = await AsyncStorage.getItem('users');
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        const oldEmail = currentUser?.email;
        const matchEmail = updates.email || oldEmail;
        if (matchEmail) {
          const idx = users.findIndex((u:any) => u.email === matchEmail);
          if (idx >= 0) {
            users[idx] = { ...users[idx], ...updates };
            await AsyncStorage.setItem('users', JSON.stringify(users));
          }
        }
        // If the email changed, move profileImage and favorites
        if (updates.email && oldEmail && updates.email !== oldEmail) {
          try {
            const profileKeyOld = `profileImage:${oldEmail}`;
            const profileKeyNew = `profileImage:${updates.email}`;
            const savedImage = await AsyncStorage.getItem(profileKeyOld);
            if (savedImage) {
              await AsyncStorage.setItem(profileKeyNew, savedImage);
              await AsyncStorage.removeItem(profileKeyOld);
            }
          } catch (imgErr) {
            console.log('Error migrating profile image', imgErr);
          }
          try {
            const favOld = await AsyncStorage.getItem(`favorites:${oldEmail}`);
            if (favOld) {
              await AsyncStorage.setItem(`favorites:${updates.email}`, favOld);
              await AsyncStorage.removeItem(`favorites:${oldEmail}`);
              // if the current favorites in memory were for oldEmail, update
              if (oldEmail === currentUser?.email) setFavorites(JSON.parse(favOld));
            }
          } catch (favErr) {
            console.log('Error migrating favorites', favErr);
          }
        }
      } catch (err) {
        console.log('Error persisting user changes', err);
      }
    })();
  }

  async function handleAuthSuccess(user: User) {
    (async () => {
      try {
        // Try to find full user object in AsyncStorage by email or CPF
        const usersRaw = await AsyncStorage.getItem('users');
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        let found: any = null;
        if (user.email) found = users.find((u: any) => u.email === user.email);
        if (!found && (user as any).cpf) found = users.find((u: any) => u.cpf === (user as any).cpf);
        const img = user.email ? await AsyncStorage.getItem(`profileImage:${user.email}`) : null;
        if (found) {
          // merge image if available
          const next = { ...found, avatar: img ?? found.avatar } as User;
          setCurrentUser(next);
        } else {
          setCurrentUser(img ? { ...user, avatar: img } as User : user as User);
        }
      } catch (err) {
        setCurrentUser(user as User);
      }
      loadFavoritesFor(user.email);
      setPage('courses');
    })();
  }

  function handleClassesUpdated() {
    setClassesVersion(v => v + 1);
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
      {page === 'login' && (
        <Welcome onNavigateToRegister={(role?: 'funcionario'|'responsavel'|'aluno') => { setRegisterRole(role); setPage('register'); }} onNavigateToLogin={(role?: 'funcionario'|'responsavel'|'aluno') => { setRegisterRole(role); setPage('loginForm'); }} onOpenAdmin={() => setPage('admin')} />
      )}
      {page === 'loginForm' && (
        <Login initialMode='form' loginRole={registerRole} onNavigateToRegister={(role?: 'funcionario'|'responsavel'|'aluno') => { setRegisterRole(role); setPage('register'); }} onAuthSuccess={handleAuthSuccess} onOpenAdmin={() => setPage('admin')} />
      )}
      {page === 'register' && (
        <Register role={registerRole} onNavigateToLogin={() => { setRegisterRole(undefined); setPage('login'); }} onAuthSuccess={(user) => { setRegisterRole(undefined); handleAuthSuccess(user); }} />
      )}
      {page === 'courses' && (
        <Courses onBack={() => handleLogout()} onOpenCourse={goToCourseDetail} onOpenFavorites={() => setPage('favorites')} onOpenProfile={() => setPage('profile')} onOpenDiscover={() => setPage('discover')} currentUser={currentUser} favorites={favorites} onToggleFavorite={handleToggleFavorite} onLogout={handleLogout} classesVersion={classesVersion} />
      )}
      {page === 'discover' && (
        <Discover onBack={() => setPage('courses')} />
      )}
      {page === 'courseDetail' && selectedCourse && (
        <CourseDetail course={selectedCourse} onBack={() => setPage('courses')} onToggleFavorite={handleToggleFavorite} favorites={favorites} currentUser={currentUser} classesVersion={classesVersion} onClassesUpdated={handleClassesUpdated} />
      )}
      {page === 'favorites' && (
        <Favorites onBack={() => setPage('courses')} onOpenCourse={goToCourseDetail} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
      )}
      {page === 'profile' && (
        <Profile user={currentUser} onBack={() => setPage('courses')} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
      )}
        {page === 'admin' && (
          <Admin onBack={() => setPage('login')} onClassesUpdated={handleClassesUpdated} />
        )}
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
