import { useColorScheme } from "react-native";

export function useTheme() {
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";
  const bgColor = isDark ? "#1c1e26" : "#ffffff";
  const mutedFgColor = isDark ? "#adb2c3" : "#848a9e";

  const gradientTop = isDark ? "rgba(28, 30, 38, 0)" : "rgba(255, 255, 255, 0)";
  const gradientBottom = isDark ? "#1c1e26" : "#ffffff";

  return {
    isDark,
    mutedFgColor,
    bgColor,
    gradientTop,
    gradientBottom,
  };
}
