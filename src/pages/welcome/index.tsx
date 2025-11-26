import React from 'react';
import { Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { style } from '../login/styles';
import { themes } from '../../global/themes';
import Logo from '../../assets/wrath.png';

type Props = {
  onNavigateToRegister?: (role?: 'funcionario' | 'responsavel' | 'aluno') => void;
  onNavigateToLogin?: (role?: 'funcionario' | 'responsavel' | 'aluno') => void;
}

export default function Welcome({ onNavigateToRegister, onNavigateToLogin, onOpenAdmin }: Props & { onOpenAdmin?: () => void }) {
  return (
    <View style={style.container}>
      <TouchableOpacity onPress={() => onOpenAdmin && onOpenAdmin()} style={{ position: 'absolute', right: 12, top: 18, zIndex: 40 }}>
        <Text style={{ color: themes.colors.primary, fontWeight: '700' }}>ADM</Text>
      </TouchableOpacity>
      <View style={style.BoxTop}>
        <Image source={Logo} style={style.logo} resizeMode="contain" />
        <Text style={style.One}>Bem-vindo</Text>
      </View>

      <View style={style.BoxBottonReduced}>
        <Text style={style.textBottom}>Escolha o tipo de cadastro:</Text>
        <View style={style.roleCards}>
          <TouchableOpacity
            style={style.roleCard}
            onPress={() => { if (onNavigateToRegister) onNavigateToRegister('aluno'); }}
          >
            <View style={style.roleCardLeft}>
              <Text style={style.roleCardLabel}>Sou</Text>
              <Text style={style.roleCardTitle}>Estudante</Text>
            </View>
            <View style={style.roleCardRight}>
              <Text style={style.roleCardArrow} onPress={() => onNavigateToLogin && onNavigateToLogin('aluno')}>›</Text>
            </View>
            
          </TouchableOpacity>
          <TouchableOpacity style={style.roleCard} onPress={() => onNavigateToLogin && onNavigateToLogin('responsavel')}>
            <View style={style.roleCardLeft}>
              <Text style={style.roleCardLabel}>Sou</Text>
              <Text style={style.roleCardTitle}>Responsável</Text>
            </View>
            <View style={style.roleCardRight}>
              <Text style={style.roleCardArrow}>›</Text>
            </View>
          </TouchableOpacity>
          {/* Removed explicit "Entrar com CPF" link: the Responsável card now leads to Login with CPF mode. */}
        </View>
      </View>
    </View>
  );
}
