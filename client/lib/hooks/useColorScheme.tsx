import { useColorScheme as useNativeColorScheme } from "nativewind";

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativeColorScheme();

  return {
    colorScheme: colorScheme ?? "dark",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme,
    toggleColorScheme,
  };
}
