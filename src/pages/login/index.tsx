import React from 'react';
import { Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { style } from './styles';
import Logo from '../../assets/wrath.png';
import { themes } from '../../global/themes';
import { loginUser, saveAuth } from '../../api';

type Props = {
    onNavigateToRegister?: (role?: 'funcionario' | 'responsavel' | 'aluno') => void,
    onAuthSuccess?: (user: { name: string; email: string }) => void
    initialMode?: 'select' | 'form'
}

export default function Login({ onNavigateToRegister, onAuthSuccess, initialMode }: Props) {
    const [mode, setMode] = React.useState<'select' | 'form'>(initialMode ?? 'select');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    async function handleLogin() {
        if (!email || !password) return Alert.alert('Atenção', 'Preencha email e senha');
        setLoading(true);
        try {
            const res = await loginUser({ email, password });
            if (res && (res.token || res.ok)) {
                await saveAuth(res);
                const user = res.user ?? { name: (res as any).name ?? email, email };
                if (onAuthSuccess) onAuthSuccess(user);
            } else {
                Alert.alert('Erro', res?.message ?? 'Credenciais inválidas');
            }
        } catch (err: any) {
            console.error('login error', err);
            Alert.alert('Erro', err?.message ?? 'Erro ao conectar');
        } finally {
            setLoading(false);
        }
    }

    if (mode === 'select') {
        return (
            <View style={style.container}>
                <View style={style.BoxTop}>
                    <Image source={Logo} style={style.logo} resizeMode="contain" />
                    <Text style={style.One}>Bem-vindo</Text>
                </View>

                <View style={style.BoxBottonReduced}>
                    <Text style={style.textBottom}>Escolha o tipo de cadastro:</Text>
                    <View style={style.roleCards}>
                        <TouchableOpacity style={style.roleCard} onPress={() => setMode('form')}>
                            <View style={style.roleCardLeft}>
                                <Text style={style.roleCardLabel}>Sou</Text>
                                <Text style={style.roleCardTitle}>Estudante</Text>
                            </View>
                            <View style={style.roleCardRight}>
                                <Text style={style.roleCardArrow}>›</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={style.roleCard} onPress={() => onNavigateToRegister && onNavigateToRegister('funcionario')}>
                            <View style={style.roleCardLeft}>
                                <Text style={style.roleCardLabel}>Sou</Text>
                                <Text style={style.roleCardTitle}>Servidor</Text>
                                <Text style={style.govBadge}>acesso via GOV.BR</Text>
                            </View>
                            <View style={style.roleCardRight}>
                                <Text style={style.roleCardArrow}>›</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={style.roleCard} onPress={() => onNavigateToRegister && onNavigateToRegister('responsavel')}>
                            <View style={style.roleCardLeft}>
                                <Text style={style.roleCardLabel}>Sou</Text>
                                <Text style={style.roleCardTitle}>Responsável</Text>
                            </View>
                            <View style={style.roleCardRight}>
                                <Text style={style.roleCardArrow}>›</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <TouchableOpacity onPress={() => setMode('select')} style={localStyles.backButton}>
                <Text style={localStyles.backIcon}>{'‹'}</Text>
            </TouchableOpacity>

            <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Text style={{ fontSize: 22, marginBottom: 12 }}>Entrar</Text>
            </View>

            <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
                <Text style={{ marginBottom: 6 }}>E-mail</Text>
                <TextInput value={email} onChangeText={setEmail} placeholder="seu@email.com" style={localStyles.input} keyboardType="email-address" />
                <Text style={{ marginBottom: 6, marginTop: 12 }}>Senha</Text>
                <TextInput value={password} onChangeText={setPassword} placeholder="Senha" secureTextEntry style={localStyles.input} />

                <TouchableOpacity style={[localStyles.button, { backgroundColor: themes.colors.primary }]} onPress={handleLogin} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff' }}>Entrar</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={{ marginTop: 12 }} onPress={() => onNavigateToRegister && onNavigateToRegister()}>
                    <Text style={{ color: themes.colors.primary, textAlign: 'center' }}>Não tem conta? Crie agora!</Text>
                </TouchableOpacity>
            </View>
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
    backIcon: { fontSize: 28, color: '#666' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, backgroundColor: '#fff' },
    button: { marginTop: 16, padding: 12, borderRadius: 8, alignItems: 'center' }
});