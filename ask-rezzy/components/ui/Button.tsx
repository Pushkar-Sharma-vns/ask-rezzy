import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const handlePress = () => {
    try {
      if (!disabled && !loading) {
        onPress();
      }
    } catch (error) {
      console.error('Button press error:', error);
    }
  };

  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      <Text style={textStyleCombined}>
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  primary: {
    backgroundColor: Colors.primary.blue,
  },
  secondary: {
    backgroundColor: Colors.background.gray,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.blue,
  },
  small: {
    paddingVertical: Spacing.sm,
    minHeight: 32,
  },
  medium: {
    paddingVertical: Spacing.md,
    minHeight: 44,
  },
  large: {
    paddingVertical: Spacing.lg,
    minHeight: 52,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
  primaryText: {
    color: Colors.text.white,
    fontSize: FontSize.md,
  },
  secondaryText: {
    color: Colors.text.primary,
    fontSize: FontSize.md,
  },
  outlineText: {
    color: Colors.primary.blue,
    fontSize: FontSize.md,
  },
  smallText: {
    fontSize: FontSize.sm,
  },
  mediumText: {
    fontSize: FontSize.md,
  },
  largeText: {
    fontSize: FontSize.lg,
  },
  disabledText: {
    opacity: 0.7,
  },
});
