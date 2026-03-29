import { ClubCategory, ClubViewFilter } from "@/src/types/club";
import { Alert } from "react-native";

export const getFilterLabel = (viewFilter: ClubViewFilter): string => {
  switch (viewFilter) {
    case "my":
      return "My Clubs";
    case "pending":
      return "Pending";
    case "other":
      return "Other Clubs";
    default:
      return "All Clubs";
  }
};

export const showViewFilterAlert = (
  onSelectViewFilter: (filter: ClubViewFilter) => void,
) => {
  Alert.alert("Filter Clubs", "Choose which clubs to display:", [
    { text: "All Clubs", onPress: () => onSelectViewFilter("all") },
    { text: "My Clubs", onPress: () => onSelectViewFilter("my") },
    { text: "Pending Requests", onPress: () => onSelectViewFilter("pending") },
    { text: "Other Clubs", onPress: () => onSelectViewFilter("other") },
    { text: "Cancel", style: "cancel" },
  ]);
};

export const showCategoryFilterAlert = (
  onSelectCategory: (category: ClubCategory | undefined) => void,
) => {
  Alert.alert("Select Category", "Filter by club category:", [
    { text: "All Categories", onPress: () => onSelectCategory(undefined) },
    { text: "Academics", onPress: () => onSelectCategory("academics") },
    {
      text: "Culture & Performing Arts",
      onPress: () => onSelectCategory("culture_and_performing_arts"),
    },
    {
      text: "Socio-Politics",
      onPress: () => onSelectCategory("socio_politics"),
    },
    { text: "Cancel", style: "cancel" },
  ]);
};
