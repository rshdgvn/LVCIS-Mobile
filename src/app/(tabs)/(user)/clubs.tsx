import React, { useState } from "react";
import { Href, useRouter } from "expo-router";
import { View } from "react-native";
import { useFilteredClubs } from "@/src/hooks/useClubs";
import { ClubViewFilter } from "@/src/types/club";
import { ClubCategory } from "@/src/types/club";
import ClubsScreen from "@/src/screens/private/clubs/ClubsScreen";

export default function ClubsRoute() {
  const router = useRouter();
  
  const [selectedCategory, setSelectedCategory] = useState<ClubCategory | undefined>(undefined);
  const [viewFilter, setViewFilter] = useState<ClubViewFilter>("all");

  const { data: clubs, isLoading } = useFilteredClubs(viewFilter, selectedCategory);

  const handleAccessClub = (clubId: number) => {
    router.push(`/clubs/${clubId}` as Href);
  };

  return (
    <View className="flex-1">
      <ClubsScreen
        clubs={clubs}
        isLoading={isLoading}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        viewFilter={viewFilter}
        onSelectViewFilter={setViewFilter}
        onAccessClub={handleAccessClub}
      />
    </View>
  );
}