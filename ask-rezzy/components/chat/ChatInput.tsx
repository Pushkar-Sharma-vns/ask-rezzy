
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/Colors';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  placeholder = "Ask anything...",
  disabled = false,
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    try {
      if (message.trim() && !disabled) {
        onSendMessage(message.trim());
        setMessage('');
      }
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.placeholder}
          multiline
          maxLength={500}
          editable={!disabled}
          selectionColor="transparent"
          underlineColorAndroid="transparent"
          textAlignVertical="top"
          cursorColor="transparent"
          selection={{start: message.length, end: message.length}}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!message.trim() || disabled) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim() || disabled}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={(!message.trim() || disabled) ? Colors.text.placeholder : Colors.text.white} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.background.lightGray,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 44,
  },
  textInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text.primary,
    maxHeight: 100,
    marginRight: Spacing.sm,
    borderWidth: 0,
  },
  sendButton: {
    backgroundColor: Colors.primary.blue,
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.background.gray,
  },
});