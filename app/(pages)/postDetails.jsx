import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { createComment, fetchPostDetails, removeComment, removePost } from "../../services/postService";
import { hp, wp } from "../../helper/common";
import { theme } from "../../constants/theme";
import PostCard from "../../components/PostCard";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import Input from "../../components/Input";
import Icon from "../../assets/icons";
import CommentItem from "../../components/CommentItem";
import { supabase } from '../../lib/supabase';
import { getUserData } from "../../services/userService";

const PostDetails = () => {
    const { postId } = useLocalSearchParams();
    const [post, setPost] = useState(null);
    const { user } = useAuth();
    const router = useRouter();
    const [startLoading, setStartLoading] = useState(false);
    const inputRef = useRef(null);
    const commentRef = useRef("");
    const [loading, setLoading] = useState(false);

    const handleCommentEvent = async (payLoad) => {
        if (payLoad.new) {
            let newComment = { ...payLoad.new };
            let result = await getUserData(newComment.userId);
            newComment.user = result.success ? result.data : {};
            setPost((prev) => {
                return {
                    ...prev,
                    comments: [newComment, ...prev.comments]
                };
            }
            )
        }
    }

    useEffect(() => {
        let commentChannel = supabase
            .channel('comments')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `postId=eq.${postId}` }, handleCommentEvent)
            .subscribe()

        getPostDetails();

        return () => {
            supabase.removeChannel(commentChannel);
        }
    }, []);

    const getPostDetails = async () => {
        let result = await fetchPostDetails(postId);
        if (result.success) {
            setPost(result.data);
        }
        setStartLoading(false);
    }

    const onNewComment = async () => {
        if (!commentRef.current) return null;
        let data = {
            userId: user?.id,
            postId: post?.id,
            text: commentRef.current,
        }
        setLoading(true);
        let result = await createComment(data);
        setLoading(false);
        if (result.success) {
            inputRef?.current?.clear();
            commentRef.current = "";
        } else {
            Alert.alert("Post Comment", result.msg);
        }
    }

    const onDeleteComment = async (comment) => {
        let result = await removeComment(comment?.id);
        if (result.success) {
            setPost((prev) => {
                let updatePosts = { ...prev }
                updatePosts.comments = updatePosts.comments.filter((item) => item.id != comment.id);
                return updatePosts;
            })
        } else {
            Alert.alert("Post Comment", result.msg);
        }
    }

    const onDeletePost = async (item) => {
        let result = await removePost(post.id);
        if (result.success) {
            router.back();
        } else {
            Alert.alert("Post", result.msg);
        }
    }

    const onEditPost = async (item) => {
        router.back();
        router.push({ pathname: '(pages)/newPost', params: {...item} });
    }

    if (startLoading) {
        return (
            <View style={styles.center}>
                <Loading />
            </View>
        )
    }

    if (!post) {
        return (
            <View style={[styles.center, { justifyContent: 'flex-start', marginTop: 100 }]}>
                <Text style={styles.notFound}>Post not found !</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
                <PostCard
                    item={{ ...post, comments: [{ count: post?.comments?.length }] }}
                    currentUser={user}
                    router={router}
                    hasShawdow={false}
                    showMoreIcon={false}
                    onDeletePost={onDeletePost}
                    onEditPost={onEditPost}
                    showDelete={true}
                />
                <View style={styles.inputContainer}>
                    <Input
                        inputRef={inputRef}
                        placeholder="Type comment ..."
                        onChangeText={(text) => { commentRef.current = text }}
                        placeholderTextColor={theme.colors.textLight}
                        containerStyle={{ flex: 1, height: hp(6.2), borderRadius: theme.radius.xl }}
                    />
                    {
                        loading ? (
                            <View style={styles.loading}>
                                <Loading size="small" />
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
                                <Icon name="send" size={hp(3)} color={theme.colors.drak} />
                            </TouchableOpacity>
                        )
                    }
                </View>

                <View style={{ marginVertical: 15, gap: 17 }}>
                    {
                        post?.comments?.map(comment =>
                            <CommentItem
                                item={comment}
                                key={comment?.id.toString()}
                                canDelete={comment.userId == user?.id || post?.userId == user?.id}
                                onDelete={() => onDeleteComment(comment)}
                            />
                        )
                    }
                    {
                        post?.comments?.length == 0 && (
                            <Text style={{ color: theme.colors.text, marginLeft: 5 }}> Be first to comment ! </Text>
                        )
                    }
                </View>
            </ScrollView>
        </View>
    )

}


export default PostDetails;

const styles = StyleSheet.create({
    loading: {
        height: hp(5.8),
        width: hp(5.8),
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ scale: 1.3 }],
    },
    notFound: {
        fontSize: hp(2.5),
        color: theme.colors.text,
        fontWeight: theme.fonts.medium,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    sendIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.8,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.lg,
        borderCurved: 'continuous',
        height: hp(5.8),
        width: hp(5.8),
    },
    list: {
        paddingHorizontal: wp(4),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: wp(7),
    }
})