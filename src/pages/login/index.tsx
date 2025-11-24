import React from 'react';
import { Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { style } from './styles';
import Logo from '../../assets/wrath.png';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { themes } from '../../global/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input } from '../../components/input';
import { Button } from '../../components/Button';

type Props = {
    onNavigateToRegister?: () => void,
    onAuthSuccess?: (user: {name:string,email:string}) => void
}

export default function Login({ onNavigateToRegister, onAuthSuccess }: Props) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    async function getLogin() {
        try {
            setLoading(true)

            if (!email || !password) {
                setLoading(false)
                return Alert.alert('Atenção!', 'Por favor, preencha todos os campos.');
            }

            setTimeout(async () => {
                try {
                    // check stored users first
                    const usersRaw = await AsyncStorage.getItem('users');
                    const users = usersRaw ? JSON.parse(usersRaw) : [];
                    const found = users.find((u: any) => u.email === email && u.password === password);
                    if (found) {
                        Alert.alert('Logado com sucesso!');
                        if (onAuthSuccess) onAuthSuccess({name: found.name || 'Usuário', email});
                    } else if (email == 'rc@gmail.com' && password == '123456') {
                        // fallback hardcoded account
                        Alert.alert('Logado com sucesso!');
                        if (onAuthSuccess) onAuthSuccess({name: 'Renan', email});
                    } else {
                        Alert.alert('Usuário não encontrado!');
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
            <View style={style.BoxTop}>
                <Image
                    source={Logo}
                    style={style.logo}
                    resizeMode="contain"
                />
                <Text style={style.One}>Bem-vindo de volta!</Text>
            </View>
            <View style={style.BoxMid}>

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
            <Text style={style.textBottom}>Não tem conta? <Text style={{ color: themes.colors.primary }} onPress={onNavigateToRegister}>Crie agora!</Text></Text>

            {/* Cursos só disponíveis após login */}
        </View>
    );
}