import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { style } from './styles';

type Course = {
  id: string;
  title: string;
  image: any;
  short: string;
  description: string;
}

type Props = {
  course: Course;
  onBack?: () => void;
  favorites?: string[];
  onToggleFavorite?: (courseId: string) => void;
}

export default function CourseDetail({ course, onBack, favorites = [], onToggleFavorite }: Props) {
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
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
          <Text style={style.backText}>Voltar</Text>
        </TouchableOpacity>
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

        <TouchableOpacity style={style.enrollButton} onPress={handleEnroll}>
          <Text style={style.enrollText}>Matricular-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
