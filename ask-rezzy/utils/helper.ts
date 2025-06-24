export const formatDate = (date: Date): string => {
  try {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  try {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  } catch (error) {
    console.error('Text truncation error:', error);
    return text;
  }
};

export const generateId = (): string => {
  try {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  } catch (error) {
    console.error('ID generation error:', error);
    return Date.now().toString();
  }
};

export const validateMessage = (message: string): boolean => {
  try {
    return message.trim().length > 0 && message.length <= 1000;
  } catch (error) {
    console.error('Message validation error:', error);
    return false;
  }
};