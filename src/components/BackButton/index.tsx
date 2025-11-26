import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { themes } from '../../global/themes';

type Props = {
  onPress?: () => void;
  label?: string;
  icon?: boolean;
  style?: any;
  textStyle?: any;
  hitSlop?: { top: number; left: number; right: number; bottom: number };
}

export default function BackButton({ onPress, label = 'Voltar', icon = true, style, textStyle, hitSlop }: Props) {
  const defaultHitSlop = hitSlop ?? { top: 24, left: 24, right: 24, bottom: 24 };
  return (
    <TouchableOpacity onPress={onPress} hitSlop={defaultHitSlop} style={[styles.button, style]}>
      <Text style={[styles.text, textStyle]}>{icon ? `‹ ${label}` : label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8, backgroundColor: 'transparent' },
  text: { color: themes.colors.primary, fontWeight: '700' }
});
