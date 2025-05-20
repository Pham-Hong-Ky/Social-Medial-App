import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { hp, wp } from '../../helper/common';
import Input from '../../components/Input';
import Icon from '../../assets/icons';
import { addNewFriend, getAllUserData, getFriendList, acceptFriend, deleteFriend } from '../../services/userService';
import FriendItem from '../../components/FriendItem';
import { useAuth } from '../../contexts/AuthContext';

const FriendsScreen = () => {
    const [selectedTab, setSelectedTab] = useState('ALL');
    const [userList, setUserList] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const router = useRouter();
    const userNameRef = useRef("");
    const user = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            await getListFriend();
            await getAllUser();
        };
        fetchData();
    }, []);

    const getAllUser = async () => {
        let result = await getAllUserData();
        if (result.success) {
            setUserList(result.data.filter(item => item.id !== user?.user?.id));
        } else {
            console.log("Error fetching users: ", result.msg);
        }
    };


    const getListFriend = async () => {
        let result = await getFriendList(user?.user?.id);
        if (result.success) {
            setFriendList(result.data);
        } else {
            console.log("Error fetching friend list: ", result.msg);
        }
    };


    const handleAddFriend = async (item) => {
        let data = {
            userId: user?.user?.id,
            friendId: item.id,
            status: 'pending',
        };
        let result = await addNewFriend(data);
        if (result.success) {
            console.log("Friend request sent successfully");
            getListFriend();
        } else {
            console.log("Error sending friend request: ", result.msg);
        }
    };

    const handleAcceptFriend = async (item) => {
        let Data1 = {
            userId: user?.user?.id,
            friendId: item.id,
            status: 'friend',
        };

        let Data2 = {
            userId: item.id,
            friendId: user?.user?.id,
            status: 'friend',
        };

        let result = await acceptFriend(Data1, Data2);
        if (result.success) {
            console.log("Friend request accepted successfully");
            getListFriend();
        } else {
            console.log("Error accepting friend request: ", result.msg);
        }

    };

    const handleRemoveFriend = async (item) => {

        Alert.alert("Remove Friend", "Are you sure you want to remove this friend?", [
            {
                text: "Cancel",
                onPress: () => console.log("cancelled"),
                style: "cancel",
            },
            {
                text: "Remove",
                onPress: async () => {
                    let result = await deleteFriend(user?.user?.id, item?.friendId,);
                    if (result.success) {
                        console.log("Friend removed successfully");
                        getListFriend();
                    } else {
                        console.log("Error removing friend: ", result.msg);
                    }
                },
                style: "destructive",
            },
        ]);


    }

    const renderAllUsers = () => {
        const filteredUsers = userList.filter(item => {
            if (item.id === user?.user?.id) return false;

            const relation = friendList.find(friend =>
                (friend.friendId === item.id && friend.userId === user?.user?.id) ||
                (friend.friendId === user?.user?.id && friend.userId === item.id)
            );

            if (relation?.status === 'friend') {
                return false;
            }

            return true;
        });

        return (
            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const friendRelation = friendList.find(friend =>
                        (friend.friendId === item.id && friend.userId === user?.user?.id) ||
                        (friend.friendId === user?.user?.id && friend.userId === item.id)
                    );
                    let buttonLabel = 'Add Friend';
                    let onPressAction = () => {
                        if (!friendRelation) handleAddFriend(item);
                    };
                    if (friendRelation) {
                        if (friendRelation.status === 'pending') {
                            if (friendRelation.userId === user?.user?.id) {
                                buttonLabel = 'Requested';
                                onPressAction = () => { };
                            } else {
                                buttonLabel = 'Accept';
                                onPressAction = () => handleAcceptFriend(item);
                            }
                        }
                    }
                    return (
                        <FriendItem
                            item={item}
                            onPress={onPressAction}
                            buttonLabel={buttonLabel}
                        />
                    );
                }}
            />
        );
    };


    const renderFriends = () => {
        const confirmedFriends = friendList.filter(item => item.status === 'friend');
        return (
            <FlatList
                data={confirmedFriends}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    const friendId = item.userId === user?.user?.id ? item.friendId : item.userId;
                    const friendData = [...userList, user?.user].find(u => u.id === friendId);
                    if (!friendData) return null;

                    return (
                        <FriendItem
                            item={friendData}
                            onPress={() => {
                                handleRemoveFriend(item);
                            }}
                            buttonLabel={'Remove'}
                        />
                    );
                }}
            />
        );
    };




    return (
        <View style={styles.container}>
            <View style={{ marginBottom: hp(5), alignItems: 'center' }}>
                <View style={{ width: wp(85), height: hp(5) }}>
                    <Input
                        placeholder='Search ....'
                        icon={<Icon name='search' size={20} strokeWidth={1.6} />}
                        onChangeText={value => userNameRef.current = value}
                    />
                </View>
            </View>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'ALL' && styles.activeTabButton]}
                    onPress={() => setSelectedTab('ALL')}
                >
                    <Text style={[styles.tabText, selectedTab === 'ALL' && styles.activeTabText]}>
                        ALL
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'FRIENDS' && styles.activeTabButton]}
                    onPress={() => setSelectedTab('FRIENDS')}
                >
                    <Text style={[styles.tabText, selectedTab === 'FRIENDS' && styles.activeTabText]}>
                        FRIENDS
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                {selectedTab === 'ALL' ? renderAllUsers() : renderFriends()}
            </View>
        </View>
    );
};

export default FriendsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: hp(5),
        paddingHorizontal: wp(4),
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: wp(2),
    },
    tabButton: {
        backgroundColor: '#E0E0E0',
        paddingVertical: 8,
        paddingHorizontal: wp(15),
        borderRadius: 6,
    },
    activeTabButton: {
        backgroundColor: '#99B3FF',
    },
    tabText: {
        fontWeight: '600',
        color: '#333',
    },
    activeTabText: {
        color: '#000',
    },
    content: {
        marginTop: 24,
        alignItems: 'center',
        flex: 1,
    },
});
