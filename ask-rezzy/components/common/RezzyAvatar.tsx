
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/Colors';

export const RezzyAvatar: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>R</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.text.white,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});