import { SheetManager, SheetProvider } from "react-native-actions-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "./sheets";
import { TouchableOpacity } from "react-native";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    SheetManager.show("current-timer");
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className="flex">
        <SheetProvider context="global">
          <SafeAreaView />
        </SheetProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
