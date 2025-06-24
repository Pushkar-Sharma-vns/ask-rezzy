
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Flashcard } from '@/types/index';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';

interface FlashCardProps {
  flashcard: Flashcard;
}

export const FlashCard: React.FC<FlashCardProps> = ({ flashcard }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    try {
      setIsFlipped(!isFlipped);
    } catch (error) {
      console.error('Flip card error:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleFlip} style={styles.container}>
      <Card style={isFlipped ? [styles.card, styles.flippedCard] : styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>FLASHCARD {isFlipped ? '2' : '1'} OF 5</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.text}>
            {isFlipped ? flashcard.back : flashcard.front}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.navigation}>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navText}>PREVIOUS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navText}>NEXT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  card: {
    minHeight: 200,
  },
  flippedCard: {
    backgroundColor: Colors.primary.lightBlue,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.text.secondary,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  text: {
    fontSize: FontSize.md,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    marginTop: Spacing.md,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  navText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.text.secondary,
    letterSpacing: 1,
  },
});
