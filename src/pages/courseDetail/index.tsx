import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert, FlatList } from 'react-native';
import BackButton from '../../components/BackButton';
import LayoutToggle from '../../components/LayoutToggle';
import { useLayout } from '../../global/LayoutContext';
import { style } from './styles';
import { themes } from '../../global/themes';
import { Course } from '../../types/course';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Turma from '../../types/turma';

type Props = {
  course: Course;
  onBack?: () => void;
  favorites?: string[];
  onToggleFavorite?: (courseId: string) => void;
  currentUser?: { name?: string; email?: string } | null;
  classesVersion?: number;
  onClassesUpdated?: () => void;
}
export default function CourseDetail({ course, onBack, favorites = [], onToggleFavorite, currentUser, classesVersion, onClassesUpdated }: Props) {
  const { mode } = useLayout();
  const [classes, setClasses] = React.useState<Turma[]>([]);
  React.useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('classes');
        const list: Turma[] = raw ? JSON.parse(raw) : [];
        const filtered = list.filter((cl) => (cl.courseId ? cl.courseId === course.id : cl.course === course.title));
        setClasses(filtered);
      } catch (err) {
        console.warn('courseDetail: failed to load classes', err);
      }
    })();
  }, [course, classesVersion]);

  async function enrollInClass(clId: string) {
    if (!currentUser) {
      Alert.alert('Login', 'Faça login para se matricular');
      return;
    }
    try {
      const raw = await AsyncStorage.getItem('classes');
      const list: Turma[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((c) => c.id === clId);
      if (idx === -1) return Alert.alert('Erro', 'Turma não encontrada');
      const turma = list[idx];
      const userEmail = currentUser?.email;
      if (!userEmail) return Alert.alert('Erro', 'Usuário inválido');
      if (turma.students && turma.students.includes(userEmail)) return Alert.alert('Matrícula', 'Você já está matriculado nesta turma');
      if ((turma.vacancies ?? 0) <= 0) return Alert.alert('Matrícula', 'Não há vagas disponíveis');
      turma.students = [...(turma.students || []), userEmail];
      turma.vacancies = (turma.vacancies ?? 0) - 1;
      list[idx] = turma;
      await AsyncStorage.setItem('classes', JSON.stringify(list));
      if (typeof onClassesUpdated === 'function') onClassesUpdated();
      // update local list
      setClasses(list.filter((c) => (c.courseId ? c.courseId === course.id : c.course === course.title)));
      Alert.alert('Sucesso', 'Você foi matriculado na turma');
    } catch (err) {
      console.warn('courseDetail: enroll error', err);
      Alert.alert('Erro', 'Não foi possível matricular-se na turma');
    }
  }
  function handleEnroll() {
    Alert.alert('Matrícula', `Você foi matriculado no curso "${course.title}"!`);
  }

  const isFav = (favorites || []).includes(course.id);

  function handleToggleFav() {
    if (onToggleFavorite) onToggleFavorite(course.id);
  }

  return (
    <View style={style.container}>
      <View style={style.header}>
        <BackButton onPress={onBack} label="Voltar" />
      </View>

      <Image source={course.image} style={style.image} resizeMode="cover" />
      <View style={style.body}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={style.title}>{course.title}</Text>
          <TouchableOpacity onPress={handleToggleFav} hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}>
            <Text style={{ fontSize: 22, color: isFav ? '#ff6810' : '#999' }}>{isFav ? '★' : '☆'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={style.description}>{course.description}</Text>
        <Text style={{ fontSize: 14, color: '#555', marginTop: 8 }}>Tempo de curso: {course.duration}</Text>
        <Text style={{ fontSize: 14, color: '#555', marginTop: 8 }}>Atividades:</Text>
        {course.activities && course.activities.map((act, idx) => (
          <Text key={idx} style={{ fontSize: 13, color: '#777', marginLeft: 8 }}>• {act}</Text>
        ))}

        <Text style={{ fontWeight: '700', marginTop: 12 }}>Turmas disponíveis</Text>
        {classes.length === 0 ? (
          <Text style={{ color: '#666', marginTop: 8 }}>Nenhuma turma disponível.</Text>
        ) : (
          <FlatList
            data={classes}
            keyExtractor={(t) => t.id}
            renderItem={({ item }) => {
              const userEmail = currentUser?.email;
              const alreadyEnrolled = userEmail ? !!item.students?.includes(userEmail) : false;
              return (
                  <View style={{ padding: 8, borderWidth: 1, borderColor: '#eee', borderRadius: 6, marginTop: 8 }}>
                <Text style={{ fontWeight: '700' }}>{item.name}</Text>
                <Text style={{ color: '#666' }}>{item.professor ?? '-'} — {item.schedule ?? '-'}</Text>
                <Text style={{ color: '#666', marginTop: 4 }}>Vagas: {item.vacancies ?? 0} — Matriculados: {item.students?.length ?? 0}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                  {alreadyEnrolled ? (
                    <Text style={{ color: themes.colors.primary, fontWeight: '700' }}>Já matriculado</Text>
                  ) : (
                    <TouchableOpacity onPress={() => enrollInClass(item.id)} disabled={(item.vacancies ?? 0) <= 0} style={{ backgroundColor: (item.vacancies ?? 0) <= 0 ? '#ccc' : themes.colors.primary, padding: 8, borderRadius: 6 }}>
                      <Text style={{ color: '#fff' }}>{(item.vacancies ?? 0) <= 0 ? 'Sem vagas' : 'Matricular'}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
}
