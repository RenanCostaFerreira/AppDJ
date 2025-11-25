import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Linking, Alert } from 'react-native';
import { style } from './styles';
import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { copyText } from '../../utils/clipboard';
import { themes } from '../../global/themes';

type Props = {
  onBack?: () => void
}

export default function Discover({ onBack }: Props) {
  const [loading, setLoading] = React.useState(true);
  const [title, setTitle] = React.useState<string | null>(null);
  const [description, setDescription] = React.useState<string | null>(null);
  const [socials, setSocials] = React.useState<string[]>([]);
  const [networks, setNetworks] = React.useState<string[]>([]);
  const [contacts, setContacts] = React.useState<string[]>([]);

  function socialLabel(url: string) {
    if (url.includes('instagram.com')) return 'Instagram';
    if (url.includes('facebook.com')) return 'Facebook';
    if (url.includes('youtube.com')) return 'YouTube';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
    if (url.includes('linkedin.com')) return 'LinkedIn';
    if (url.includes('tiktok.com')) return 'TikTok';
    if (url.includes('whatsapp.com') || url.includes('api.whatsapp.com') || url.includes('wa.me')) return 'WhatsApp';
    if (url.startsWith('mailto:')) return url.replace('mailto:', '');
    if (url.startsWith('tel:')) return url.replace('tel:', '');
    return url.replace(/https?:\/\//, '').split('/')[0];
  }

  function socialIcon(url: string) {
    if (url.includes('instagram.com')) return { Icon: FontAwesome5, name: 'instagram' };
    if (url.includes('facebook.com')) return { Icon: FontAwesome5, name: 'facebook' };
    if (url.includes('youtube.com')) return { Icon: FontAwesome5, name: 'youtube' };
    if (url.includes('linkedin.com')) return { Icon: FontAwesome5, name: 'linkedin' };
    if (url.includes('whatsapp.com') || url.includes('api.whatsapp.com') || url.includes('wa.me')) return { Icon: FontAwesome, name: 'whatsapp' };
    if (url.startsWith('mailto:')) return { Icon: FontAwesome, name: 'envelope' };
    if (url.startsWith('tel:')) return { Icon: FontAwesome, name: 'phone' };
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

        // find social links - initial regex for known domains
        const socialLinks: string[] = [];
        const linkRegex = /href=("|')((?:https?:)?\/\/(?:www\.)?(?:facebook|instagram|linkedin|twitter|youtube|tiktok|whatsapp)\.[^"']+)\1/gi;
        let match;
        while ((match = linkRegex.exec(html)) !== null) {
          socialLinks.push(match[2]);
        }

        // also match whatsapp short urls (wa.me or api.whatsapp.com)
        const waRegex = /href=("|')(https?:\/\/(?:wa\.me|api\.whatsapp\.com)\/[^"']+)\1/gi;
        while ((match = waRegex.exec(html)) !== null) {
          if (!socialLinks.includes(match[2])) socialLinks.push(match[2]);
        }

        // match mailto and tel anchors
        const mailRegex = /href=("|')mailto:([^"']+)\1/gi;
        const telRegex = /href=("|')tel:([^"']+)\1/gi;
        while ((match = mailRegex.exec(html)) !== null) {
          socialLinks.push(`mailto:${match[2]}`);
        }
        while ((match = telRegex.exec(html)) !== null) {
          socialLinks.push(`tel:${match[2]}`);
        }

        // fallback: catch generic anchors for known networks and contact links
        const genericLinkRegex = /href=("|')((?:https?:)?\/\/(?:www\.)?[^"']+)\1/gi;
        while ((match = genericLinkRegex.exec(html)) !== null) {
          const url = match[2];
          if (/facebook|instagram|linkedin|twitter|youtube|tiktok|whatsapp/.test(url)) {
            if (!socialLinks.includes(url)) socialLinks.push(url);
          }
        }

        // also try to scan for plain emails and phone numbers in the footer text
        const emailPlain = [...html.matchAll(/([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi)].map(m => `mailto:${m[1]}`);
        for (const e of emailPlain) if (!socialLinks.includes(e)) socialLinks.push(e);
        const phonePlain = [...html.matchAll(/\(\d{2}\)\s*\d{4,5}-\d{4}/g)].map(m => `tel:${m[0].replace(/\s+/g, '')}`);
        for (const p of phonePlain) if (!socialLinks.includes(p)) socialLinks.push(p);

        // also pick up icons with font-awesome classes (footer uses these icons)
        const iconRegex = /<i[^>]*class=("|')([^"']*(?:fa-(?:instagram|facebook|linkedin|youtube)|fa-brands[^"']*(?:instagram|facebook|linkedin|youtube))[^"']*)\1[^>]*>/gi;
        while ((match = iconRegex.exec(html)) !== null) {
          const idx = match.index;
          // find nearest preceding anchor with href
          const anchorStart = html.lastIndexOf('<a', idx);
          if (anchorStart !== -1) {
            const hrefMatch = html.slice(anchorStart, idx).match(/href=("|')(https?:\/\/[^"']+)\1/i);
            if (hrefMatch) socialLinks.push(hrefMatch[2]);
          }
        }

        const all = Array.from(new Set(socialLinks));
        // split networks vs contact links
        // Only keep the main official networks to match the app UI
        const networksList = all.filter(u => /instagram\.com|facebook\.com|linkedin\.com|youtube\.com/.test(u));
        // sort networks to a preferred order for display
        const preferred = ['instagram.com','facebook.com','linkedin.com','youtube.com'];
        networksList.sort((a,b) => {
          const ai = preferred.findIndex(p => a.includes(p));
          const bi = preferred.findIndex(p => b.includes(p));
          return Math.sign((ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi));
        });
        const contactList = all.filter(u => u.startsWith('mailto:') || u.startsWith('tel:') || /wa\.me|api\.whatsapp\.com|whatsapp\.com/.test(u));
        setSocials(all);
        setNetworks(networksList);
        setContacts(contactList);
        console.log('Discover: parsed networks', networksList);
        console.log('Discover: parsed contacts', contactList);

        // If we couldn't find networks or contacts, use a small known fallback
        if (networksList.length === 0) {
          const fallback = [
            'https://www.instagram.com/sou.despertar/',
            'https://www.facebook.com/sou.despertar/',
            'https://www.linkedin.com/school/66649734/',
            'https://www.youtube.com/@sou.despertar'
          ];
          setNetworks(fallback);
          console.log('Discover: falling back to default networks', fallback);
        }
        if (contactList.length === 0) {
          const contactsFallback = [
            'mailto:despertar@despertar.org.br',
            'mailto:ouvidoria@despertar.org.br',
            'tel:(11)5621-0901'
          ];
          setContacts(contactsFallback);
          console.log('Discover: falling back to default contacts', contactsFallback);
        }
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

  async function copyToClipboard(value: string) {
    try {
      await copyText(value);
      Alert.alert('Copiado', `${value} copiado para a área de transferência.`);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível copiar para a área de transferência.');
    }
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
          {networks.length === 0 ? (
            <Text style={{ color: '#666', marginTop: 8 }}>Nenhuma rede social encontrada no site.</Text>
          ) : (
            <FlatList
              data={networks}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={style.socialRow} onPress={() => openLink(item)}>
                  <View style={style.socialIconWrap}>
                    {(() => {
                      const { Icon, name } = socialIcon(item);
                      return <Icon name={name as any} size={22} color="#fff" />;
                    })()}
                  </View>
                  <Text style={style.socialText}>{socialLabel(item)}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <Text style={[style.sectionTitle, { marginTop: 8 }]}>Contato</Text>
          {contacts.length === 0 ? (
            <Text style={{ color: '#666', marginTop: 8 }}>Nenhum contato encontrado no site.</Text>
          ) : (
            <FlatList
              data={contacts}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={style.socialRow} onPress={() => openLink(item)} onLongPress={() => {
                  // copy email or phone if available
                  if (item.startsWith('mailto:')) copyToClipboard(item.replace('mailto:', ''));
                  else if (item.startsWith('tel:')) copyToClipboard(item.replace('tel:', ''));
                  else if (item.includes('wa.me') || item.includes('whatsapp')) copyToClipboard(item);
                }}>
                  <View style={style.socialIconWrap}>
                    {(() => {
                      const { Icon, name } = socialIcon(item);
                      return <Icon name={name as any} size={22} color="#fff" />;
                    })()}
                  </View>
                  <Text style={style.socialText}>{socialLabel(item)}</Text>
                  <View style={{ marginLeft: 12 }}>
                    <MaterialIcons name="content-copy" size={20} color="#fff" />
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </>
      )}
    </View>
  );
}
