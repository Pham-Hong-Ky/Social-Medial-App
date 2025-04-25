import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../constants/theme";
import { wp, hp } from "../helper/common";
import Avatar from "../components/Avatar";
import moment from "moment";
import Icon from "../assets/icons";
import RenderHtml from "react-native-render-html";
import { getSupabaseFileUrl } from "../services/imageService";
import { Video } from 'expo-av';


const PostCard = ({
    item,
    currentUser,
    router,
    hasShawdow = true,
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

    const openPostDetails = () => {

    }
    const likes = [];
    const liked = false;
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

                <TouchableOpacity onPress={openPostDetails}>
                    <Icon name='threeDotsHorizontal' size={hp(3.4)} strokeWidth={3} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.postBody}>
                    {
                        item?.body &&
                        <RenderHtml contentWidth={wp(100)} source={{ html: item?.body }} tagsStyles={tagsStyles} />
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
                            style={[styles.postMedia, {height: hp(30)}]} 
                            useNativeControls 
                            resizeMode="cover" 
                            isLooping 
                        />
                    )
                }
            </View>

            <View style={styles.footer}>
                <View style={styles.footerButton}>
                    <TouchableOpacity>
                        <Icon name="heart" size={24} fill={liked ? theme.colors.rose : 'transparent'} color={ theme.colors.textLight }/>
                    </TouchableOpacity>
                    <Text style={styles.count}>
                        { likes.length }
                    </Text>
                </View>
                <View style={styles.footerButton}>
                    <TouchableOpacity>
                        <Icon name="comment" size={24} color={ theme.colors.textLight }/>
                    </TouchableOpacity>
                    <Text style={styles.count}>
                        { 0 }
                    </Text>
                </View>
                <View style={styles.footerButton}>
                    <TouchableOpacity>
                        <Icon name="share" size={24} color={theme.colors.textLight}/>
                    </TouchableOpacity>
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