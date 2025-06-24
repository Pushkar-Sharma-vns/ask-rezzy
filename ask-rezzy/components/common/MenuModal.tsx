import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal,
  Pressable 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/Colors';

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  onStartNewChat: () => void;
  onViewPastChats: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({
  visible,
  onClose,
  onStartNewChat,
  onViewPastChats,
}) => {
  const handleStartNewChat = () => {
    try {
      onStartNewChat();
      onClose();
    } catch (error) {
      console.error('Start new chat error:', error);
    }
  };

  const handleViewPastChats = () => {
    try {
      onViewPastChats();
      onClose();
    } catch (error) {
      console.error('View past chats error:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.menuItem} onPress={handleStartNewChat}>
            <Text style={styles.menuText}>Start New Chat</Text>
            <Ionicons name="add" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handleViewPastChats}>
            <Text style={styles.menuText}>View Past Chats</Text>
            <Ionicons name="time-outline" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: Spacing.md,
  },
  container: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  menuText: {
    fontSize: FontSize.md,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginHorizontal: Spacing.md,
  },
});