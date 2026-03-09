import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import { useState } from "react";
import { ChevronDown } from "lucide-react-native";



export const CustomDropdown = ({ label, value, options, onSelect }: { 
  label: string; 
  value: string; 
  options: string[]; 
  onSelect: (val: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-muted-fg mb-1">{label}</Text>
      
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsOpen(true)}
        className="flex-row items-center justify-between bg-muted rounded-xl px-4 py-3"
      >
        <Text className="text-foreground text-base">
          {label === "Year Level" ? `${value}${value.length === 1 ? '' : ''}` : value}
        </Text>
        <ChevronDown size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="slide">
        <Pressable className="flex-1 bg-black/40 justify-end" onPress={() => setIsOpen(false)}>
          <View className="bg-white dark:bg-dark-bg rounded-t-3xl p-6 pb-10">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6" />
            <Text className="text-lg font-bold mb-4 text-foreground dark:text-dark-fg">Select {label}</Text>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item);
                    setIsOpen(false);
                  }}
                  className={`p-4 mb-2 rounded-xl ${value === item ? 'bg-blue-50 border border-blue-200' : 'bg-muted'}`}
                >
                  <Text className={`text-base ${value === item ? 'text-blue-600 font-bold' : 'text-foreground'}`}>
                    {label === "Year Level" ? `${item}` : item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};
