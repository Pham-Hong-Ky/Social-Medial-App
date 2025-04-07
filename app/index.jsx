import SrceenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function Index() {

  const router = useRouter();

  return (
    <SrceenWrapper>
      <Text>Social Media App</Text>
      <Button title="welcome" onPress={() => router.push('welcome')}></Button>
    </SrceenWrapper>
  );
}
