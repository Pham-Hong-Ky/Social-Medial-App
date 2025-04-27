import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "../constants/theme";
import { hp } from "../helper/common";
import Avatar from "./Avatar";
import moment from "moment";

const NotificationItem = ({
    item,
    router,
}) => {
    const created_at = moment(item?.created_at).format('MMM d');

    const handelClick = () => {
        let { postId, commentId } = JSON.parse(item?.data);
        router.back();
        router.push({pathname: '(pages)/postDetails', params: { postId, commentId } });
    }

    return (
        <TouchableOpacity style={styles.container} onPress={handelClick}>
            <Avatar url={item?.senderId?.image} size={hp(5)} />
            <View style={styles.nameTitle}>
                <Text style={styles.text}>
                    {
                        item?.sender?.name
                    }
                </Text>
                <Text style={[styles.text, { color: theme.colors.textDark }]}>
                    {
                        item?.title
                    }
                </Text>
            </View>
            <Text style={[styles.text, { color: theme.colors.textLight }]}>
                {
                    created_at
                }
            </Text>
        </TouchableOpacity>
    )
}

export default NotificationItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.drakLight,
        padding: 15,
        borderRadius: theme.radius.xxl,
        borderCurved: 'continuous',
    },
    nameTitle: {
        flex: 1,
        gap: 2,
    },
    text: {
        fontSize: hp(1.6),
        color: theme.colors.text,
        fontWeight: theme.fonts.medium,
    },
})