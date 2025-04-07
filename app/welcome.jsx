import  ScreenWrapper  from "@/components/ScreenWrapper";
import  Button  from "@/components/Button";
import { StatusBar, StyleSheet, View, Image, Text, Pressable } from "react-native";
import { wp, hp } from "@/helper/common";
import { theme } from "@/constants/theme";
import { useRouter } from "expo-router";

const welcome = () => {

  const router = useRouter();

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="drak" />
      <View style={styles.container}>
        <Image
          style={styles.welcomeImage}
          resizeMode="contain"
          source={require("../assets/images/image.png")}
        />

        <View style={{ gap: 20 }}>
          <Text style={styles.title}>LinkUp!</Text>
          <Text style={styles.punchLine}>
            Where every thought finds a home and evary image tells a story.
          </Text>
        </View>

        <View style={styles.footer}>
          <Button
            title="Getting started"
            buttonStyle={{ marginHorizontal: wp(3) }}
            onPress={() => router.push('signUp')}
          />
          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>
            <Pressable  onPress={() => router.push('login')}>
              <Text style={[styles.loginText, { color: theme.colors.primaryDark, fontWeight: theme.fonts.semiBold }]}>
                Login
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: wp(4),
  },
  welcomeImage: {
    width: wp(100),
    height: hp(30),
    alignSelf: "center",
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: "center",
    fontFamily: theme.fonts.extraBold,
  },
  punchLine: {
    fontSize: hp(1.7),
    textAlign: "center",
    paddingHorizontal: wp(10),
    color: theme.colors.text,
  },
  footer: {
    gap: 30,
    width: "100%",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5
  },
  loginText: {
    textAlign: "center",
    fontSize: hp(1.6),
    color: theme.colors.text,
  },
});
