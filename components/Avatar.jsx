import { hp } from '../helper/common';
import { theme } from '../constants/theme';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { getUserImageSrc } from '../services/imageService';

const Avatar = ({
    url,
    size = hp(4.5),
    rounded = theme.radius.md,
    style,
}) => {
    return (
        <Image source={getUserImageSrc(url)} transition={100} style={[styles.avatar, { height: size, width: size, borderRadius: rounded }, style]} />
    )
}

export default Avatar;

const styles = StyleSheet.create({
    avatar: {
        borderCurve: 'continuous',
        backgroundColor: theme.colors.drakLight,
        borderWidth: 1,
    },
})