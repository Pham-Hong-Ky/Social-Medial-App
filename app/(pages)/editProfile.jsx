import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { Image, Pressable, ScrollView, StyleSheet, View, Text, Alert } from "react-native";
import { hp, wp } from "../../helper/common";
import { theme } from "../../constants/theme";
import ScreenWapper from "../../components/ScreenWrapper"
import Header from "../../components/Header";
import { getUserImageSrc, uploadImageFromPhone } from "../../services/imageService";
import Icon from "../../assets/icons";
import Input from "../../components/Input";
import { useState, useEffect } from "react";
import Button from "../../components/Button";
import { updateUser } from "../../services/userService";
import * as ImagePicker from 'expo-image-picker';
import { upLoadFile } from "../../services/imageService";

const EditProfile = () => {

    const router = useRouter();
    const { user: currentUser, setUserData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(file);

    const [user, setUser] = useState({
        name: '',
        phoneNumber: '',
        bio: '',
        image: null,
        address: '',
    });

    useEffect(() => {
        if (currentUser) {
            setUser({
                name: currentUser.name || '',
                phoneNumber: currentUser.phoneNumber || '',
                bio: currentUser.bio || '',
                image: currentUser.image || null,
                address: currentUser.address || '',
            })
        }
    }, [currentUser])

    const onPickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            // mediaTypes: ImagePicker.MediaTypeOptions.All,
            mediaTypes: ImagePicker.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setUser({ ...user, image: result.assets[0].uri });
            setFile(result.assets[0]);
        }
    }

    const onSubmit = async () => {
        let userData = { ...user }
        let { name, phoneNumber, bio, image, address } = userData;
        if (!name || !phoneNumber || !bio || !address || !image) {
            Alert.alert("Edit Profile", "Please fill all the fields")
            return
        }
        setLoading(true);

        if (typeof image == 'object') {
            console.log("image", image)
            let imageRes = await upLoadFile('profiles', image?.uri, true);

            if (imageRes.success) {
                userData.image = imageRes.data;
            } else {
                userData.image = null;
            }
        } else {
            let resUpload = await uploadImageFromPhone(file);
            if (resUpload.success) {
                userData.image = resUpload.data;
            } else {
                userData.image = null;
            }
        }
        // console.log("userData", userData);

        const res = await updateUser(currentUser.id, userData);
        setLoading(false)

        if (res.success) {
            setUserData({ ...currentUser, ...userData });
            router.back()
        }
    }

    let imageSrc = user.image && typeof user.image == 'object' ? user.image.uri : getUserImageSrc(user.image);

    return (
        <ScreenWapper>
            <View style={styles.container}>
                <ScrollView style={{ flex: 1 }} >
                    <Header title="Edit Profile" />

                    <View style={styles.form}>
                        <View style={styles.avatarContainer}>
                            <Image source={imageSrc} style={styles.avatar} />
                            <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                                <Icon name="camera" size={20} strokeWidth={2.5} />
                            </Pressable>
                        </View>
                        <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
                            Pleas fill your profile details
                        </Text>
                        <Input
                            icon={<Icon name="user" />}
                            placeholder="Enter your name"
                            onChangeText={(value) => setUser({ ...user, name: value })}
                            value={user.name}
                        />
                        <Input
                            icon={<Icon name="call" />}
                            placeholder="Enter your phone number"
                            onChangeText={(value) => setUser({ ...user, phoneNumber: value })}
                            value={user.phoneNumber}
                        />
                        <Input
                            icon={<Icon name="location" />}
                            placeholder="Enter your address"
                            onChangeText={(value) => setUser({ ...user, address: value })}
                            value={user.address}
                        />
                        <Input
                            containerStyle={styles.bio}
                            placeholder="Enter your bio"
                            multiline={true}
                            onChangeText={(value) => setUser({ ...user, bio: value })}
                            value={user.bio}
                        />

                        <Button title="Update" loading={loading} onPress={onSubmit} />
                    </View>
                </ScrollView>
            </View>
        </ScreenWapper>
    )
}

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4),
    },
    avatarContainer: {
        alignSelf: "center",
        height: hp(14),
        width: hp(14),
    },
    bio: {
        flexDirection: "row",
        height: hp(15),
        alignItems: "flex-start",
        paddingVertical: 15,
    },
    input: {
        flexDirection: "row",
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xXl,
        borderCurve: 'continuous',
        padding: 17,
        paddingHorizontal: 20,
        gap: 15,
    },
    form: {
        gap: 18,
        marginTop: 20,
    },
    cameraIcon: {
        position: "absolute",
        bottom: 0,
        right: -10,
        padding: 8,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowColor: theme.colors.textLight,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: theme.radius.xxl * 1.8,
        borderCurve: 'continuous',
        boderWidth: 1,
        borderColor: theme.colors.drakLight,
    }
})