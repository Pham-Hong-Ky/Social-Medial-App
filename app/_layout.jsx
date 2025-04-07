import { Stack } from "expo-router";

const _layout = ({  }) => {
  return (
    <Stack 
        screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#fff" },
        }}
    />
  );
}

export default _layout;