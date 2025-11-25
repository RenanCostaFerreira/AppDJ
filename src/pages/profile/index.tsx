import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert, Platform, TextInput } from 'react-native';
import { style } from './styles';
import { formatCPF, onlyDigits, validateCPF } from '../../utils/cpf';
import { Input } from '../../components/input';
import { User } from '../../types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { themes } from '../../global/themes';

type Props = {
  user?: User | null;
  onBack?: () => void;
  onLogout?: () => void;
  onUpdateUser?: (updates: Partial<User>) => void;
}

export default function Profile({ user, onBack, onLogout, onUpdateUser }: Props) {
  const [imageUri, setImageUri] = React.useState<string | null>(null);
  const [name, setName] = React.useState(user?.name ?? '');
  const [pendingName, setPendingName] = React.useState(user?.name ?? '');
  // email is derived from current user prop; we use it directly from `user` to avoid stale values
  const email = user?.email ?? '';
  const [showPasswordPrompt, setShowPasswordPrompt] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [editingCpf, setEditingCpf] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState(false);
  const [cpfInput, setCpfInput] = React.useState(user?.cpf ?? '');

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
          console.log('Profile: picked image uri ->', uri);
          if (onUpdateUser) onUpdateUser({ avatar: uri });
        }
      } catch (err: any) {
        console.error('pickFromLibrary error', err);
        // Try a fallback using DocumentPicker (some devices/Expo versions may behave better)
        try {
          const doc = await DocumentPicker.getDocumentAsync({ type: 'image/*', copyToCacheDirectory: true });
          if (doc && doc.assets && doc.assets.length > 0 && doc.assets[0].uri) {
            setImageUri(doc.assets[0].uri);
            await AsyncStorage.setItem(`profileImage:${user.email}`, doc.assets[0].uri);
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
          console.log('Profile: camera image uri ->', uri);
          if (onUpdateUser) onUpdateUser({ avatar: uri });
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
      console.log('Profile: removed image for', user.email);
      if (onUpdateUser) onUpdateUser({ avatar: undefined });
    } catch (err) {
      console.log('removeImage error', err);
    }
  }

  async function saveCpf(newCpf: string) {
    if (!user?.email) return;
    const digits = onlyDigits(newCpf);
    if (!validateCPF(digits)) {
      Alert.alert('CPF inválido', 'Por favor, informe um CPF válido.');
      return;
    }
    try {
      const usersRaw = await AsyncStorage.getItem('users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const idx = users.findIndex((u: any) => u.email === user.email);
      if (idx >= 0) {
        users[idx].cpf = digits;
        await AsyncStorage.setItem('users', JSON.stringify(users));
        if (onUpdateUser) onUpdateUser({ cpf: digits });
        Alert.alert('CPF atualizado', 'Seu CPF foi atualizado com sucesso.');
        setEditingCpf(false);
      }
    } catch (err) {
      console.error('saveCpf error', err);
      Alert.alert('Erro', 'Não foi possível salvar o CPF.');
    }
  }

  async function changeRole(role: User['role']) {
    if (!user?.email) return;
    try {
      const usersRaw = await AsyncStorage.getItem('users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const idx = users.findIndex((u: any) => u.email === user.email);
      if (idx >= 0) {
        users[idx].role = role;
        await AsyncStorage.setItem('users', JSON.stringify(users));
        if (onUpdateUser) onUpdateUser({ role });
        Alert.alert('Perfil atualizado', `Seu perfil foi alterado para ${role}.`);
      }
    } catch (err) {
      console.error('changeRole error', err);
      Alert.alert('Erro', 'Não foi possível alterar o perfil.');
    }
  }

  return (
    <View style={style.container}>
      <View style={style.header}>
        <TouchableOpacity style={style.back} onPress={onBack}>
          <Text style={{ color: themes.colors.primary }}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.logout} onPress={() => Alert.alert('Perfil salvo', 'Suas informações foram salvas com sucesso!')}>
          <Text style={{ color: '#fff' }}>Salvar</Text>
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

      <View style={style.infoContainer}>
        <Text style={style.title}>Nome</Text>
        <View style={{width:'100%',marginBottom:8}}>
        <Input
          value={pendingName}
          onChangeText={text => {
            setShowPasswordPrompt(true);
            setPendingName(text);
          }}
          placeholder="Digite seu nome"
        />
      </View>
        <Text style={style.title}>E-mail</Text>
        <View style={{width:'100%',marginBottom:8}}>
        <Input
          value={email}
          editable={false}
          keyboardType="email-address"
        />
      </View>
        {(user?.role === 'responsavel' || user?.role === 'aluno') && (
          <>
            <Text style={style.title}>CPF</Text>
            <View style={{width:'100%',marginBottom:8}}>
              {!editingCpf ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Input
                    value={formatCPF(user?.cpf ?? '')}
                    editable={false}
                    keyboardType="numeric"
                />
                  <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => { setCpfInput(user?.cpf ?? ''); setEditingCpf(true); }}>
                    <Text style={{ color: themes.colors.primary }}>Editar</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Input
                    value={formatCPF(cpfInput)}
                    onChangeText={(t: string) => setCpfInput(onlyDigits(t).slice(0,11))}
                    placeholder="CPF"
                    keyboardType='number-pad'
                />
                  <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => saveCpf(cpfInput)}>
                    <Text style={{ color: themes.colors.primary }}>Salvar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => setEditingCpf(false)}>
                    <Text style={{ color: '#999' }}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        )}
        {user?.role && (
          <>
            <Text style={style.title}>Perfil</Text>
            <View style={{width:'100%',marginBottom:8}}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Input
                  value={user?.role ?? ''}
                  editable={false}
                />
                <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => {
                  Alert.alert('Alterar perfil', undefined, [
                    { text: 'Aluno', onPress: () => changeRole('aluno') },
                    { text: 'Servidor', onPress: () => changeRole('funcionario') },
                    { text: 'Responsável', onPress: () => changeRole('responsavel') },
                    { text: 'Cancelar', style: 'cancel' }
                  ]);
                }}>
                  <Text style={{ color: themes.colors.primary }}>Alterar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
      {showPasswordPrompt && (
        <View style={{width:'80%',marginBottom:8}}>
          <Text style={{marginBottom:4}}>Digite sua senha para alterar o nome:</Text>
          <TextInput
            style={{borderWidth:1,borderColor:'#ccc',borderRadius:8,padding:8}}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <TouchableOpacity style={{marginTop:8,backgroundColor:themes.colors.primary,padding:8,borderRadius:8}} onPress={async () => {
            if (!password || password.length < 6) {
              Alert.alert('Senha inválida','A senha deve ter pelo menos 6 caracteres.');
              return;
            }
            // Verifica se a senha coincide com a cadastrada
            let usersRaw = await AsyncStorage.getItem('users');
            let users = usersRaw ? JSON.parse(usersRaw) : [];
            let userFound = users.find((u: any) => u.email === (user?.email ?? '') && u.password === password);
            if (!userFound) {
              Alert.alert('Erro','A senha não coincide com a adicionada anteriormente');
              return;
            }
            setShowPasswordPrompt(false);
            setName(pendingName);
            if (onUpdateUser) onUpdateUser({ name: pendingName });
            Alert.alert('Nome alterado','Seu nome foi alterado com sucesso!');
          }}>
            <Text style={{color:'#fff',textAlign:'center'}}>Confirmar alteração</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
