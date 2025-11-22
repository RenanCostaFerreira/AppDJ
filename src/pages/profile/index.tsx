import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { style } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { themes } from '../../global/themes';

type Props = {
  user?: { name?: string; email?: string } | null;
  onBack?: () => void;
  onLogout?: () => void;
}

export default function Profile({ user, onBack, onLogout }: Props) {
  const [imageUri, setImageUri] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      if (!user?.email) return;
      try {
        const key = `profileImage:${user.email}`;
        const saved = await AsyncStorage.getItem(key);
        if (saved) setImageUri(saved);
      } catch (err) {
        console.log('Error loading profile image', err);
      }
    })();
  }, [user?.email]);

  async function pickImage() {
    if (!user?.email) return Alert.alert('Atenção', 'Usuário não identificado.');

    const pickFromLibrary = async () => {
      try {
        if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            return Alert.alert('Permissão', 'Permissão de acesso à galeria negada.');
          }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        const uri = (result as any).assets?.[0]?.uri ?? (result as any).uri;
        if (uri) {
          setImageUri(uri);
          await AsyncStorage.setItem(`profileImage:${user.email}`, uri);
        }
      } catch (err: any) {
        console.error('pickFromLibrary error', err);
        // Try a fallback using DocumentPicker (some devices/Expo versions may behave better)
        try {
          const doc = await DocumentPicker.getDocumentAsync({ type: 'image/*', copyToCacheDirectory: true });
          if (doc.type === 'success' && doc.uri) {
            setImageUri(doc.uri);
            await AsyncStorage.setItem(`profileImage:${user.email}`, doc.uri);
            return;
          }
        } catch (docErr) {
          console.error('DocumentPicker fallback error', docErr);
        }

        Alert.alert('Erro', err?.message ?? 'Não foi possível selecionar a imagem.');
      }
    };

    const takePhoto = async () => {
      try {
        if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            return Alert.alert('Permissão', 'Permissão de acesso à câmera negada.');
          }
        }

        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        const uri = (result as any).assets?.[0]?.uri ?? (result as any).uri;
        if (uri) {
          setImageUri(uri);
          await AsyncStorage.setItem(`profileImage:${user.email}`, uri);
        }
      } catch (err: any) {
        console.error('takePhoto error', err);
        Alert.alert('Erro', err?.message ?? 'Não foi possível tirar a foto.');
      }
    };

    // Show options for mobile: Gallery or Camera
    Alert.alert('Selecionar imagem', undefined, [
      { text: 'Galeria', onPress: pickFromLibrary },
      { text: 'Câmera', onPress: takePhoto },
      { text: 'Cancelar', style: 'cancel' }
    ]);
  }

  async function removeImage() {
    if (!user?.email) return;
    try {
      await AsyncStorage.removeItem(`profileImage:${user.email}`);
      setImageUri(null);
    } catch (err) {
      console.log('removeImage error', err);
    }
  }

  return (
    <View style={style.container}>
      <View style={style.header}>
        <TouchableOpacity style={style.back} onPress={onBack}>
          <Text style={{ color: themes.colors.primary }}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.logout} onPress={() => { if (onLogout) onLogout(); if (onBack) onBack(); }}>
          <Text style={{ color: '#fff' }}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={style.avatarWrap}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={style.avatar} />
        ) : (
          <View style={style.avatarPlaceholder}>
            <Text style={style.avatarPlaceholderText}>{(user?.name ?? 'U').charAt(0)}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={style.changePhotoBtn} onPress={pickImage}>
        <Text style={style.changePhotoText}>{imageUri ? 'Alterar foto' : 'Adicionar foto'}</Text>
      </TouchableOpacity>

      {imageUri ? (
        <TouchableOpacity style={style.removePhotoBtn} onPress={removeImage}>
          <Text style={style.removePhotoText}>Remover foto</Text>
        </TouchableOpacity>
      ) : null}

      <Text style={style.title}>{user?.name ?? 'Usuário'}</Text>
      <Text style={style.email}>{user?.email ?? 'sem-email@exemplo.com'}</Text>
    </View>
  )
}
