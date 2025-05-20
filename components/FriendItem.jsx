import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Avatar from './Avatar';
import { hp, wp } from '../helper/common';

const FriendItem = ({ item, onPress, buttonLabel }) => {

  const router = useRouter();

  const handlePress = (item) => {
    router.push({ pathname: '(pages)/profile', params: { userId: item?.id } });
  };

  const chatButtonPress = (item) => {
    router.push({ pathname: '(pages)/messageDetails', params: { receiverId: item?.id, name: item?.name, image: item?.image } });
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, marginRight: wp(3), flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={styles.avatarContainer} onPress={() => handlePress(item)}>
          <Avatar url={item?.image} size={42} />
        </TouchableOpacity>
        <View>
          <Text>{item?.name}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>

        <TouchableOpacity style={styles.addButton} onPress={onPress}>
          <Text style={{ color: '#fff' }}>{buttonLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chatButton} onPress={() => chatButtonPress(item)}>
          <Text style={{ color: '#fff' }}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FriendItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: hp(1.5),
    marginHorizontal: wp(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    padding: wp(3),
    width: 320,
  },
  avatarContainer: {
    marginRight: wp(3),
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderRadius: 8,
    marginRight: wp(2),
  },
  chatButton: {
    backgroundColor: '#007AFF',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderRadius: 8,
  }
})
