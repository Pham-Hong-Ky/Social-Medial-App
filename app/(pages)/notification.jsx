import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { fecthNotifications } from "../../services/notificationService";
import { wp, hp } from "../../helper/common";
import { theme } from "../../constants/theme";
import ScreenWapper from "../../components/ScreenWrapper";
import NotificationItem from "../../components/NotificationItem";
import Header from "../../components/Header";
import { useRouter } from "expo-router";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const Notification = () => {
    const { user } = useAuth();
    const [notification, setNotification] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        getNotification();
    }, []);

    const getNotification = async () => {
        let result = await fecthNotifications(user.id);
        if (result.success) {
            setNotification(result.data);
        } else {

        }
    }

    return (
        <View style={styles.container}>
            <ScreenWapper >
                <Header title="Notifications" mb={50} showButtonBack={true} />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.istStyle} >
                    {
                        notification.map(item => {
                            return (
                                <NotificationItem item={item} key={item?.id} router={router} />
                            )
                        })
                    }
                    {
                        notification.length === 0 && (
                            <Text style={styles.noData}>No notifications yet! </Text>
                        )
                    }
                </ScrollView>
            </ScreenWapper>
        </View>
    )
}

export default Notification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(6),
    },
    listStyle: {
        paddingVertical: wp(2),
        gap: 10,
    },
    noData: {
        fontSize: hp(1.8),
        fontWeight: theme.fonts.medium,
        color: theme.colors.text,
        textAlign: 'center',
    }
})