import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";

const SafeScreen = ({ children }) => {
  const inset = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: inset.top,
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;
