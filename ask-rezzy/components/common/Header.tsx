
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize } from '@/constants/Colors';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  showMenuButton?: boolean;
  onMenuPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightElement,
  showMenuButton = true,
  onMenuPress,
}) => {
  const handleBackPress = () => {
    try {
      if (onBackPress) {
        onBackPress();
      }
    } catch (error) {
      console.error('Header back press error:', error);
    }
  };

  const handleMenuPress = () => {
    try {
      if (onMenuPress) {
        onMenuPress();
      }
    } catch (error) {
      console.error('Header menu press error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={Colors.text.primary} 
            />
          </TouchableOpacity>
        )}
        {showMenuButton && !showBackButton && (
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={handleMenuPress}
          >
            <Ionicons 
              name="menu" 
              size={24} 
              color={Colors.text.primary} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.centerSection}>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.rightSection}>
        {rightElement}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    minHeight: 56,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  menuButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
});
