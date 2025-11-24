import React from 'react';
import { Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { style } from '../login/styles';
import Logo from '../../assets/wrath.png';

type Props = {
  onNavigateToRegister?: (role?: 'funcionario' | 'responsavel' | 'aluno') => void;
  onNavigateToLogin?: () => void;
}

export default function Welcome({ onNavigateToRegister, onNavigateToLogin }: Props) {
  return (
    <View style={style.container}>
      <View style={style.BoxTop}>
        <Image source={Logo} style={style.logo} resizeMode="contain" />
        <Text style={style.One}>Bem-vindo</Text>
      </View>

      <View style={style.BoxBottonReduced}>
        <Text style={style.textBottom}>Escolha o tipo de cadastro:</Text>
        <View style={style.roleCards}>
          <TouchableOpacity
            style={style.roleCard}
            onPress={() => {
              Alert.alert('Debug', 'Estudante pressionado');
              if (onNavigateToLogin) onNavigateToLogin();
              else if (onNavigateToRegister) onNavigateToRegister('aluno');
            }}
          >
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
