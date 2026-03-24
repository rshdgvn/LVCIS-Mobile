import { useTheme } from "@/src/hooks/useTheme";
import { membershipService } from "@/src/services/membershipService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  clubId: number;
}

export const ClubApplicationsTab = ({ clubId }: Props) => {
  const { primaryColor } = useTheme();
  const queryClient = useQueryClient();

  const { data: applicants = [], isLoading } = useQuery({
    queryKey: ["pendingApplicants", clubId],
    queryFn: () => membershipService.getPendingRequests(clubId),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: number;
      status: "approved" | "rejected";
    }) => membershipService.updateMembershipStatus(clubId, userId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pendingApplicants", clubId],
      });

      queryClient.invalidateQueries({ queryKey: ["club", clubId] });

      Alert.alert("Success", `Applicant has been ${variables.status}.`);
    },
    onError: (error) => {
      console.error(error);
      Alert.alert("Error", "Failed to update application status.");
    },
  });

  if (isLoading) {
    return (
      <View className="py-10 items-center justify-center">
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <View className="flex-1 mt-2">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-sm font-semibold text-muted-fg dark:text-dark-muted-fg uppercase tracking-wider">
          Pending Request
        </Text>
        <Text className="text-sm font-semibold text-muted-fg dark:text-dark-muted-fg">
          {applicants.length} Total
        </Text>
      </View>

      {applicants.length === 0 ? (
        <View className="py-10 items-center border border-dashed border-border dark:border-dark-border rounded-xl">
          <Text className="text-muted-fg dark:text-dark-muted-fg py-8">
            No pending applications at the moment.
          </Text>
        </View>
      ) : (
        applicants.map((applicant) => {
          const isProcessing =
            updateStatusMutation.isPending &&
            updateStatusMutation.variables?.userId === applicant.user_id;

          return (
            <View
              key={applicant.user_id}
              className={`border border-border dark:border-dark-border rounded-xl p-4 mb-4 bg-card dark:bg-dark-card shadow-sm ${
                isProcessing ? "opacity-50" : "opacity-100"
              }`}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-row flex-1">
                  <Image
                    source={{
                      uri:
                        applicant.avatar || "https://via.placeholder.com/150",
                    }}
                    className="w-12 h-12 rounded-full border border-border dark:border-dark-border bg-muted dark:bg-dark-muted"
                  />
                  <View className="ml-3 flex-1">
                    <Text
                      className="text-base font-bold text-card-fg dark:text-dark-card-fg"
                      numberOfLines={1}
                    >
                      {applicant.first_name} {applicant.last_name}
                    </Text>
                    <Text className="text-sm text-muted-fg dark:text-dark-muted-fg mt-0.5">
                      {applicant.course || "No Course"} •{" "}
                      {applicant.year_level || "N/A"}
                    </Text>
                  </View>
                </View>

                <Text className="text-xs text-muted-fg dark:text-dark-muted-fg ml-2 whitespace-nowrap">
                  {applicant.requested_at}
                </Text>
              </View>

              <View className="flex-row items-center mt-4 gap-x-3">
                <TouchableOpacity
                  disabled={isProcessing}
                  className="border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 py-2 rounded-lg flex-1 items-center"
                  onPress={() =>
                    updateStatusMutation.mutate({
                      userId: applicant.user_id,
                      status: "approved",
                    })
                  }
                >
                  <Text className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                    Approved
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={isProcessing}
                  className="border border-red-200 bg-red-50 dark:bg-red-900/20 py-2 rounded-lg flex-1 items-center"
                  onPress={() =>
                    updateStatusMutation.mutate({
                      userId: applicant.user_id,
                      status: "rejected",
                    })
                  }
                >
                  <Text className="text-red-500 dark:text-red-400 font-semibold text-sm">
                    Reject
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
};
