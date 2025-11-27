import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, TouchableWithoutFeedback, TextInput, Linking } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import { style } from './styles';
import Logo from '../../assets/wrath.png';
import { MaterialIcons } from '@expo/vector-icons';
import { sampleCourses } from '../../data/courses';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course } from '../../types/course';
import { themes } from '../../global/themes';
import { parseDespertar } from '../../utils/siteParser';
import { copyText } from '../../utils/clipboard';
import { useLayout } from '../../global/LayoutContext';

// use shared Course type

type Props = {
  onBack?: () => void;
  onOpenCourse: (course: Course) => void;
  onOpenFavorites?: () => void;
  onOpenProfile?: () => void;
  onOpenDiscover?: () => void;
  currentUser?: { name: string; email: string } | null;
  favorites?: string[];
  onToggleFavorite?: (courseId: string) => void;
  onLogout?: () => void;
  classesVersion?: number;
}



export default function Courses({ onBack, onOpenCourse, onOpenFavorites, onOpenProfile, onOpenDiscover, currentUser, favorites = [], onToggleFavorite, onLogout, classesVersion }: Props) {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [favoritesVisible, setFavoritesVisible] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<Course[]>([]);
  const [classes, setClasses] = React.useState<any[]>([]);
  const [contacts, setContacts] = React.useState<string[]>([]);
  const { mode } = useLayout();

  function handleLogout() {
    setMenuVisible(false);
    Alert.alert('Logout', 'Você saiu da conta.');
    if (onBack) onBack();
  }

  function handleFavorites() {
    setMenuVisible(false);
    setFavoritesVisible(true);
  }

  React.useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('classes');
        const c = raw ? JSON.parse(raw) : [];
        setClasses(c);
      } catch (err) {
        console.log('courses: load classes error', err);
      }
    })();
    if (mode === 'desktop') {
      (async () => {
        try {
          const parsed = await parseDespertar();
          setContacts(parsed.contacts);
        } catch (err) {
          console.warn('courses: failed to parse site contacts', err);
        }
      })();
    }
  }, [classesVersion, mode]);

  return (
    <ScreenContainer style={{ backgroundColor: themes.colors.bgScreen }} useScrollView={false}>
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
      {mode === 'desktop' ? (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <FlatList
              data={sampleCourses}
              keyExtractor={item => item.id}
              contentContainerStyle={style.list}
              renderItem={({ item }) => {
                const isFav = (favorites || []).includes(item.id);
                const courseClasses = classes.filter(cl => (cl.courseId ? cl.courseId === item.id : cl.course === item.title));
                const classesCount = courseClasses.length;
                const totalVagas = courseClasses.reduce((acc, c) => acc + (c.vacancies || 0), 0);
                return (
                  <TouchableOpacity style={style.card} onPress={() => onOpenCourse(item)}>
                    <Image source={item.image} style={[style.cardImage, { width: 80, height: 80, alignSelf: 'center' }]} resizeMode="contain" />
                    <View style={style.cardBody}>
                      <View style={style.cardHeader}>
                        <Text style={style.cardTitle}>{item.title}</Text>
                      </View>
                      <Text style={style.cardShort}>{item.short}</Text>
                      <Text style={{ color: '#666', marginTop: 4 }}>{classesCount} turma{classesCount !== 1 ? 's' : ''} • {totalVagas <= 0 ? 'Sem vagas' : `Vagas: ${totalVagas}`}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          <View style={{ width: 320, paddingLeft: 12, borderLeftWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>Contato</Text>
            {contacts.length === 0 ? (
              <Text style={{ color: '#666' }}>Nenhum contato encontrado.</Text>
            ) : (
              contacts.map(item => (
                <TouchableOpacity key={item} style={{ padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 8, backgroundColor: '#fff' }} onPress={() => Linking.openURL(item)} onLongPress={() => {
                  if (item.startsWith('mailto:')) copyText(item.replace('mailto:', ''));
                  else if (item.startsWith('tel:')) copyText(item.replace('tel:', ''));
                  else if (item.includes('wa.me') || item.includes('whatsapp')) copyText(item);
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: '700' }}>{item.replace('mailto:', '').replace('tel:', '')}</Text>
                    <MaterialIcons name="content-copy" size={18} color="#666" />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      ) : (
        <FlatList
        data={sampleCourses}
        keyExtractor={item => item.id}
        contentContainerStyle={style.list}
        renderItem={({ item }) => {
          const isFav = (favorites || []).includes(item.id);
          const courseClasses = classes.filter(cl => (cl.courseId ? cl.courseId === item.id : cl.course === item.title));
          const classesCount = courseClasses.length;
          const totalVagas = courseClasses.reduce((acc, c) => acc + (c.vacancies || 0), 0);
          return (
            <TouchableOpacity style={style.card} onPress={() => onOpenCourse(item)}>
              <Image source={item.image} style={[style.cardImage, { width: 80, height: 80, alignSelf: 'center' }]} resizeMode="contain" />
              <View style={style.cardBody}>
                <View style={style.cardHeader}>
                  <Text style={style.cardTitle}>{item.title}</Text>
                </View>

                <Text style={style.cardShort}>{item.short}</Text>
                <Text style={{ color: '#666', marginTop: 4 }}>{classesCount} turma{classesCount !== 1 ? 's' : ''} • {totalVagas <= 0 ? 'Sem vagas' : `Vagas: ${totalVagas}`}</Text>
              </View>
              {(mode as any) === 'desktop' ? (
                <View style={{ marginLeft: 12, alignItems: 'flex-end' }}>
                  <Text style={{ color: '#666', fontSize: 12 }}>{
                    `${classes.filter(cl => (cl.courseId ? cl.courseId === item.id : cl.course === item.title)).length} turma(s)`
                  }</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        }}
      />
      )}
      {/* Bottom navigation bar */}
      <View style={style.bottomNav}>
        <TouchableOpacity style={style.navItem} onPress={() => { if (onBack) onBack(); }}>
          <MaterialIcons name="home" size={24} color={themes.colors.primary} />
          <Text style={style.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.navItem} onPress={() => onOpenDiscover && onOpenDiscover()}>
          <MaterialIcons name="search" size={24} color={themes.colors.primary} />
          <Text style={style.navText}>Descubra</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.navItem} onPress={onOpenFavorites}>
          <MaterialIcons name="star" size={24} color={themes.colors.primary} />
          <Text style={style.navText}>Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.navItem} onPress={() => onOpenProfile && onOpenProfile()}>
          <MaterialIcons name="person" size={24} color={themes.colors.primary} />
          <Text style={style.navText}>Meu Perfil</Text>
        </TouchableOpacity>
      </View>
      </View>
    </ScreenContainer>
  );
}
