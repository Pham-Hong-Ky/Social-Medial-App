import { Alert, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SrceenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import { hp, wp } from "../../helper/common";
import Icon from "../../assets/icons";
import { theme } from "../../constants/theme";
import { supabase } from "@/lib/supabase";
import Avatar from "../../components/Avatar";
import { useState } from "react";
import { fectchPosts } from "../../services/postService";
import Loading from "../../components/Loading";
import PostCard from "../../components/PostCard";

var limit = 0;
const Profile = () => {
    const { user, userAuth } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const onLogout = async () => {
        // setAuth(null);

        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert("Logout", error.message);
        }
    }

    const getPosts = async () => {
            if (!hasMore) return null;
    
            limit = limit + 10;
            let result = await fectchPosts(limit, user.id);
            if (result.success) {
                if(posts.length == result.data.length) setHasMore(false);
    
                setPosts(result.data);
            }
        }

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            {
                text: "Cancel",
                onPress: async () => console.log("cancelled"),
                style: "cancel",
            },
            {
                text: "Logout",
                onPress: () => onLogout(),
                style: "destructive",
            },
        ]);
    }
    return (
        <SrceenWrapper bg='white'>
            <FlatList
                    data={posts}
                    ListHeaderComponent={<UserHeader user={user} router={router} handleLogout={handleLogout} />}
                    ListHeaderComponentStyle={{ paddingBottom: 30 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listStyle}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <PostCard item={item} currentUser={user} router={router} />
                    )}
                    ListFooterComponent={ hasMore ? (
                        <View style={{ paddingVertical: posts.length == 0 ? 100: 30 }}>
                            <Loading />
                        </View> 
                    ) : (
                        <View>
                            <Text style={styles.noPosts}> No more posts ! </Text>
                        </View>
                    )}

                    onEndReachedThreshold={0}
                    onEndReached={() => getPosts()}
                />
        </SrceenWrapper>
    )
}

const UserHeader = ({ user, router, handleLogout }) => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4) }}>
            <View>
                <Header title="Profile" mb={30} />
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} >
                    <Icon name="logout" color={theme.colors.rose} />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <View style={{ gap: 15 }}>
                    <View style={styles.avatarContainer}>
                        <Avatar
                            url={user?.image}
                            size={hp(12)}
                            rounded={theme.radius.xxl * 1.4}
                        />
                        <Pressable style={styles.editIcon} onPress={() => router.push('editProfile')}>
                            <Icon name="edit" strokeWidth={2.4} size={20} />
                        </Pressable>
                    </View>

                    <View style={{ alignItems: "center", gap: 4 }}>
                        <Text style={styles.userName}>
                            {user && user.name}
                        </Text>
                        <Text style={styles.infoText}>
                            {user?.address}
                        </Text>
                    </View>

                    <View style={{ gap: 10 }}>
                        <View style={styles.info}>
                            <Icon name="mail" size={20} color={theme.colors.textLight} />
                            <Text style={styles.infoText}>
                                {user && user?.email}
                            </Text>
                        </View>
                        {
                            user && user?.phoneNumber && (
                                <View style={styles.info}>
                                    <Icon name="call" size={20} color={theme.colors.textLight} />
                                    <Text style={styles.infoText}>
                                        {user && user?.phoneNumber}
                                    </Text>
                                </View>
                            )
                        }
                        {
                            user && user?.bio && (
                                <Text>{user.bio}</Text>
                            )
                        }
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Profile;

const styles = StyleSheet.create({
    logoutButton: {
        position: "absolute",
        right: 0,
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: '#fee2e2'
    },
    info: {
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    listStyle: {
        paddingBottom: 30,
        paddingHorizontal: wp(4),
    },
    noPosts: {
        fontSize: hp(2),
        textAlign: "center",
        color: theme.colors.text,
    },
    userName: {
        fontSize: hp(3),
        fontWeight: '500',
        color: theme.colors.textDark,
    },
    editIcon: {
        position: "absolute",
        bottom: 0,
        right: -12,
        padding: 7,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowColor: theme.colors.textLight,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7,
    },
    container: {
        flex: 1,
    },
    headerShape: {
        width: wp(100),
        height: hp(30),
    },
    headerContainer: {
        marginHorizontal: wp(4),
        marginBottom: 20,
    },
    avatarContainer: {
        alignSelf: "center",
        height: hp(12),
        width: hp(12),
    },
    infoText: {
        fontSize: hp(1.6),
        fontWeight: '500',
        color: theme.colors.textLight,
    },
})