import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, TouchableWithoutFeedback, TextInput } from 'react-native';
import { style } from './styles';
import Logo from '../../assets/wrath.png';
import { sampleCourses } from '../../data/courses';
import { Course } from '../../types/course';
import { themes } from '../../global/themes';

// use shared Course type

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



export default function Courses({ onBack, onOpenCourse, onOpenFavorites, onOpenProfile, currentUser, favorites = [], onToggleFavorite, onLogout }: Props) {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [favoritesVisible, setFavoritesVisible] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<Course[]>([]);

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
        <View style={style.headerCenter}>
          <Text style={style.headerGreeting}>Olá, {currentUser?.name ?? 'Você'}</Text>
          <Text style={style.headerTitleSmall}>Conheça nossos cursos!</Text>
        </View>

        <TouchableOpacity onPress={() => onOpenProfile && onOpenProfile()} style={{ marginLeft: 8 }}>
          {currentUser && (currentUser as any).avatar ? (
            <Image source={{ uri: (currentUser as any).avatar }} style={style.headerAvatar} />
          ) : (
            <Image source={Logo} style={style.headerAvatar} />
          )}
        </TouchableOpacity>
      </View>

      <View style={style.searchWrapper}>
        <TextInput
          style={{borderWidth:1,borderColor:'#ccc',borderRadius:8,padding:8,width:'90%',backgroundColor:'#fff'}}
          placeholder="Pesquisar cursos..."
          value={search}
          onChangeText={text => {
            setSearch(text);
            if (text.length > 0) {
              const lower = text.toLowerCase();
              setSuggestions(sampleCourses.filter(c =>
                c.title.toLowerCase().includes(lower) ||
                c.short.toLowerCase().includes(lower) ||
                c.description.toLowerCase().includes(lower) ||
                (c.activities || []).some(a => a.toLowerCase().includes(lower))
              ));
            } else {
              setSuggestions([]);
            }
          }}
        />
        {search.length > 0 && suggestions.length > 0 && (
          <View style={{backgroundColor:'#fff',borderRadius:8,marginTop:4,padding:8,elevation:2}}>
            <Text style={{fontWeight:'bold',marginBottom:4}}>Sugestões:</Text>
            {suggestions.map(s => (
              <TouchableOpacity key={s.id} onPress={() => { setSearch(''); setSuggestions([]); onOpenCourse(s); }} style={{paddingVertical:4}}>
                <Text style={{color:themes.colors.primary}}>{s.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {search.length > 0 && suggestions.length === 0 && (
          <Text style={{color:'red',marginTop:4}}>Nenhum curso encontrado.</Text>
        )}
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
              <Image source={item.image} style={[style.cardImage, { width: 80, height: 80, alignSelf: 'center' }]} resizeMode="contain" />
              <View style={style.cardBody}>
                <View style={style.cardHeader}>
                  <Text style={style.cardTitle}>{item.title}</Text>
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
          <Text style={style.navText}>Descubra</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.navItem} onPress={onOpenFavorites}>
          <Image source={Logo} style={{ width: 20, height: 20 }} />
          <Text style={style.navText}>Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.navItem} onPress={() => onOpenProfile && onOpenProfile()}>
          <Image source={Logo} style={{ width: 20, height: 20 }} />
          <Text style={style.navText}>Meu Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
