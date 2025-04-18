import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import BackButton from "../components/BackButton"
import { theme } from "../constants/theme";
import { hp } from "../helper/common";


const Header = ({title, showButtonBack=true, mb=10}) => {
    const router = useRouter();
    return (
        <View style={[styles.container, {marginBottom: mb}]}>
            {
                showButtonBack && (
                    <View style={styles.backButton}>
                        <BackButton router={router} />
                    </View>
                )
            }
            <Text style={styles.title}>{title || ""}</Text>
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    container:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
        gap: 10,
    },
    title:{
        fontSize: hp(3),
        fontWeight: theme.fonts.semiBold,
        color: theme.colors.textDark,
    },
    backButton:{
        position: "absolute",
        left: 0,
    },
})