
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Flashcard } from '@/types/index';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';

interface FlashCardProps {
  flashcard: Flashcard;
  currentIndex?: number;
  totalCount?: number;
}

export const FlashCard: React.FC<FlashCardProps> = ({ flashcard, currentIndex = 0, totalCount = 1 }) => {
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
      <Card style={StyleSheet.flatten([styles.card, isFlipped && styles.flippedCard])}>
        <View style={styles.header}>
          <Text style={styles.title}>FLASHCARD {currentIndex + 1} OF {totalCount}</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={styles.contentLabel}>Front:</Text>
          </View>
          <Text style={styles.text}>
            {flashcard.front}
          </Text>
          
          {isFlipped && (
            <>
              <View style={styles.separator} />
              <View style={styles.contentHeader}>
                <Text style={styles.contentLabel}>Back:</Text>
              </View>
              <Text style={styles.text}>
                {flashcard.back}
              </Text>
            </>
          )}
        </View>
        
        {!isFlipped && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.flipButton} onPress={handleFlip}>
              <Text style={styles.flipText}>TAP TO SHOW BACK</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 400,
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
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.text.secondary,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  sideLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.primary.blue,
    letterSpacing: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.primary.lightBlue,
    borderRadius: BorderRadius.sm,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  contentHeader: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  contentLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  separator: {
    height: 32,
    width: '100%',
  },
  text: {
    fontSize: FontSize.md,
    color: Colors.text.primary,
    textAlign: 'left',
    lineHeight: 22,
    width: '100%',
  },
  footer: {
    marginTop: Spacing.md,
  },
  flipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  flipText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.primary.blue,
    letterSpacing: 1,
  },
});
