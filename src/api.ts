import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_BASE = `http://${HOST}:3000`;

type AuthResponse = { token?: string; user?: any; message?: string; ok?: boolean };

export async function loginUser(payload: { email: string; password: string }): Promise<AuthResponse> {
	try {
		const resp = await fetch(`${API_BASE}/api/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});
		if (!resp.ok) {
			const txt = await resp.text();
			return { message: txt };
		}
		return resp.json();
	} catch (err) {
		try {
			const usersRaw = await AsyncStorage.getItem('users');
			const users = usersRaw ? JSON.parse(usersRaw) : [];
			const found = users.find((u: any) => u.email === payload.email && u.password === payload.password);
			if (found) return { ok: true, user: { name: found.name, email: found.email }, token: 'local-fake-token' };
			return { message: 'Credenciais inválidas' };
		} catch (e) {
			return { message: 'Erro ao autenticar localmente' };
		}
	}
}

export async function saveAuth(data: any) {
	try {
		await AsyncStorage.setItem('auth', JSON.stringify(data));
	} catch (e) {
		console.warn('saveAuth error', e);
	}
}

export async function getAuth() {
	try {
		const raw = await AsyncStorage.getItem('auth');
		return raw ? JSON.parse(raw) : null;
	} catch (e) {
		console.warn('getAuth error', e);
		return null;
	}
}

export async function clearAuth() {
	try {
		await AsyncStorage.removeItem('auth');
	} catch (e) {
		console.warn('clearAuth error', e);
	}
}

export default { API_BASE, loginUser, saveAuth, getAuth, clearAuth };
