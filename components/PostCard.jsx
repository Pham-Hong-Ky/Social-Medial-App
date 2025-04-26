import { Alert, Image, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../constants/theme";
import { wp, hp, stripHtmlTag } from "../helper/common";
import Avatar from "../components/Avatar";
import moment from "moment";
import Icon from "../assets/icons";
import RenderHtml from "react-native-render-html";
import { downloadFile, getSupabaseFileUrl } from "../services/imageService";
import { Video } from 'expo-av';
import { createPostLike, removePostLike } from "../services/postService";
import { useEffect, useMemo, useState } from "react";
import Loading from "./Loading";

const PostCard = ({
    item,
    currentUser,
    router,
    hasShawdow = true,
    showMoreIcon = true,
    showDelete = false,
    onDeletePost = () => { },
    onEditPost = () => { },
}) => {
    const shadowStyle = {
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1,
    }

    const textStyles = {
        color: theme.colors.drak,
        fontSize: hp(1.75),
    }

    const tagsStyles = {
        div: textStyles,
        p: textStyles,
        ol: textStyles,
        h1: {
            color: theme.colors.drak,
        },
        h4: {
            color: theme.colors.drak,
        }
    }

    const createdAt = moment(item?.created_at).format('MMM D');
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(false);
    const htmlContent = useMemo(() => ({ html: item?.body || '' }), [item?.body]);

    const liked = likes.filter((like) => like.userId == currentUser?.id)[0] ? true : false;
    useEffect(() => {
        setLikes(item?.postLikes || []);
    }, [item])

    const openPostDetails = () => {
        if (!showMoreIcon) return null;
        router.push({ pathname: '(pages)/postDetails', params: { postId: item?.id } });
    }

    const onLike = async () => {
        if (liked) {
            let updateLike = likes.filter((like) => like.userId != currentUser?.id);
            setLikes([...updateLike]);
            let result = await removePostLike(item?.id, currentUser?.id);
            console.log('remove like: ', result);
            if (!result.success) {
                Alert.alert('Post', 'Something went wrong!');
            }
        } else {
            let data = {
                userId: currentUser?.id,
                postId: item?.id,
            }
            setLikes([...likes, data]);
            let result = await createPostLike(data);
            console.log('Add like: ', result);
            if (!result.success) {
                Alert.alert('Post', 'Something went wrong!');
            }
        }
    }

    const onShare = async () => {
        let content = { message: stripHtmlTag(item?.body) }
        if (item?.file) {
            setLoading(true);
            let url = await downloadFile(getSupabaseFileUrl(item?.file).uri);
            setLoading(false);
            content.url = url;
        }
        Share.share(content)
    }

    const handelDeletePost = () => {
        Alert.alert("Post", "Are you sure you want to delete this post", [
            {
                text: "Cancel",
                onPress: async () => console.log("cancelled"),
                style: "cancel",
            },
            {
                text: "Delete",
                onPress: () => onDeletePost(item),
                style: "destructive",
            },
        ]);
    }

    return (
        <View style={[styles.container, hasShawdow && shadowStyle]}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Avatar size={hp(4.5)} url={item?.user?.image} rounded={theme.radius.md} />
                    <View style={{ gap: 2 }}>
                        <Text style={styles.username}>
                            {item?.user?.name}
                        </Text>
                        <Text style={styles.postTime}>
                            {createdAt}
                        </Text>
                    </View>
                </View>
                {
                    showMoreIcon && (
                        <TouchableOpacity onPress={openPostDetails}>
                            <Icon name='threeDotsHorizontal' size={hp(3.4)} strokeWidth={3} color={theme.colors.text} />
                        </TouchableOpacity>
                    )
                }
                {
                    showDelete && currentUser?.id == item?.userId && (
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => onEditPost(item)}>
                                <Icon name='edit' color={theme.colors.text} size={hp(2.4)} strokeWidth={3} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handelDeletePost}>
                                <Icon name='delete' color={theme.colors.rose} size={hp(2.4)} strokeWidth={3} />
                            </TouchableOpacity>
                        </View>
                    )
                }
            </View>
            <View style={styles.content}>
                <View style={styles.postBody}>
                    {
                        item?.body &&
                        <RenderHtml contentWidth={wp(100)} source={htmlContent} tagsStyles={tagsStyles} />
                    }
                </View>
                {
                    item?.file && item?.file?.includes('postImages') && (
                        <Image
                            source={getSupabaseFileUrl(item?.file)}
                            transition={100}
                            style={styles.postMedia}
                            contentFit='cover'
                        />
                    )
                }
                {
                    item?.file && item?.file?.includes('postVideos') && (
                        <Video
                            source={getSupabaseFileUrl(item?.file)}
                            style={[styles.postMedia, { height: hp(30) }]}
                            useNativeControls
                            resizeMode="cover"
                            isLooping
                        />
                    )
                }
            </View>
            <View style={styles.footer}>
                <View style={styles.footerButton}>
                    <TouchableOpacity onPress={onLike}>
                        <Icon name="heart" size={24} fill={liked ? theme.colors.rose : 'transparent'} color={theme.colors.textLight} />
                    </TouchableOpacity>
                    <Text style={styles.count}>
                        {likes.length}
                    </Text>
                </View>
                <View style={styles.footerButton}>
                    <TouchableOpacity onPress={openPostDetails}>
                        <Icon name="comment" size={24} color={theme.colors.textLight} />
                    </TouchableOpacity>
                    <Text style={styles.count}>
                        {
                            item?.comments[0]?.count
                        }
                    </Text>
                </View>
                <View style={styles.footerButton}>

                    {
                        loading ? (
                            <Loading />
                        ) : (
                            <TouchableOpacity onPress={onShare}>
                                <Icon name="share" size={24} color={theme.colors.textLight} />
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>
        </View>
    )
}

export default PostCard

const styles = StyleSheet.create({
    count: {
        color: theme.colors.text,
        fontSize: hp(1.8),
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
    },
    footerButton: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    postBody: {
        marginLeft: 5,
    },
    postMedia: {
        height: hp(40),
        width: '100%',
        borderRadius: theme.radius.xl,
        borderCurved: 'continuous',
    },
    content: {
        gap: 10
    },
    postTime: {
        fontSize: hp(1.4),
        color: theme.colors.textLight,
        fontWeight: theme.fonts.medium,
    },
    username: {
        fontSize: hp(1.7),
        color: theme.colors.textDark,
        fontWeight: theme.fonts.medium,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    container: {
        gap: 10,
        marginBottom: 15,
        borderRadius: theme.radius.xxl * 1.1,
        borderCurved: 'continuous',
        padding: 10,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000',
    }
})