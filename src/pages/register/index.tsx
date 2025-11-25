import React from 'react';
import { View, Text, Image, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { style } from './styles';
import Logo from '../../assets/wrath.png';
import { Input } from '../../components/input';
import { onlyDigits, formatCPF, validateCPF } from '../../utils/cpf';
import { Button } from '../../components/Button';
import { Octicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes } from '../../global/themes';
import { User } from '../../types/user';
type Props = {
    onNavigateToLogin?: () => void,
    onAuthSuccess?: (user: User) => void,
    role?: 'funcionario' | 'responsavel' | 'aluno'
}

export default function Register({ onNavigateToLogin, onAuthSuccess, role }: Props) {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [cpf, setCpf] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [nameError, setNameError] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');
    const [cpfError, setCpfError] = React.useState('');
    // CPF specific field for 'responsavel'

    
    async function handleRegister() {
        try {
            setLoading(true);

            setNameError('');
            setPasswordError('');
            if (!name || !email || !password || !confirmPassword || ((role === 'responsavel' || role === 'aluno') && !cpf)) {
                setLoading(false);
                Alert.alert('Atenção!', 'Por favor, preencha todos os campos.');
                return;
            }

            if (name.length < 10) {
                setLoading(false);
                setNameError('Nome muito curto, mínimo 10 caracteres');
                Alert.alert('Nome inválido!', 'Nome muito curto, mínimo 10 caracteres');
                return;
            }
            if (name.length > 100) {
                setLoading(false);
                setNameError('Nome muito longo, máximo 100 caracteres');
                Alert.alert('Nome inválido!', 'Nome muito longo, máximo 100 caracteres');
                return;
            }

            if (password.length < 6) {
                setLoading(false);
                setPasswordError('Senha muito curta, mínimo 6 caracteres');
                Alert.alert('Senha inválida!', 'Senha muito curta, mínimo 6 caracteres');
                return;
            }
            if (password.length > 15) {
                setLoading(false);
                setPasswordError('Senha muito longa, máximo 15 caracteres');
                Alert.alert('Senha inválida!', 'Senha muito longa, máximo 15 caracteres');
                return;
            }

            if (password !== confirmPassword) {
                setLoading(false);
                setPasswordError('As senhas não coincidem');
                Alert.alert('Atenção!', 'As senhas não coincidem.');
                return;
            }

            // CPF validation for responsavel and aluno (using checksum)
            if ((role === 'responsavel' || role === 'aluno' || cpf.length <11)) {
                const digits = onlyDigits(cpf);
                if (!validateCPF(digits)) {
                    setLoading(false);
                    setCpfError('CPF inválido');
                    Alert.alert('CPF inválido', 'Por favor, informe um CPF válido.');
                    return;
                }
                setCpfError('');
            }

            // Simula chamada de API
            setTimeout(async () => {
                // save user locally
                let createdUser: any = null;
                try {
                    const usersRaw = await AsyncStorage.getItem('users');
                    const users = usersRaw ? JSON.parse(usersRaw) : [];
                    // store role and cpf if available
                    const userObj: any = { name, email, password };
                    if (role) userObj.role = role;
                    if ((role === 'responsavel' || role === 'aluno') && cpf) userObj.cpf = cpf;
                    users.push(userObj);
                    createdUser = userObj;
                    await AsyncStorage.setItem('users', JSON.stringify(users));
                } catch (err) {
                    console.log('Error saving user', err);
                }

                setLoading(false);
                Alert.alert('Sucesso', 'Usuário criado com sucesso!');
                // navegar direto para cursos após registro (autentica o usuário)
                    if (onAuthSuccess) {
                    onAuthSuccess(createdUser as User);
                } else if (onNavigateToLogin) {
                    onNavigateToLogin();
                }
            }, 2000);

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const roleLabel = role === 'aluno' ? 'Estudante' : role === 'funcionario' ? 'Servidor' : role === 'responsavel' ? 'Responsável' : '';

    return (
        <View style={style.container}>
            <TouchableOpacity onPress={onNavigateToLogin} style={localStyles.backButton}>
                <Text style={localStyles.backIcon}>{'‹'}</Text>
            </TouchableOpacity>
            <View style={style.BoxTop}>
                <Image source={Logo} style={style.logo} resizeMode="contain" />
                <Text style={style.One}>{roleLabel ? `Cadastro — ${roleLabel}` : 'Crie sua conta'}</Text>
            </View>

            <View style={style.BoxMid}>
                <Input
                    value={name}
                    onChangeText={setName}
                    title='Nome completo'
                />
                {nameError ? <Text style={{ color: 'red', marginBottom: 8 }}>{nameError}</Text> : null}

                <Input
                    value={email}
                    onChangeText={setEmail}
                    title='Endereço de E-mail'
                    IconRigth={MaterialIcons}
                    IconRigthName="email"
                />

                {(role === 'responsavel' || role === 'aluno') && (
                    <>
                        <Input
                            value={formatCPF(cpf)}
                            onChangeText={t => setCpf(onlyDigits(t).slice(0,11))}
                            title='CPF'
                            keyboardType='number-pad'
                            maxLength={14}
                        />
                        {cpfError ? <Text style={{ color: 'red', marginBottom: 8 }}>{cpfError}</Text> : null}
                    </>
                )}

                <Input
                    value={password}
                    onChangeText={setPassword}
                    title='Senha'
                    IconRigth={Octicons}
                    IconRigthName={showPassword ? 'eye-closed' : 'eye'}
                    secureTextEntry={showPassword}
                    onIconRigthPress={() => setShowPassword(!showPassword)}
                />
                <Input
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    title='Confirmar Senha'
                    secureTextEntry={showPassword}
                />
                {passwordError ? <Text style={{ color: 'red', marginBottom: 8 }}>{passwordError}</Text> : null}
            </View>

            <View style={style.BoxBotton}>
                <Button
                    text='Criar conta'
                    loading={loading}
                    onPress={handleRegister}
                />
            </View>


            {/* Cursos só disponíveis após login */}
        </View>
    );
}

const localStyles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 18,
        left: 12,
        zIndex: 20,
        padding: 8,
        backgroundColor: 'transparent'
    },
    backIcon: {
        fontSize: 28,
        color: '#666'
    }
});
