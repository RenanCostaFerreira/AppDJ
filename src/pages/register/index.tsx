import React from 'react';
import { View, Text, Image, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { style } from './styles';
import Logo from '../../assets/wrath.png';
import { Input } from '../../components/input';
import { Button } from '../../components/Button';
import { Octicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes } from '../../global/themes';
type Props = {
    onNavigateToLogin?: () => void,
    onAuthSuccess?: (user: {name:string,email:string}) => void,
    role?: 'funcionario' | 'responsavel' | 'aluno'
}

export default function Register({ onNavigateToLogin, onAuthSuccess, role }: Props) {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [nameError, setNameError] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');
    const [cpf, setCpf] = React.useState('');

    
    async function handleRegister() {
        try {
            setLoading(true);

            setNameError('');
            setPasswordError('');
            if (!name || !email || !password || !confirmPassword) {
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

            // Simula chamada de API
            setTimeout(async () => {
                // save user locally
                try {
                    const usersRaw = await AsyncStorage.getItem('users');
                    const users = usersRaw ? JSON.parse(usersRaw) : [];
                    users.push({ name, email, password });
                    await AsyncStorage.setItem('users', JSON.stringify(users));
                } catch (err) {
                    console.log('Error saving user', err);
                }

                setLoading(false);
                Alert.alert('Sucesso', 'Usuário criado com sucesso!');
                // navegar direto para cursos após registro (autentica o usuário)
                if (onAuthSuccess) {
                    onAuthSuccess({ name, email });
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
