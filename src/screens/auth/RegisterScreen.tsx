import { CustomDropdown } from "@/src/components/common/CustomDropdown";
import { InputField } from "@/src/components/common/InputField";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import { COURSE_OPTIONS, YEAR_OPTIONS } from "@/src/constants/education";
import { RegisterPayload } from "@/src/types/auth";
import { CourseType } from "@/src/types/course";
import React, { useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type RegisterErrors = {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  course?: string;
  year?: string;
  general?: string;
};

interface Props {
  onNavigate: () => void;
  onRegister: (data: RegisterPayload) => void;
  isLoading: boolean;
  onGoogleRegister: () => void;
  errors: RegisterErrors;
  setErrors: React.Dispatch<React.SetStateAction<RegisterErrors>>;
}

export default function RegisterScreen({
  onNavigate,
  onRegister,
  isLoading,
  onGoogleRegister,
  errors,
  setErrors,
}: Props) {
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [course, setCourse] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const handleCourseSelect = (selectedCourse: string) => {
    setCourse(selectedCourse);
    if (errors.course) setErrors({ ...errors, course: undefined });

    const validYears = YEAR_OPTIONS[selectedCourse as CourseType];
    if (year && !validYears.includes(year)) {
      setYear("");
    }
  };

  const handleSubmit = () => {
    setErrors({});
    let newErrors: RegisterErrors = {};

    if (!firstname) newErrors.firstname = "First name is required.";
    if (!lastname) newErrors.lastname = "Last name is required.";
    if (!email) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";
    if (!course) newErrors.course = "Course is required.";
    if (!year) newErrors.year = "Year level is required.";

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.password = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onRegister({
      firstname,
      lastname,
      email,
      password,
      password_confirmation: confirmPassword,
      course,
      year,
    });
  };

  return (
    <SafeAreaView className="bg-background dark:bg-dark-bg flex-1 justify-center pb-5 px-8">
      <View className="items-center my-6 self-start">
        <Text className="text-2xl font-bold text-foreground self-start dark:text-dark-fg">
          Create an account
        </Text>
        <Text className="text-muted-fg dark:text-dark-muted-fg text-center mt-1">
          Join La Verdad Club Integrated System
        </Text>
      </View>

      {errors.general && (
        <View className="bg-red-500/10 p-3 rounded-lg mb-4 border border-red-500/50">
          <Text className="text-red-500 font-medium text-center">
            {errors.general}
          </Text>
        </View>
      )}

      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <InputField
            label="First name"
            placeholder="First name"
            value={firstname}
            onChangeText={(text) => {
              setFirstname(text);
              if (errors.firstname)
                setErrors({ ...errors, firstname: undefined });
            }}
            error={errors.firstname}
          />
        </View>
        <View className="flex-1">
          <InputField
            label="Last name"
            placeholder="Last name"
            value={lastname}
            onChangeText={(text) => {
              setLastname(text);
              if (errors.lastname)
                setErrors({ ...errors, lastname: undefined });
            }}
            error={errors.lastname}
          />
        </View>
      </View>

      <InputField
        label="Email address"
        placeholder="Enter your email"
        keyboardType="email-address"
        containerStyles="mb-4"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) setErrors({ ...errors, email: undefined });
        }}
        autoCapitalize="none"
        error={errors.email}
      />

      <InputField
        label="Password"
        placeholder="Set a password"
        isPassword={true}
        containerStyles="mb-4"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) setErrors({ ...errors, password: undefined });
        }}
        error={errors.password}
      />

      <InputField
        label="Confirm Password"
        placeholder="Confirm password"
        isPassword={true}
        containerStyles="mb-4"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <View className="flex-row gap-3 mb-8">
        <View className="flex-1">
          <CustomDropdown
            label="Course"
            value={course}
            options={COURSE_OPTIONS}
            onSelect={handleCourseSelect}
            error={errors.course}
            placeholder="Select Course"
          />
        </View>

        <View className="flex-1">
          <CustomDropdown
            label="Year Level"
            value={year}
            options={course ? YEAR_OPTIONS[course as CourseType] : []}
            onSelect={(selected) => {
              setYear(selected);
              if (errors.year) setErrors({ ...errors, year: undefined });
            }}
            error={errors.year}
            placeholder={course ? "Select Year" : "Choose course"}
            emptyMessage={
              course
                ? "No year levels available"
                : "Please select a course first."
            }
          />
        </View>
      </View>

      <View className="mb-6 w-full">
        <PrimaryButton
          title="Sign up"
          isLoading={isLoading}
          onPress={handleSubmit}
        />
      </View>

      <View className="flex-row justify-center mt-6">
        <Text className="text-muted-fg dark:text-dark-muted-fg">
          Already have an account?{" "}
        </Text>
        <TouchableOpacity onPress={onNavigate}>
          <Text className="text-primary dark:text-dark-primary font-bold">
            Sign in.
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center my-6">
        <View className="flex-1 h-[1px] bg-border dark:bg-dark-border" />
        <Text className="mx-4 text-muted-fg dark:text-dark-muted-fg text-sm">
          Or continue with
        </Text>
        <View className="flex-1 h-[1px] bg-border dark:bg-dark-border" />
      </View>

      <Pressable
        onPress={onGoogleRegister}
        className="border border-border dark:border-dark-border h-14 rounded-xl items-center justify-center flex-row active:bg-muted dark:active:bg-dark-muted"
      >
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
          }}
          className="w-5 h-5 mr-3"
        />
        <Text className="font-semibold text-secondary-fg dark:text-dark-secondary-fg">
          Continue with Google
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
