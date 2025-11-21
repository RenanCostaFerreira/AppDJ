import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { style } from './styles';
import Logo from '../../assets/wrath.png';
import { themes } from '../../global/themes';

type Course = {
  id: string;
  title: string;
  image: any;
  short: string;
  description: string;
}

type Props = {
  onBack?: () => void;
  onOpenCourse?: (c: Course) => void;
  favorites?: string[];
  onToggleFavorite?: (courseId: string) => void;
}

const sampleCourses: Course[] = [
  {id: '1', title: 'Assistente Administrativo', image: Logo, short: 'Introdução ao React Native', description: 'Aprenda os fundamentos do React Native para construir apps móveis.' },
  {id: '2', title: 'Programação de Dispositivos Móveis', image: Logo, short: 'Use Expo para acelerar desenvolvimento', description: 'Aprenda a usar Expo, gerenciar ativos e publicar aplicativos.' },
  {id: '3', title: 'Assistente de Recusos Humanos', image: Logo, short: 'Boas práticas de UI/UX', description: 'Aprenda princípios de design para criar interfaces móveis bonitas e usáveis.' }
];

export default function Favorites({ onBack, onOpenCourse, favorites = [], onToggleFavorite }: Props) {
  const items = sampleCourses.filter(c => (favorites || []).includes(c.id));

  return (
    <View style={style.container}>
      <View style={style.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
          <Text style={style.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={style.headerTitle}>Favoritos</Text>
        <View style={{ width: 56 }} />
      </View>

      {items.length === 0 ? (
        <View style={style.empty}><Text style={style.emptyText}>Nenhum curso favoritado.</Text></View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={i => i.id}
          contentContainerStyle={style.list}
          renderItem={({ item }) => {
            const isFav = (favorites || []).includes(item.id);
            return (
              <TouchableOpacity style={style.card} onPress={() => onOpenCourse && onOpenCourse(item)}>
                <Image source={item.image} style={style.cardImage} resizeMode="cover" />
                <View style={style.cardBody}>
                  <View style={style.cardHeader}>
                    <Text style={style.cardTitle}>{item.title}</Text>
                    <TouchableOpacity
                      onPress={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(item.id); }}
                      style={style.favoriteButton}
                    >
                      <Text style={[style.favoriteStar, { color: isFav ? themes.colors.primary : '#999' }]}>{isFav ? '★' : '☆'}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={style.cardShort}>{item.short}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}
