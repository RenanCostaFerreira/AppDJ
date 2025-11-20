import React from 'react';

import {
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { style } from './styles';
import Logo from '../../assets/wrath.png';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { themes } from '../../global/themes';
import { Input } from '../../components/input';
import { Button } from '../../components/Button';
export default function Login() {
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

            setTimeout(() => {
                if (email == 'ren.dark12@gmail.com' && password == '123456') {
                    Alert.alert('Logado com sucesso!');
                } else {
                    Alert.alert('Usuario não encontrado!');
                }
                setLoading(false)
            }, 3000)


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
            <Text style={style.textBottom}>Não tem conta? <Text style={{ color: themes.colors.primary }}>Crie agora!</Text></Text>
        </View>
    )
}