import React from 'react';
import { Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { style } from './styles';
import Logo from '../../assets/wrath.png';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { onlyDigits, formatCPF } from '../../utils/cpf';
import { themes } from '../../global/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input } from '../../components/input';
import BackButton from '../../components/BackButton';
// safe digits helper for optional fields
function safeDigits(v?: string) { return (v ?? '').replace(/\D/g, ''); }
import { User } from '../../types/user';
import { Button } from '../../components/Button';

type Props = {
    initialMode?: 'form' | 'select',
    loginRole?: 'funcionario' | 'responsavel' | 'aluno',
    onNavigateToRegister?: (role?: 'funcionario' | 'responsavel' | 'aluno') => void,
    onAuthSuccess?: (user: User) => void
    onBack?: () => void
}

export default function Login({ initialMode = 'form', loginRole, onNavigateToRegister, onAuthSuccess, onOpenAdmin, onBack }: Props & { onOpenAdmin?: () => void }) {
    const [email, setEmail] = React.useState('');
    const [cpf, setCpf] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    async function getLogin() {
        try {
            setLoading(true)

            const typedCpf = onlyDigits(cpf);
            const typedEmail = (email ?? '').toLowerCase();

            if (loginRole === 'responsavel') {
                if (!cpf || !password) {
                    setLoading(false);
                    Alert.alert('Atenção!', 'Por favor, preencha CPF e senha.');
                    return;
                }
                // require a completed CPF (11 digits)
                if (typedCpf.length < 11) {
                    setLoading(false);
                    Alert.alert('Atenção!', 'Por favor, informe o CPF completo (11 dígitos).');
                    return;
                }
            } else {
                if (!email || !password) {
                    setLoading(false);
                    Alert.alert('Atenção!', 'Por favor, preencha todos os campos.');
                    return;
                }
            }

            setTimeout(async () => {
                try {
                    // check stored users first
                                        const usersRaw = await AsyncStorage.getItem('users');
                                        const users = usersRaw ? JSON.parse(usersRaw) : [];
                                        console.log('Login attempt', { loginRole, typedCpf, typedEmail, password, usersCount: users.length });
                                        // find a user by role+cpf first, then fallback to any user with matching cpf or email
                                        let found: any = null;
                                        if (loginRole === 'responsavel') {
                                            // primary: correct role + cpf
                                            found = users.find((u: any) => u.role === loginRole && safeDigits(u.cpf) === typedCpf && (u.password ?? '') === password);
                                            if (!found) {
                                                // fallback 1: any role with matching CPF
                                                found = users.find((u: any) => safeDigits(u.cpf) === typedCpf && (u.password ?? '') === password);
                                            }
                                            if (!found) {
                                                // fallback 2: try email+password
                                                found = users.find((u: any) => (u.email ?? '').toLowerCase() === typedEmail && (u.password ?? '') === password);
                                            }
                                        } else if (loginRole === 'aluno') {
                                            // primary: correct role + email
                                            found = users.find((u: any) => u.role === loginRole && (u.email ?? '').toLowerCase() === typedEmail && (u.password ?? '') === password);
                                            if (!found) {
                                                // fallback: any role with matching email
                                                found = users.find((u: any) => (u.email ?? '').toLowerCase() === typedEmail && (u.password ?? '') === password);
                                            }
                                        } else {
                                            // default: email+password
                                            found = users.find((u: any) => (u.email ?? '').toLowerCase() === typedEmail && (u.password ?? '') === password);
                                        }
                                        console.log('Login found:', found);
                    if (found) {
                        Alert.alert('Logado com sucesso!');
                        if (onAuthSuccess) onAuthSuccess(found as User);
                    } else if (email == 'rc@gmail.com' && password == '123456') {
                        // fallback hardcoded account
                        Alert.alert('Logado com sucesso!');
                        if (onAuthSuccess) onAuthSuccess({name: 'Rc', email});
                    } else {
                        // Provide more specific feedback: if responsavel tried CPF and found a user with CPF
                        if (loginRole === 'responsavel') {
                            const cpfMatch = users.find((u: any) => safeDigits(u.cpf) === typedCpf);
                            if (cpfMatch) {
                                Alert.alert('Erro', 'CPF encontrado, porém a senha está incorreta.');
                            } else {
                                Alert.alert('Usuário não encontrado!');
                            }
                        } else {
                            // For students and others, check email
                            const emailMatch = users.find((u: any) => (u.email ?? '').toLowerCase() === typedEmail);
                            if (emailMatch) {
                                Alert.alert('Erro', 'E-mail encontrado, porém a senha está incorreta.');
                            } else {
                                Alert.alert('Usuário não encontrado!');
                            }
                        }
                    }
                } catch (err) {
                    console.log('login check error', err);
                    Alert.alert('Erro', 'Ocorreu um erro ao fazer login.');
                }
                setLoading(false)
            }, 1500)


        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    return (
        <View style={style.container}>
            <BackButton onPress={() => onBack && onBack()} style={{ position: 'absolute', left: 12, top: 36, zIndex: 40 }} />
            <TouchableOpacity onPress={() => onOpenAdmin && onOpenAdmin()} style={{ position: 'absolute', right: 12, top: 36, zIndex: 40 }}>
                <Text style={{ color: themes.colors.primary, fontWeight: '700' }}>ADM</Text>
            </TouchableOpacity>
            <View style={style.BoxTop}>
                <Image
                    source={Logo}
                    style={style.logo}
                    resizeMode="contain"
                />
                <Text style={style.One}>Bem-vindo de volta!</Text>
                {loginRole && (
                    <Text style={{ color: '#666', marginTop: 6 }}>{loginRole === 'aluno' ? 'Entrar como Estudante' : loginRole === 'responsavel' ? 'Entrar como Responsável' : loginRole === 'funcionario' ? 'Entrar como Funcionário' : ''}</Text>
                )}
            </View>
            <View style={style.BoxMid}>

                {loginRole === 'responsavel' ? (
                    <Input
                        value={formatCPF(cpf)}
                        onChangeText={t => setCpf(onlyDigits(t).slice(0,11))}
                        title='CPF'
                        keyboardType='number-pad'
                        maxLength={14}
                    />
                ) : (
                    <Input
                        value={email}
                        onChangeText={setEmail}
                        title='Endereço de E-mail'

                        IconRigth={MaterialIcons}
                        IconRigthName="email"
                    />
                )}

                <Input
                    value={password}
                    onChangeText={setPassword}
                    title='Senha'
                    IconRigth={Octicons}
                    IconRigthName={showPassword ? "eye-closed" : "eye"}
                    secureTextEntry={showPassword}
                    onIconRigthPress={() => setShowPassword(!showPassword)}
                />

            </View>
            <View style={style.BoxBotton}>
                <Button 
                    text='Entrar'
                    loading={loading}
                    onPress={getLogin}
                />
            </View>
            {loginRole === 'responsavel' || loginRole === 'aluno' ? (
                <Text style={[style.textBottom, {fontSize: 14}]}>Não tem conta? <Text style={{ color: themes.colors.primary }} onPress={() => onNavigateToRegister && onNavigateToRegister(loginRole)}>{' '}Crie agora!</Text></Text>
            ) : (
                <Text style={style.textBottom}>Não tem conta? <Text style={{ color: themes.colors.primary }} onPress={() => onNavigateToRegister && onNavigateToRegister()}> Crie agora!</Text></Text>
            )}

            {/* Cursos só disponíveis após login */}
        </View>
    );
}