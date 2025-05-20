import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../constants/theme';

const MessageItem = ({ item }) => {
    const { user } = useAuth();

    const isSender = item.senderId === user.id;

    return (
        <View
            style={[
                styles.messageContainer,
                isSender ? styles.senderContainer : styles.receiverContainer,
            ]}
        >
            <View
                style={[
                    styles.messageBubble,
                    isSender ? styles.senderBubble : styles.receiverBubble,
                ]}
            >
                <Text style={isSender ? styles.senderText : styles.receiverText}>
                    {item.text}
                </Text>
            </View>
        </View>
    );
};

export default MessageItem;

const styles = StyleSheet.create({
    messageContainer: {
        flexDirection: 'row',
        marginVertical: 6,
        paddingHorizontal: 10,
    },
    senderContainer: {
        justifyContent: 'flex-end',
    },
    receiverContainer: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 10,
        borderRadius: 12,
    },
    senderBubble: {
        backgroundColor: theme.colors.primary,
        borderTopRightRadius: 0,
        alignSelf: 'flex-end',
    },
    receiverBubble: {
        backgroundColor: '#F1F1F1',
        borderTopLeftRadius: 0,
        alignSelf: 'flex-start',
    },
    senderText: {
        color: 'white',
        fontSize: 16,
    },
    receiverText: {
        color: '#333',
        fontSize: 16,
    },
});
