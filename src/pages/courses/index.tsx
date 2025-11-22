import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, TouchableWithoutFeedback, TextInput } from 'react-native';
import { style } from './styles';
import Logo from '../../assets/wrath.png';
import { themes } from '../../global/themes';

type Course = {
  id: string;
  title: string;
  image: any;
  short: string;
  description: string;
  duration: string;
  activities: string[];
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
  {
    id: '1',
    title: 'Assistente Administrativo',
    image: Logo,
    short: 'Gestão e rotinas administrativas',
    description: 'Aprenda os fundamentos da administração, organização de documentos, atendimento e suporte ao setor administrativo.',
    duration: '3 meses',
    activities: [
      'Gestão de documentos',
      'Atendimento ao público',
      'Rotinas administrativas',
      'Apoio na saúde mental',
      'Inclusão para o mundo do trabalho'
    ]
  },
  {
    id: '2',
    title: 'Programação de Dispositivos Móveis',
    image: Logo,
    short: 'Desenvolvimento de apps com React Native',
    description: 'Aprenda a criar aplicativos móveis, usar Expo, gerenciar ativos e publicar aplicativos nas lojas.',
    duration: '6 meses',
    activities: [
      'Desenvolvimento de trilhas formativas',
      'Projetos práticos com React Native',
      'Publicação de apps',
      'Mentorias técnicas',
      'Colaboração em equipe'
    ]
  },
  {
    id: '3',
    title: 'Recursos Humanos e Liderança',
    image: Logo,
    short: 'Gestão de pessoas e liderança',
    description: 'Desenvolva habilidades para atuar em RH, recrutamento, seleção, treinamento e liderança de equipes.',
    duration: '4 meses',
    activities: [
      'Recrutamento e seleção',
      'Treinamento de equipes',
      'Gestão de conflitos',
      'Mentorias de liderança',
      'Apoio psicossocial'
    ]
  },
  {
    id: '4',
    title: 'Design Gráfico e Criatividade',
    image: Logo,
    short: 'Criação visual e comunicação',
    description: 'Aprenda princípios de design, ferramentas gráficas, criação de identidade visual e comunicação digital.',
    duration: '5 meses',
    activities: [
      'Oficinas de design',
      'Projetos de identidade visual',
      'Comunicação digital',
      'Colaboração criativa',
      'Portfólio profissional'
    ]
  },
  {
    id: '5',
    title: 'Empreendedorismo Social',
    image: Logo,
    short: 'Inovação e impacto social',
    description: 'Desenvolva projetos de impacto social, aprenda sobre negócios sustentáveis e liderança comunitária.',
    duration: '4 meses',
    activities: [
      'Criação de projetos sociais',
      'Gestão sustentável',
      'Liderança comunitária',
      'Mentorias de impacto',
      'Parcerias e networking'
    ]
  },
  {
    id: '6',
    title: 'Tecnologia e Inovação',
    image: Logo,
    short: 'Ferramentas digitais e automação',
    description: 'Explore ferramentas tecnológicas, automação de processos e inovação para o mercado de trabalho.',
    duration: '3 meses',
    activities: [
      'Automação de processos',
      'Uso de ferramentas digitais',
      'Projetos de inovação',
      'Oficinas práticas',
      'Desenvolvimento de carreira'
    ]
  },
];

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
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={style.menuButton} hitSlop={{ top: 12, left: 12, right: 12, bottom: 12 }}>
          <View style={style.menuBar} />
          <View style={[style.menuBar, { marginVertical: 4 }]} />
          <View style={style.menuBar} />
        </TouchableOpacity>

        <Text style={style.headerTitleSmall}>Associação Comunitária Despertar
        </Text>

        <View style={{ width: 36 }} />
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
                c.activities.some(a => a.toLowerCase().includes(lower))
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
