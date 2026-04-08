import { CustomAlertDialog } from "@/src/components/common/CustomAlertDialog";
import { useTheme } from "@/src/hooks/useTheme";
import { membershipService } from "@/src/services/membershipService";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface Props {
  clubId: number;
}

export const ClubApplicationsTab = ({ clubId }: Props) => {
  const { primaryColor } = useTheme();
  const queryClient = useQueryClient();

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [actionType, setActionType] = useState<"approved" | "rejected" | null>(null);

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

      setIsDialogVisible(false);
      setSelectedApplicant(null);
      setActionType(null);

      Toast.show({
        type: "success",
        text1: `Applicant has been ${variables.status}.`,
      });
    },
    onError: (error) => {
      console.error(error);
      setIsDialogVisible(false);
      Toast.show({
        type: "error",
        text1: "Failed to update application status.",
      });
    },
  });

  const handleOpenDialog = (applicant: any, action: "approved" | "rejected") => {
    setSelectedApplicant(applicant);
    setActionType(action);
    setIsDialogVisible(true);
  };

  const handleConfirmAction = () => {
    if (!selectedApplicant || !actionType) return;
    updateStatusMutation.mutate({
      userId: selectedApplicant.user_id,
      status: actionType,
    });
  };

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
        applicants.map((applicant: any) => {
          const isProcessing =
            updateStatusMutation.isPending &&
            updateStatusMutation.variables?.userId === applicant.user_id;

          return (
            <View
              key={applicant.user_id}
              className={`flex-row items-center justify-between border border-border dark:border-dark-border rounded-xl p-4 mb-4 bg-card dark:bg-dark-card shadow-sm ${
                isProcessing ? "opacity-50" : "opacity-100"
              }`}
            >
              {/* Left Side: Avatar and Info */}
              <View className="flex-row items-center flex-1">
                <Image
                  source={{
                    uri: applicant.avatar || "https://via.placeholder.com/150",
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
                    {applicant.course || "No Course"} {applicant.year_level ? `${applicant.year_level}` : ""}
                  </Text>
                </View>
              </View>

              {/* Right Side: Action Icons */}
              <View className="flex-row items-center gap-x-5 ml-2">
                <TouchableOpacity
                  disabled={isProcessing}
                  onPress={() => handleOpenDialog(applicant, "approved")}
                  className="p-1"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="checkmark-sharp" size={24} color="#10b981" />
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={isProcessing}
                  onPress={() => handleOpenDialog(applicant, "rejected")}
                  className="p-1"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close-sharp" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}

      <CustomAlertDialog
        visible={isDialogVisible}
        title={actionType === "approved" ? "Approve Application" : "Reject Application"}
        message={`Are you sure you want to ${
          actionType === "approved" ? "approve" : "reject"
        } ${selectedApplicant?.first_name || "this user"}'s club application?`}
        cancelText="Cancel"
        confirmText={actionType === "approved" ? "Approve" : "Reject"}
        isDestructive={actionType === "rejected"}
        isLoading={updateStatusMutation.isPending}
        onCancel={() => {
          setIsDialogVisible(false);
          setSelectedApplicant(null);
          setActionType(null);
        }}
        onConfirm={handleConfirmAction}
      />
    </View>
  );
};