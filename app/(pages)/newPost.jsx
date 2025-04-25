import SrceenWapper from "../../components/ScreenWrapper";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Image, Pressable, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import Header from "../../components/Header";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helper/common";
import Avatar from "../../components/Avatar";
import { useAuth } from "../../contexts/AuthContext";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import RichTextEditor from "../../components/RichTextEditor";
import Icon from "../../assets/icons";
import Button from "../../components/Button";
import { getSupabaseFileUrl } from "../../services/imageService";
import { Video } from 'expo-av';
import { createOrUpdatePost } from "../../services/postService";

const NewPost = () => {

    const { user } = useAuth();
    const bodyRef = useRef(null);
    const editorRef = useRef(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(file);

    const onPick = async (isImage) => {

        let mediaConfig = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // mediaTypes: ImagePicker.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        }

        if (!isImage) {
            mediaConfig = {
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                // mediaTypes: ImagePicker.Videos,
                allowsEditing: true,
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

        if (!result.canceled) {
            setFile(result.assets[0]);
        }

    }

    const getFileUrl = (file) => {
        if (!file) return null;
        if (isLocalFile(file)) {
            return file.uri
        }
        return getSupabaseFileUrl(file)?.uri;
    }

    const isLocalFile = (file) => {
        if (!file) return null;
        if (typeof file === 'object') return true;
        return false;
    }

    const getFileType = (file) => {
        if (!file) return null;
        if (isLocalFile(file)) return file.type;
        if (file.includes('postImages')) return 'image';
        return 'video'
    }

    const onSubmit = async () => {
        if (!bodyRef.current && !file) {
            Alert.alert('Post', 'Please choose an image or video or write something to post');
            return;
        }
        let data = {
            file,
            body: bodyRef.current,
            userId: user.id,
        }
        setLoading(true);
        let result = await createOrUpdatePost(data);
        setLoading(false);
        if(result.success){
            setFile(null);
            bodyRef.current = null;
            editorRef?.current?.setContentHTML('');
            router.back();
        }else{
            Alert.alert('Post', result.message);
        }
    }

    const hiddenKeyboard = () => {
        Keyboard.dismiss();
        editorRef?.current?.blurContentEditor();
    }

    return (
        <SrceenWapper bg='white'>
            <TouchableWithoutFeedback onPress={hiddenKeyboard} accessible={false}>
            <View style={styles.container}>
                <Header title='Create Posts' />
                
                    <ScrollView contentContainerStyle={{ gap: 20 }} keyboardShouldPersistTaps="handled" >
                        <View style={styles.header}>
                            <Avatar url={user?.image} size={hp(6.5)} rounded={theme.radius.xl} />
                            <View style={{ gap: 2 }}>
                                <Text style={styles.username}> {user && user.name}</Text>
                                <Text style={styles.publicText}> Public </Text>
                            </View>
                        </View>

                        <View style={styles.textEditor}>
                            <RichTextEditor editorRef={editorRef} onChange={body => bodyRef.current = body} />
                        </View>

                        {
                            file && (
                                <View style={styles.file}>
                                    {getFileType(file) == 'video' ? (
                                        <Video style={{ flex: 1 }}
                                            source={{
                                                uri: getFileUrl(file)
                                            }}
                                            useNativeControls
                                            isLooping
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Image source={{ uri: getFileUrl(file) }} resizeMode="cover" style={{ flex: 1 }} />
                                    )}
                                    <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                                        <Icon name='delete' size={20} color='white' />
                                    </Pressable>
                                </View>
                            )
                        }


                        <View style={styles.media}>
                            <Text style={styles.addImageText}>Add to your post</Text>
                            <View style={styles.mediaIcon}>
                                <TouchableOpacity onPress={() => onPick(true)} >
                                    <Icon name='image' size={30} color={theme.colors.drak} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => onPick(false)} >
                                    <Icon name='video' size={33} color={theme.colors.drak} />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </ScrollView>
                
                <Button buttonStyle={{ height: hp(6.2) }} loading={loading} title="Post" onPress={onSubmit} />
            </View>
            </TouchableWithoutFeedback>
        </SrceenWapper>
    )
}

export default NewPost;

const styles = StyleSheet.create({
    imageIcon: {
        // backgroundColor: 'gray',
        borderRadius: theme.radius.md,
        // padding: 6,
    },
    file: {
        height: hp(30),
        width: '100%',
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        borderCurve: 'continous',
    },
    video: {

    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 0, 0, 0.6)',
        padding: 7,
        boderRadius: '50%',
        // shadowColor: theme.colors.textLight,
        // shadowOffset: { width: 0, height: 3 },
        // shadowOpacity: 0.6,
        // shadowRadius: 8,
    },
    addImageText: {
        fontSize: hp(1.9),
        fontWeight: theme.fonts.semiBold,
        color: theme.colors.text,
    },
    media: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1.5,
        padding: 12,
        paddingHorizontal: 18,
        borderRadius: theme.radius.xl,
        borderCurve: 'continous',
        borderColor: theme.colors.gray,
    },
    textEditor: {
        // marginTop: 10,
    },
    publicText: {
        fontSize: hp(1.7),
        fontWeight: theme.fonts.medium,
        color: theme.colors.textLight,
    },
    avatar: {
        width: hp(6.5),
        height: hp(6.5),
        borderRadius: theme.radius.xl,
        borderCurve: 'continous',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    username: {
        fontSize: hp(2.2),
        fontWeight: theme.fonts.semiBold,
        color: theme.colors.text,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    title: {
        fontSize: hp(2.5),
        fontWeight: theme.fonts.semiBold,
        color: theme.colors.text,
        textAlign: 'center',
        // marginBottom: 10,
    },
    container: {
        marginBottom: 30,
        paddingHorizontal: wp(4),
        gap: 15,
        // backgroundColor: 'red',
        flex: 1,
    },
    mediaIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    }
});