import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ClubDetailsTab } from "./ClubDetailsTab";
import { ClubMembersTab } from "./ClubMembersTab";

interface Props {
  clubId: number;
  clubDescription?: string | null;
}

type TabType = "Details" | "Members"  | "Applications";

export const ClubTabsContainer = ({ clubId, clubDescription }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>("Members");

  const tabs: TabType[] = ["Details", "Members",  "Applications"];

  return (
    <View className="flex-1 mt-6">
      <View className="flex-row border-b border-border/50 dark:border-dark-border/50 mb-4 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-3 items-center border-b-2 ${
                isActive
                  ? "border-primary dark:border-dark-primary"
                  : "border-transparent"
              }`}
            >
              <Text
                className={`text-[15px] font-semibold ${
                  isActive
                    ? "text-foreground dark:text-dark-fg"
                    : "text-muted-fg dark:text-dark-muted-fg"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {activeTab === "Details" && (
          <ClubDetailsTab description={clubDescription} />
        )}

        {activeTab === "Members" && <ClubMembersTab clubId={clubId} />}

        {activeTab === "Applications" && (
          <View className="py-10 items-center border border-dashed border-border dark:border-dark-border rounded-xl mt-2">
            <Text className="text-muted-fg dark:text-dark-muted-fg py-8">
              Applications tab coming soon...
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
