import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, TouchableWithoutFeedback } from 'react-native';
import { style } from './styles';
import Logo from '../../assets/wrath.png';
import { themes } from '../../global/themes';
import { Color } from 'react-native/types_generated/Libraries/Animated/AnimatedExports';

type Course = {
  id: string;
  title: string;
  image: any;
  short: string;
  description: string;
}

type Props = {
  onBack?: () => void;
  onOpenCourse: (course: Course) => void;
  currentUser?: { name: string; email: string } | null;
  favorites?: string[];
  onToggleFavorite?: (courseId: string) => void;
  onLogout?: () => void;
}

const sampleCourses: Course[] = [
  {id: '1', title: 'Assistente Administrativo', image: Logo, short: 'Introdução ao React Native', description: 'Aprenda os fundamentos do React Native para construir apps móveis.' },
  {id: '2', title: 'Programação de Dispositivos Móveis', image: Logo, short: 'Use Expo para acelerar desenvolvimento', description: 'Aprenda a usar Expo, gerenciar ativos e publicar aplicativos.' },
  {id: '3', title: 'Assistente de Recusos Humanos', image: Logo, short: 'Boas práticas de UI/UX', description: 'Aprenda princípios de design para criar interfaces móveis bonitas e usáveis.' },
  {id: '4', title: 'Assistente de Recusos Humanos', image: Logo, short: 'Boas práticas de UI/UX', description: 'Aprenda princípios de design para criar interfaces móveis bonitas e usáveis.' },
  {id: '5', title: 'Assistente de Recusos Humanos', image: Logo, short: 'Boas práticas de UI/UX', description: 'Aprenda princípios de design para criar interfaces móveis bonitas e usáveis.' },
];

export default function Courses({ onBack, onOpenCourse, currentUser, favorites = [], onToggleFavorite, onLogout }: Props) {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [favoritesVisible, setFavoritesVisible] = React.useState(false);

  function handleLogout() {
    setMenuVisible(false);
    Alert.alert('Logout', 'Você saiu da conta.');
    if (onBack) onBack();
  }

  function handleFavorites() {
    setMenuVisible(false);
    setFavoritesVisible(true);
  }
  return (
    <View style={style.container}>
      <View style={style.header}>
        <TouchableOpacity
          style={style.menuButton}
          onPress={() => setMenuVisible(!menuVisible)}
          hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
        >
          <View style={style.menuBar} />
          <View style={[style.menuBar, { marginVertical: 4 }]} />
          <View style={style.menuBar} />
        </TouchableOpacity>

        <Text style={style.headerTitle}>Cursos</Text>

        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
          <Text style={style.backText}>Logout</Text>
        </TouchableOpacity>
      </View>

      

      {menuVisible && (
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={style.overlay}>
            <View style={style.menuPanel}>
              <TouchableOpacity style={style.menuItem} onPress={() => { setMenuVisible(false); handleFavorites(); }}>
                <Text style={style.menuItemText}>Favoritos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={style.menuItem} onPress={() => { setMenuVisible(false); if (onLogout) onLogout(); }}>
                <Text style={[style.menuItemText, { color: '#ff3b30' }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}

      {favoritesVisible && (
        <View style={style.favoritesPanel} pointerEvents="box-none">
          <Text style={style.favoritesTitle}>Favoritos de {currentUser?.name ?? 'Você'}</Text>
          {sampleCourses.filter(c => (favorites || []).includes(c.id)).map(f => (
            <View key={f.id} style={style.favoriteRow}>
              <Text style={style.favoriteText}>{f.title}</Text>
              <TouchableOpacity onPress={() => onToggleFavorite && onToggleFavorite(f.id)}>
                <Text style={{ color: themes.colors.primary }}>Remover</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={{ marginTop: 8 }} onPress={() => setFavoritesVisible(false)}>
            <Text style={{ color: themes.colors.primary }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}

        <FlatList
          data={sampleCourses}
          keyExtractor={item => item.id}
          contentContainerStyle={style.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={style.card} onPress={() => onOpenCourse(item)}>
              <Image source={item.image} style={style.cardImage} resizeMode="cover" />
              <View style={style.cardBody}>
                <Text style={style.cardTitle}>{item.title}</Text>
                <Text style={style.cardShort}>{item.short}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
