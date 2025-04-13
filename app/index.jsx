import Loading from "@/components/Loading";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function Index() {

  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Loading />
    </View>
  );
}
