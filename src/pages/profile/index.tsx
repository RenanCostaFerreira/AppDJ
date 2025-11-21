import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { style } from './styles';

type Props = {
  user?: { name?: string; email?: string } | null;
  onBack?: () => void;
  onLogout?: () => void;
}

export default function Profile({ user, onBack, onLogout }: Props) {
  return (
    <View style={style.container}>
      <Text style={style.title}>{user?.name ?? 'Usuário'}</Text>
      <Text style={style.email}>{user?.email ?? 'sem-email@exemplo.com'}</Text>

      <TouchableOpacity style={style.button} onPress={() => { if (onLogout) onLogout(); if (onBack) onBack(); }}>
        <Text style={style.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}
