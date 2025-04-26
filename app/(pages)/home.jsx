import { FlatList, Pressable, Text, View } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useAuth } from '../../contexts/AuthContext';
import { StyleSheet } from 'react-native';
import { wp, hp } from '../../helper/common';
import { theme } from '../../constants/theme';
import Icon from '../../assets/icons';
import { useRouter } from 'expo-router';
import Avatar from '../../components/Avatar';
import { useEffect, useState } from 'react';
import { fectchPosts } from '../../services/postService';
import PostCard from '../../components/PostCard';
import Loading from '../../components/Loading';
import { supabase } from '../../lib/supabase';
import { getUserData } from '../../services/userService';

var limit = 0;

const Home = () => {
    const { user, setAuth } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const handlePostEvent = async (payLoad) => {
        if( payLoad.eventType == 'INSERT' && payLoad?.new?.id) {
            let newPost = {...payLoad.new};
            let res = await getUserData(newPost.userId);
            newPost.postLikes = [];
            newPost.comments = [{count: 0}];
            newPost.user = res.success ? res.data : [];
            setPosts((prev) => [newPost, ...prev]);
        }
        if (payLoad.eventType == 'DELETE' && payLoad?.old?.id) {
            setPosts((prev) => {
                return prev.filter((post) => post.id != payLoad.old.id);;
            })
        }
    }

    useEffect(() => {
        let postChannel = supabase
            .channel('posts')
            .on('postgres_changes', {event: '*', schema: 'public', table: 'posts'}, handlePostEvent)
            .subscribe()

        return () =>{
            supabase.removeChannel(postChannel);
        }
    }, [])

    const getPosts = async () => {
        if (!hasMore) return null;

        limit = limit + 10;
        let result = await fectchPosts(limit);
        if (result.success) {
            if(posts.length == result.data.length) setHasMore(false);

            setPosts(result.data);
        }
    }

    return (
        <ScreenWrapper bg='white'>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>LinkUp</Text>
                    <View style={styles.icons}>
                        <Pressable onPress={() => router.push('notification')}>
                            <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                        </Pressable>
                        <Pressable onPress={() => router.push('newPost')}>
                            <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                        </Pressable>
                        <Pressable onPress={() => router.push('profile')}>
                            <Avatar url={user?.image} size={hp(4.3)} rounded={theme.radius.sm} style={{ borderWidth: 2 }} />
                        </Pressable>
                    </View>
                </View>
                <FlatList
                    data={posts}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listStyle}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <PostCard item={item} currentUser={user} router={router} />
                    )}
                    ListFooterComponent={ hasMore ? (
                        <View style={{ paddingVertical: posts.length == 0 ? 200: 30 }}>
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
            </View>
        </ScreenWrapper>
    );
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginHorizontal: wp(4),
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(3.2),
        fontWeight: theme.fonts.bold,
    },
    avatarImage: {
        height: hp(4.3),
        width: hp(4.3),
        borderRadius: theme.radius.sm,
        borderCurved: 'continuous',
        backgroundColor: theme.colors.gray,
        borderWidth: 3,
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18
    },
    listStyle: {
        paddingHorizontal: wp(4),
        paddingTop: 20,
    },
    noPosts: {
        textAlign: 'center',
        fontSize: hp(2),
        color: theme.colors.text,
    },
    pills: {
        position: 'absolute',
        right: -10,
        top: -4,
        height: hp(2.2),
        width: hp(2.2),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: theme.colors.roseLight,
    },
    pillText: {
        fontSize: hp(1.4),
        color: 'white',
        fontWeight: theme.fonts.bold,
    },
})