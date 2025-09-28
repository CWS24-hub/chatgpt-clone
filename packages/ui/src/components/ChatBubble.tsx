import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  style?: ViewStyle;
  isRTL?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isUser,
  timestamp,
  style,
  isRTL = false,
}) => {
  const bubbleStyle = [
    styles.bubble,
    isUser ? styles.userBubble : styles.assistantBubble,
    isRTL && (isUser ? styles.userBubbleRTL : styles.assistantBubbleRTL),
    style,
  ];

  const textStyle = [
    styles.text,
    isUser ? styles.userText : styles.assistantText,
    isRTL && styles.textRTL,
  ];

  return (
    <View style={styles.container}>
      <View style={bubbleStyle}>
        <Text style={textStyle}>{message}</Text>
        {timestamp && <Text style={styles.timestamp}>{timestamp}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    marginLeft: 50,
  },
  assistantBubble: {
    backgroundColor: '#F1F3F4',
    alignSelf: 'flex-start',
    marginRight: 50,
  },
  userBubbleRTL: {
    alignSelf: 'flex-start',
    marginLeft: 0,
    marginRight: 50,
  },
  assistantBubbleRTL: {
    alignSelf: 'flex-end',
    marginRight: 0,
    marginLeft: 50,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#333333',
  },
  textRTL: {
    textAlign: 'right',
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    textAlign: 'right',
  },
});
