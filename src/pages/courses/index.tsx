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
  onOpenFavorites?: () => void;
  onOpenProfile?: () => void;
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

export default function Courses({ onBack, onOpenCourse, onOpenFavorites, currentUser, favorites = [], onToggleFavorite, onLogout }: Props) {
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
      {/* Header row: use existing header style to ensure horizontal layout */}
      <View style={style.header}>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={style.menuButton} hitSlop={{ top: 12, left: 12, right: 12, bottom: 12 }}>
          <View style={style.menuBar} />
          <View style={[style.menuBar, { marginVertical: 4 }]} />
          <View style={style.menuBar} />
        </TouchableOpacity>

        <Text style={style.headerTitleSmall}>Location</Text>

        <View style={{ width: 36 }} />
      </View>

      <View style={style.searchWrapper}>
        <Text style={style.searchText}>Search</Text>
      </View>

      {/* Services row */}
      <View style={style.servicesRow}>
        <View style={style.serviceItem}>
          <Image source={Logo} style={{ width: 36, height: 36 }} />
          <Text style={style.serviceLabel}>Design</Text>
        </View>
        <View style={style.serviceItem}>
          <Image source={Logo} style={{ width: 36, height: 36 }} />
          <Text style={style.serviceLabel}>Programação</Text>
        </View>
        <View style={style.serviceItem}>
          <Image source={Logo} style={{ width: 36, height: 36 }} />
          <Text style={style.serviceLabel}>RH</Text>
        </View>
        <View style={style.serviceItem}>
          <Image source={Logo} style={{ width: 36, height: 36 }} />
          <Text style={style.serviceLabel}>Mais</Text>
        </View>
      </View>

      {menuVisible && (
        <>
          <TouchableOpacity style={style.overlayBackground} activeOpacity={1} onPress={() => setMenuVisible(false)} />
          <View style={style.menuPanel}>
            <TouchableOpacity style={style.menuItem} onPress={() => { setMenuVisible(false); if (typeof (onOpenFavorites) === 'function') { onOpenFavorites(); } else { handleFavorites(); } }}>
              <Text style={style.menuItemText}>Favoritos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.menuItem} onPress={() => { setMenuVisible(false); if (onLogout) onLogout(); else handleLogout(); }}>
              <Text style={[style.menuItemText, { color: '#ff3b30' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
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

      <Text style={style.sectionTitle}>Cursos</Text>

      <FlatList
        data={sampleCourses}
        keyExtractor={item => item.id}
        contentContainerStyle={style.list}
        renderItem={({ item }) => {
          const isFav = (favorites || []).includes(item.id);
          return (
            <TouchableOpacity style={style.card} onPress={() => onOpenCourse(item)}>
              <Image source={item.image} style={style.cardImage} resizeMode="cover" />
              <View style={style.cardBody}>
                <View style={style.cardHeader}>
                  <Text style={style.cardTitle}>{item.title}</Text>
                  <TouchableOpacity
                    style={style.favoriteButton}
                    onPress={() => { onToggleFavorite && onToggleFavorite(item.id); }}
                    hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
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
      {/* Bottom navigation bar */}
      <View style={style.bottomNav}>
        <TouchableOpacity style={style.navItem}>
          <Image source={Logo} style={{ width: 20, height: 20, tintColor: themes.colors.primary }} />
          <Text style={style.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.navItem}>
          <Image source={Logo} style={{ width: 20, height: 20 }} />
          <Text style={style.navText}>Discover</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.navItem}>
          <Image source={Logo} style={{ width: 20, height: 20 }} />
          <Text style={style.navText}>Favourite</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.navItem}>
          <Image source={Logo} style={{ width: 20, height: 20 }} />
          <Text style={style.navText}>Chat</Text>
        </TouchableOpacity>
  <TouchableOpacity style={style.navItem} onPress={() => { if (typeof (onOpenProfile) === 'function') onOpenProfile(); }}>
          <Image source={Logo} style={{ width: 20, height: 20 }} />
          <Text style={style.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
