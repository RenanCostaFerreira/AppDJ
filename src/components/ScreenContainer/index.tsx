import React from 'react';
import { ScrollView, View, RefreshControl, Platform } from 'react-native';

type Props = {
  children?: React.ReactNode;
  scrollEnabled?: boolean;
  useScrollView?: boolean;
  onRefresh?: (() => Promise<void>) | (() => void);
  refreshing?: boolean;
  style?: any;
}

export default function ScreenContainer({ children, scrollEnabled = true, onRefresh, refreshing = false, style, useScrollView = true }: Props) {
  const refreshControl = onRefresh ? (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh as any} />
  ) : undefined;

  // On mobile we want vertical scroll behavior so user can drag up/down.
  // Use ScrollView with flexGrow so content fills and scrolls correctly.
  if (!useScrollView) {
    return (
      <View style={[{ flex: 1 }, style]}>
        <View style={{ flex: 1 }}>{children}</View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[{ flex: 1 }, style]}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollEnabled={scrollEnabled}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps='handled'
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
    >
      <View style={{ flex: 1 }}>{children}</View>
    </ScrollView>
  );
}
