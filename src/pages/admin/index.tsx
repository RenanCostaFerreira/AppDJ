import React from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList, TextInput, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { style } from './styles';
import BackButton from '../../components/BackButton';
import { style as inputStyle } from '../../components/input/style';
import LayoutToggle from '../../components/LayoutToggle';
import { useLayout } from '../../global/LayoutContext';
import { themes } from '../../global/themes';
import { User } from '../../types/user';
import { Course } from '../../types/course';
import Turma from '../../types/turma';
import { sampleCourses } from '../../data/courses';

type Props = { onBack?: () => void; onClassesUpdated?: () => void; usersVersion?: number };

export default function Admin({ onBack, onClassesUpdated, usersVersion }: Props) {
  const { mode } = useLayout();
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [showPrompt, setShowPrompt] = React.useState(true);
  const [password, setPassword] = React.useState('');
  // classes (turmas)
  const [classes, setClasses] = React.useState<Turma[]>([]);
  const [classModalVisible, setClassModalVisible] = React.useState(false);
  // legacy inline picker removed - use courseSelectModalVisible instead
  const [courseSelectModalVisible, setCourseSelectModalVisible] = React.useState(false);
  // course list modal removed: using inline showCourses instead
  const [showCourses, setShowCourses] = React.useState(false);
  const [editingClass, setEditingClass] = React.useState<Turma | null>(null);
  const [formName, setFormName] = React.useState('');
  const [formCourse, setFormCourse] = React.useState('');
  const [formCourseId, setFormCourseId] = React.useState<string | undefined>(undefined);
  const [formProfessor, setFormProfessor] = React.useState('');
  const [formVacancies, setFormVacancies] = React.useState('');
  const [formSchedule, setFormSchedule] = React.useState('');
  const [candidateModalVisible, setCandidateModalVisible] = React.useState(false);
  const [selectedClassForCandidates, setSelectedClassForCandidates] = React.useState<Turma | null>(null);

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

  // refresh users list when usersVersion changes
  React.useEffect(() => {
    if (typeof usersVersion !== 'undefined') refreshUsers();
  }, [usersVersion]);

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

  async function removeStudentFromClass(classId: string, studentEmail: string) {
    try {
      const raw = await AsyncStorage.getItem('classes');
      const list: Turma[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex(c => c.id === classId);
      if (idx === -1) return;
      const turma = list[idx];
      turma.students = (turma.students || []).filter(s => s !== studentEmail);
      // restore a vacancy
      turma.vacancies = (turma.vacancies ?? 0) + 1;
      list[idx] = turma;
      await AsyncStorage.setItem('classes', JSON.stringify(list));
      setClasses(list);
      // update selected class reference if open
      if (selectedClassForCandidates && selectedClassForCandidates.id === classId) {
        setSelectedClassForCandidates(list[idx]);
      }
      Alert.alert('Aluno removido', `${studentEmail} removido da turma.`);
      if (typeof onClassesUpdated === 'function') onClassesUpdated();
    } catch (err) {
      Alert.alert('Erro ao remover aluno');
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

  function openNewClassModalWithCourse(c: Course) {
    setEditingClass(null);
    setFormName('');
    setFormCourse(c.title);
    setFormCourseId(c.id);
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
      <View style={{ position: 'absolute', right: 12, top: 36 }}>
        <LayoutToggle />
      </View>
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
                <View style={style.userBox}> 
                  <View style={style.userBoxRounded}> 
                    <View style={style.userBoxRow}>
                      <View style={style.userBoxLeft}>
                        <Text style={style.userBoxText}>{item.name}</Text>
                        <Text style={style.userBoxSub}>{item.email}{item.cpf ? ` — CPF: ${item.cpf}` : ''}</Text>
                      </View>
                      <View style={style.userBoxActions}>
                        <TouchableOpacity onPress={() => Alert.alert('Ação', 'Implementar editar usuário')} style={{ marginRight: 12 }}>
                          <Text style={{ color: themes.colors.primary }}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => removeUser(item.email)}>
                          <Text style={{ color: '#ff3b30' }}>Remover</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => setShowCourses(!showCourses)}>
                  <Text style={{ color: themes.colors.primary }}>{showCourses ? 'Ocultar cursos' : 'Ver cursos'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ marginTop: 8, borderWidth: 1, borderColor: '#eee', borderRadius: 6, overflow: 'hidden' }}>
              {/* table header */}
              {/* Use a more mobile-friendly list (cards) */}
              <FlatList
                data={classes}
                keyExtractor={(c) => c.id}
                ListEmptyComponent={() => <Text style={{ padding: 12, color: '#666' }}>Nenhuma turma cadastrada.</Text>}
                renderItem={({ item }) => (
                    <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
                      <Text style={{ fontWeight: '700' }}>{item.name}</Text>
                      <Text style={{ color: '#666' }}>{item.courseId ? (sampleCourses.find(sc => sc.id === item.courseId)?.title ?? item.course ?? '-') : (item.course ?? '-')}</Text>
                      <View style={{ flexDirection: 'row', marginTop: 8, justifyContent: 'space-between' }}>
                        <Text style={{ color: '#666' }}>{item.professor ?? '-'}</Text>
                        <Text style={{ color: '#666' }}>{item.schedule ?? '-'}</Text>
                        <Text style={{ color: '#666' }}>{(item.vacancies ?? 0) <= 0 ? 'Sem vagas' : `Vagas: ${item.vacancies ?? 0}`} • Matriculados: {item.students?.length ?? 0}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                        <TouchableOpacity onPress={() => { setSelectedClassForCandidates(item); setCandidateModalVisible(true); }} style={{ marginRight: 12 }}>
                          <Text style={{ color: '#666' }}>Candidatos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Alert.alert('Detalhes', `Turma: ${item.name}\nCurso: ${item.course || '-'}\nProfessor: ${item.professor || '-'}\n${(item.vacancies ?? 0) <= 0 ? 'Sem vagas' : `Vagas: ${item.vacancies ?? 0}`}\nAlunos: ${item.students?.length ?? 0}`)} style={{ marginRight: 12 }}>
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

            {showCourses && (
              <View style={{ marginTop: 24 }}>
                <Text style={{ fontWeight: '700', marginBottom: 8 }}>Cursos</Text>
                <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ paddingVertical: 6 }} nestedScrollEnabled>
                  {sampleCourses.map(item => (
                    <View key={item.id} style={{ padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 6, marginBottom: 8, backgroundColor: '#fff' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontWeight: '700' }}>{item.title}</Text>
                          <Text style={{ color: '#666' }}>{item.short}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <TouchableOpacity onPress={() => Alert.alert('Curso', item.description ?? item.title)} style={{ marginRight: 12 }}>
                            <Text style={{ color: '#666' }}>Detalhes</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => { openNewClassModalWithCourse(item); }}>
                            <Text style={{ color: themes.colors.primary }}>Criar turma</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </>
      )}

      {/* Class modal form */}
      <Modal visible={classModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 12 }}>
            <View style={{ width: '100%', maxWidth: 640, backgroundColor: '#fff', padding: 16, borderRadius: 8 }}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>{editingClass ? 'Editar Turma' : 'Nova Turma'}</Text>
            <ScrollView contentContainerStyle={{ paddingBottom: 8 }}>
            <TextInput value={formName} onChangeText={setFormName} placeholder="Nome da turma" style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 8, width: '100%' }} />
            <TouchableOpacity onPress={() => setCourseSelectModalVisible(true)} style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 8, width: '100%' }}>
              <Text>{formCourse || 'Selecionar curso'}</Text>
            </TouchableOpacity>
            <Modal visible={courseSelectModalVisible} transparent animationType="slide">
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: '#fff', padding: 12, borderTopLeftRadius: 12, borderTopRightRadius: 12, maxHeight: '60%' }}>
                  <Text style={{ fontWeight: '700', marginBottom: 8 }}>Selecione o curso</Text>
                  <ScrollView>
                    {sampleCourses.map(c => (
                      <TouchableOpacity key={c.id} style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' }} onPress={() => { setFormCourseId(c.id); setFormCourse(c.title); setCourseSelectModalVisible(false); }}>
                        <Text style={{ color: c.id === formCourseId ? themes.colors.primary : '#333' }}>{c.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={() => setCourseSelectModalVisible(false)} style={{ marginTop: 12, alignItems: 'center' }}>
                    <Text style={{ color: themes.colors.primary }}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <TextInput value={formProfessor} onChangeText={setFormProfessor} placeholder="Professor" style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 8, width: '100%' }} />
            <TextInput value={formVacancies} onChangeText={setFormVacancies} placeholder="Vagas" keyboardType="numeric" style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 8, width: '100%' }} />
            <TextInput value={formSchedule} onChangeText={setFormSchedule} placeholder="Horário" style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12, width: '100%' }} />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => setClassModalVisible(false)} style={{ marginRight: 8 }}>
                <Text style={{ color: '#999' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveClass}>
                <Text style={{ color: themes.colors.primary, fontWeight: '700' }}>Salvar</Text>
              </TouchableOpacity>
              </View>
            </View>
            </ScrollView>
          </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* Course list modal */}
            {/* Course list inline: controlled by showCourses */}

      {/* Candidates modal */}
      <Modal visible={candidateModalVisible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', padding: 12, borderTopLeftRadius: 12, borderTopRightRadius: 12, maxHeight: '70%' }}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>Candidatos</Text>
            <ScrollView>
              {(selectedClassForCandidates?.students || []).length === 0 ? (
                <Text style={{ color: '#666', paddingTop: 8 }}>Nenhum candidato inscrito.</Text>
              ) : (
                (selectedClassForCandidates?.students || []).map((sEmail) => {
                  const user = users.find(u => u.email === sEmail);
                  return (
                    <View key={sEmail} style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View>
                        <Text style={{ fontWeight: '700' }}>{user?.name ?? sEmail}</Text>
                        <Text style={{ color: '#666' }}>{sEmail}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ marginRight: 12 }} onPress={() => { Alert.alert('Perfil', user ? `${user.name}\n${user.email}` : sEmail); }}>
                          <Text style={{ color: '#666' }}>Ver</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                          Alert.alert('Remover aluno', `Remover ${sEmail} da turma?`, [
                            { text: 'Cancelar', style: 'cancel' },
                            { text: 'Remover', style: 'destructive', onPress: () => { if (selectedClassForCandidates) removeStudentFromClass(selectedClassForCandidates.id, sEmail); } }
                          ]);
                        }}>
                          <Text style={{ color: '#ff3b30' }}>Remover</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
            <TouchableOpacity onPress={() => { setCandidateModalVisible(false); setSelectedClassForCandidates(null); }} style={{ marginTop: 12, alignItems: 'center' }}>
              <Text style={{ color: themes.colors.primary }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// (function moved into component scope)
            