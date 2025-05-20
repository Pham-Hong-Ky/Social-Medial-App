import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Input from '../../components/Input';
import { useRef, useState } from 'react';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helper/common';
import Icon from '../../assets/icons';
import Avatar from '../../components/Avatar';
import Loading from '../../components/Loading';
import Header from '../../components/Header';
import { useRouter } from 'expo-router';

const messageDetails = () => {
  const { receiverId, name, image } = useLocalSearchParams();
  const inputRef = useRef(null);
  const contentRef = useRef("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendMessage = async () => {
    // TODO: gửi tin nhắn
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={hp(2)}
      >
        {/* Header người nhận */}
        <View style={{top: 15, position: 'absolute', width: '100%', marginHorizontal: wp(4)}}>
          <Header title="" />
        </View>
        <View style={styles.header}>
          <Avatar url={image} size={hp(5)} />
          <Text style={styles.nameText}>{name}</Text>
        </View>

        {/* Nội dung tin nhắn (sẽ là FlatList nếu có) */}
        <View style={styles.messageList}>
          {/* TODO: thêm danh sách tin nhắn ở đây */}
        </View>

        {/* Ô nhập tin nhắn */}
        <View style={styles.inputContainer}>
          <Input
            inputRef={inputRef}
            onChangeText={(text) => {
              contentRef.current = text;
            }}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.textLight}
            containerStyle={styles.inputBox}
          />
          {loading ? (
            <View style={styles.loading}>
              <Loading size="small" />
            </View>
          ) : (
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Icon name="send" size={hp(2.4)} color={theme.colors.dark} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default messageDetails;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderBottomWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
  },
  nameText: {
    marginLeft: wp(3),
    fontSize: hp(2.2),
    fontWeight: '600',
    color: theme.colors.textDark,
  },
  messageList: {
    flex: 1,
    padding: wp(4),
    backgroundColor: '#f9f9f9',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(4),
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: theme.colors.white,
  },
  inputBox: {
    flex: 1,
    height: hp(5.5),
    borderRadius: theme.radius.xl,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: wp(4),
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 50,
  },
  loading: {
    padding: 10,
  },
});
