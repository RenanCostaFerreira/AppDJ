import React from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { style } from './styles';
import BackButton from '../../components/BackButton';
import { themes } from '../../global/themes';
import { User } from '../../types/user';

type Props = { onBack?: () => void };

export default function Admin({ onBack }: Props) {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [showPrompt, setShowPrompt] = React.useState(true);
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('users');
        const u = raw ? JSON.parse(raw) : [];
        setUsers(u);
      } catch (err) {
        console.warn('Admin: load users error', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function refreshUsers() {
    try {
      const raw = await AsyncStorage.getItem('users');
      setUsers(raw ? JSON.parse(raw) : []);
    } catch (err) {
      console.warn('Admin: refresh users error', err);
    }
  }

  async function removeUser(email: string) {
    try {
      const raw = await AsyncStorage.getItem('users');
      const users = raw ? JSON.parse(raw) : [];
      const updated = users.filter((u: any) => u.email !== email);
      await AsyncStorage.setItem('users', JSON.stringify(updated));
      setUsers(updated);
      Alert.alert('Usuário removido');
    } catch (err) {
      Alert.alert('Erro ao remover usuário');
    }
  }

  function onCheckPassword() {
    // simple default password: admin123 (consider better config)
    if (password === 'admin123') {
      setAuthenticated(true);
      setShowPrompt(false);
    } else {
      Alert.alert('Senha incorreta', 'Senha de administrador inválida');
    }
  }

  return (
    <View style={[{ flex: 1, padding: 20, backgroundColor: '#fff' }]}>
      <BackButton onPress={() => onBack && onBack()} label="Voltar" />
      <Text style={{ fontSize: 22, fontWeight: '700', color: themes.colors.primary, marginTop: 8 }}>Admin</Text>
      <Text style={{ color: '#666', marginBottom: 12 }}>Painel administrativo</Text>

      <Modal visible={showPrompt} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: '90%', maxWidth: 480, backgroundColor: '#fff', padding: 16, borderRadius: 8 }}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>Senha de administrador</Text>
            <TextInput value={password} onChangeText={setPassword} placeholder="Digite a senha" secureTextEntry style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginBottom: 12 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setShowPrompt(false)} style={{ marginRight: 8 }}>
                <Text style={{ color: '#999' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onCheckPassword}>
                <Text style={{ color: themes.colors.primary, fontWeight: '700' }}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {!authenticated ? (
        <Text style={{ color: '#999', marginTop: 12 }}>Área administrativa protegida. Faça login para acessar as funcionalidades.</Text>
      ) : (
        <>
          <Text style={{ fontWeight: '700', marginTop: 12 }}>Usuários cadastrados</Text>
          <FlatList
            data={users}
            keyExtractor={(i) => (i.email ?? i.name ?? Math.random()).toString()}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontWeight: '700' }}>{item.name}</Text>
                  <Text style={{ color: '#666' }}>{item.email} {item.cpf ? ` — CPF: ${item.cpf}` : ''}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => Alert.alert('Ação', 'Implementar editar usuário')} style={{ marginRight: 8 }}>
                    <Text style={{ color: themes.colors.primary }}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeUser(item.email)}>
                    <Text style={{ color: '#ff3b30' }}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <TouchableOpacity onPress={refreshUsers} style={{ marginTop: 12 }}>
            <Text style={{ color: themes.colors.primary }}>Atualizar lista</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
