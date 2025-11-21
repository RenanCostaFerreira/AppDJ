import React from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { style } from './styles';
import Logo from '../../assets/wrath.png';
import { Input } from '../../components/input';
import { Button } from '../../components/Button';
import { Octicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes } from '../../global/themes';

type Props = {
    onNavigateToLogin?: () => void,
    onAuthSuccess?: (user: {name:string,email:string}) => void
}

export default function Register({ onNavigateToLogin, onAuthSuccess }: Props) {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    async function handleRegister() {
        try {
            setLoading(true);

            if (!name || !email || !password || !confirmPassword) {
                setLoading(false);
                return Alert.alert('Atenção!', 'Por favor, preencha todos os campos.');
            }

            if (password !== confirmPassword) {
                setLoading(false);
                return Alert.alert('Atenção!', 'As senhas não coincidem.');
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

    return (
        <View style={style.container}>
            <View style={style.BoxTop}>
                <Image
                    source={Logo}
                    style={style.logo}
                    resizeMode="contain"
                />
                <Text style={style.One}>Crie sua conta</Text>
            </View>

            <View style={style.BoxMid}>
                <Input
                    value={name}
                    onChangeText={setName}
                    title='Nome completo'
                />

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
if (password == setConfirmPassword) {
    
}
                <Input
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    title='Confirmar Senha'
                    secureTextEntry={showPassword}
                />
            </View>

            <View style={style.BoxBotton}>
                <Button
                    text='Criar conta'
                    loading={loading}
                    onPress={handleRegister}
                />
            </View>

            <Text style={style.textBottom}>Já tem conta? <Text style={{ color: themes.colors.primary }} onPress={onNavigateToLogin}>Entrar</Text></Text>

            {/* Cursos só disponíveis após login */}
        </View>
    );
}
