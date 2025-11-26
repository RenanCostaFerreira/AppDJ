import React from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList, TextInput, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { style } from './styles';
import BackButton from '../../components/BackButton';
import { themes } from '../../global/themes';
import { User } from '../../types/user';
import Turma from '../../types/turma';
import { sampleCourses } from '../../data/courses';

type Props = { onBack?: () => void; onClassesUpdated?: () => void };

export default function Admin({ onBack, onClassesUpdated }: Props) {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [showPrompt, setShowPrompt] = React.useState(true);
  const [password, setPassword] = React.useState('');
  // classes (turmas)
  const [classes, setClasses] = React.useState<Turma[]>([]);
  const [classModalVisible, setClassModalVisible] = React.useState(false);
  const [coursePickerVisible, setCoursePickerVisible] = React.useState(false);
  const [editingClass, setEditingClass] = React.useState<Turma | null>(null);
  const [formName, setFormName] = React.useState('');
  const [formCourse, setFormCourse] = React.useState('');
  const [formCourseId, setFormCourseId] = React.useState<string | undefined>(undefined);
  const [formProfessor, setFormProfessor] = React.useState('');
  const [formVacancies, setFormVacancies] = React.useState('');
  const [formSchedule, setFormSchedule] = React.useState('');

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
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('classes');
        const c = raw ? JSON.parse(raw) : [];
        setClasses(c);
      } catch (err) {
        console.warn('Admin: load classes error', err);
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

  async function refreshClasses() {
    try {
      const raw = await AsyncStorage.getItem('classes');
      setClasses(raw ? JSON.parse(raw) : []);
    } catch (err) {
      console.warn('Admin: refresh classes error', err);
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

  async function removeClass(id: string) {
    try {
      const raw = await AsyncStorage.getItem('classes');
      const list = raw ? JSON.parse(raw) : [];
      const updated = list.filter((c: any) => c.id !== id);
      await AsyncStorage.setItem('classes', JSON.stringify(updated));
      setClasses(updated);
      Alert.alert('Turma removida');
      if (typeof onClassesUpdated === 'function') onClassesUpdated();
    } catch (err) {
      Alert.alert('Erro ao remover turma');
    }
  }

  function openNewClassModal() {
    setEditingClass(null);
    setFormName('');
    setFormCourse('');
    setFormCourseId(undefined);
    setFormProfessor('');
    setFormVacancies('');
    setFormSchedule('');
    setClassModalVisible(true);
  }

  function openEditClassModal(t: Turma) {
    setEditingClass(t);
    setFormName(t.name ?? '');
    setFormCourse(t.course ?? '');
    setFormCourseId(t.courseId);
    setFormProfessor(t.professor ?? '');
    setFormVacancies(t.vacancies?.toString() ?? '');
    setFormSchedule(t.schedule ?? '');
    setClassModalVisible(true);
  }

  async function saveClass() {
    if (!formName.trim()) {
      Alert.alert('Informe o nome da turma');
      return;
    }
    const vacancies = parseInt(formVacancies || '0', 10) || 0;
    try {
      const raw = await AsyncStorage.getItem('classes');
      const list: Turma[] = raw ? JSON.parse(raw) : [];
      if (editingClass) {
        const updated = list.map((c) => (c.id === editingClass.id ? { ...c, name: formName, course: formCourse, courseId: formCourseId, professor: formProfessor, vacancies, schedule: formSchedule } : c));
        await AsyncStorage.setItem('classes', JSON.stringify(updated));
        setClasses(updated);
        Alert.alert('Turma atualizada');
        if (typeof onClassesUpdated === 'function') onClassesUpdated();
      } else {
        const id = Date.now().toString();
        const newClass: Turma = { id, name: formName, course: formCourse, courseId: formCourseId, professor: formProfessor, vacancies, schedule: formSchedule, students: [] };
        const updated = [...list, newClass];
        await AsyncStorage.setItem('classes', JSON.stringify(updated));
        setClasses(updated);
        Alert.alert('Turma criada');
        if (typeof onClassesUpdated === 'function') onClassesUpdated();
      }
      setClassModalVisible(false);
    } catch (err) {
      Alert.alert('Erro ao salvar turma');
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
            keyExtractor={(i, idx) => (i.email ? i.email : `${i.name}-${idx}`)}
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
          
          {/* Classes management */}
          <View style={{ marginTop: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '700' }}>Gestão de Turmas</Text>
              <TouchableOpacity onPress={openNewClassModal}>
                <Text style={{ color: themes.colors.primary }}>Nova turma</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 8, borderWidth: 1, borderColor: '#eee', borderRadius: 6, overflow: 'hidden' }}>
              {/* table header */}
              <View style={style.tableHeader}>
                <Text style={{ flex: 2, fontWeight: '700' }}>Turma</Text>
                <Text style={{ flex: 1, fontWeight: '700' }}>Curso</Text>
                <Text style={{ width: 80, textAlign: 'center', fontWeight: '700' }}>Vagas</Text>
                <Text style={{ flex: 1, fontWeight: '700' }}>Professor</Text>
                <Text style={{ flex: 1, fontWeight: '700' }}>Horário</Text>
                <Text style={{ width: 120, textAlign: 'center', fontWeight: '700' }}>Ações</Text>
              </View>
              <FlatList
                data={classes}
                keyExtractor={(c) => c.id}
                ListEmptyComponent={() => <Text style={{ padding: 12, color: '#666' }}>Nenhuma turma cadastrada.</Text>}
                renderItem={({ item }) => (
                  <View style={style.tableRow}>
                    <Text style={{ flex: 2 }}>{item.name}</Text>
                    <Text style={{ flex: 1 }}>{
                      // prefer courseId lookup
                      item.courseId ? (sampleCourses.find(sc => sc.id === item.courseId)?.title ?? item.course ?? '-') : (item.course ?? '-')
                    }</Text>
                    <Text style={style.tableCellSmall}>{item.vacancies}</Text>
                    <Text style={style.tableCell}>{item.professor}</Text>
                    <Text style={style.tableCell}>{item.schedule}</Text>
                    <View style={{ width: 120, textAlign: 'right', flexDirection: 'row', justifyContent: 'flex-end' }}>
                      <TouchableOpacity onPress={() => Alert.alert('Detalhes', `Turma: ${item.name}\nCurso: ${item.course || '-'}\nProfessor: ${item.professor || '-'}\nVagas: ${item.vacancies ?? 0}\nAlunos: ${item.students?.length ?? 0}`)} style={{ marginRight: 12 }}>
                        <Text style={{ color: '#666' }}>Detalhes</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => openEditClassModal(item)} style={{ marginRight: 12 }}>
                        <Text style={{ color: themes.colors.primary }}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => removeClass(item.id)}>
                        <Text style={{ color: '#ff3b30' }}>Remover</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>

            <TouchableOpacity onPress={refreshClasses} style={{ marginTop: 12 }}>
              <Text style={{ color: themes.colors.primary }}>Atualizar turmas</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Class modal form */}
      <Modal visible={classModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: '90%', maxWidth: 480, backgroundColor: '#fff', padding: 16, borderRadius: 8 }}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>{editingClass ? 'Editar Turma' : 'Nova Turma'}</Text>
            <TextInput value={formName} onChangeText={setFormName} placeholder="Nome da turma" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginBottom: 8 }} />
            <TouchableOpacity onPress={() => setCoursePickerVisible(prev => !prev)} style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginBottom: 8 }}>
              <Text>{formCourse || 'Selecionar curso'}</Text>
            </TouchableOpacity>
            {coursePickerVisible && (
              <ScrollView style={{ maxHeight: 160, borderWidth: 1, borderColor: '#eee', marginBottom: 8 }}>
                {sampleCourses.map(c => (
                  <TouchableOpacity key={c.id} style={{ padding: 8 }} onPress={() => { setFormCourseId(c.id); setFormCourse(c.title); setCoursePickerVisible(false); }}>
                    <Text style={{ color: c.id === formCourseId ? themes.colors.primary : '#333' }}>{c.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            <TextInput value={formProfessor} onChangeText={setFormProfessor} placeholder="Professor" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginBottom: 8 }} />
            <TextInput value={formVacancies} onChangeText={setFormVacancies} placeholder="Vagas" keyboardType="numeric" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginBottom: 8 }} />
            <TextInput value={formSchedule} onChangeText={setFormSchedule} placeholder="Horário" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginBottom: 12 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setClassModalVisible(false)} style={{ marginRight: 8 }}>
                <Text style={{ color: '#999' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveClass}>
                <Text style={{ color: themes.colors.primary, fontWeight: '700' }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
