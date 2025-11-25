import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Linking, Alert } from 'react-native';
import { style } from './styles';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { themes } from '../../global/themes';

type Props = {
  onBack?: () => void
}

export default function Discover({ onBack }: Props) {
  const [loading, setLoading] = React.useState(true);
  const [title, setTitle] = React.useState<string | null>(null);
  const [description, setDescription] = React.useState<string | null>(null);
  const [socials, setSocials] = React.useState<string[]>([]);

  function socialLabel(url: string) {
    if (url.includes('instagram.com')) return 'Instagram';
    if (url.includes('facebook.com')) return 'Facebook';
    if (url.includes('youtube.com')) return 'YouTube';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
    if (url.includes('linkedin.com')) return 'LinkedIn';
    if (url.includes('tiktok.com')) return 'TikTok';
    return url.replace(/https?:\/\//, '').split('/')[0];
  }

  function socialIcon(url: string) {
    if (url.includes('instagram.com')) return { Icon: FontAwesome, name: 'instagram' };
    if (url.includes('facebook.com')) return { Icon: FontAwesome, name: 'facebook' };
    if (url.includes('youtube.com')) return { Icon: FontAwesome, name: 'youtube' };
    if (url.includes('twitter.com') || url.includes('x.com')) return { Icon: FontAwesome, name: 'twitter' };
    if (url.includes('linkedin.com')) return { Icon: FontAwesome, name: 'linkedin' };
    if (url.includes('tiktok.com')) return { Icon: FontAwesome5, name: 'tiktok' };
    return { Icon: FontAwesome, name: 'link' };
  }

  React.useEffect(() => {
    (async () => {
      try {
        // fetch HTML and try to parse title and first meta description
        const res = await fetch('https://despertar.org.br');
        const html = await res.text();

        // get title
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        if (titleMatch) setTitle(titleMatch[1]);

        // meta description
        const descMatch = html.match(/<meta\s+name=("|')description\1\s+content=("|')(.*?)\2/i) || html.match(/<meta\s+content=("|')(.*?)\1\s+name=("|')description\3/i);
        if (descMatch) {
          setDescription(descMatch[3] || descMatch[2]);
        }

        // find social links - naive regex
        const socialLinks: string[] = [];
        const linkRegex = /href=("|')(https?:\/\/(?:www\.)?(?:facebook|instagram|linkedin|twitter|youtube|tiktok)\.com[\w\-\/\?=&#.]+)\1/gi;
        let match;
        while ((match = linkRegex.exec(html)) !== null) {
          socialLinks.push(match[2]);
        }

        // fallback: try to also match social short URL style
        const shortRegex = /href=("|')(https?:\/\/[^"']*(?:facebook|instagram|linkedin|twitter|youtube|tiktok)[^"']*)\1/gi;
        while ((match = shortRegex.exec(html)) !== null) {
          if (!socialLinks.includes(match[2])) socialLinks.push(match[2]);
        }

        setSocials(Array.from(new Set(socialLinks)));
      } catch (err) {
        console.warn('Discover: could not load site info', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function openLink(url: string) {
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        Alert.alert('Erro', 'Não foi possível abrir o link.');
      } else {
        Linking.openURL(url);
      }
    }).catch(err => Alert.alert('Erro', 'Não foi possível abrir o link.'));
  }

  return (
    <View style={style.container}>
      {loading ? (
        <ActivityIndicator size="large" color={themes.colors.primary} />
      ) : (
        <>
          <TouchableOpacity onPress={() => onBack && onBack()} style={{ marginBottom: 12 }}>
            <Text style={{ color: themes.colors.primary }}>‹ Voltar</Text>
          </TouchableOpacity>
          <Text style={style.title}>{title ?? 'Despertar'}</Text>
          {description ? <Text style={style.description}>{description}</Text> : null}

          <Text style={style.sectionTitle}>Site</Text>
          <TouchableOpacity style={style.button} onPress={() => openLink('https://despertar.org.br')}>
            <Text style={style.buttonText}>Abrir site</Text>
          </TouchableOpacity>

          <Text style={[style.sectionTitle, { marginTop: 16 }]}>Redes sociais</Text>
          {socials.length === 0 ? (
            <Text style={{ color: '#666', marginTop: 8 }}>Nenhuma rede social encontrada no site.</Text>
          ) : (
            <FlatList
              data={socials}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={[style.socialRow, { marginBottom: 8 }]} onPress={() => openLink(item)}>
                  <View style={style.socialIconWrap}>
                    {(() => {
                      const { Icon, name } = socialIcon(item);
                      return <Icon name={name as any} size={20} color="#fff" />;
                    })()}
                  </View>
                  <Text style={style.socialText}>{socialLabel(item)}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </>
      )}
    </View>
  );
}
