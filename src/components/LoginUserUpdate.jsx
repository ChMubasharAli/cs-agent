import { Button, PasswordInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { RxCheck, RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import apiClient from "../api/axios";

export default function LoginUserUpdate() {
  // Controlled inputs so we can clear them reliably
  const [passwordValues, setPasswordValues] = useState({
    password: "",
    confirmPassword: "",
  });

  // Safe access to id to avoid destructuring undefined
  const id = useSelector((state) => state.auth.userData?.id);

  // Mutation returns the axios promise (critical!)
  const updateMutation = useMutation({
    mutationFn: ({ id, password }) =>
      apiClient.put(`/api/agents/${id}`, { password }),

    onSuccess: (response) => {
      notifications.show({
        title: "Success",
        message: "Password updated successfully",
        color: "green",
        icon: <RxCheck size={18} />,
        position: "top-right",
        autoClose: 4000,
      });

      console.log("Response Data is :", response.data);
      // Clear inputs after success
      setPasswordValues({ password: "", confirmPassword: "" });
    },

    onError: (error) => {
      // Optional: show server message if present
      const msg =
        error?.response?.data?.message ||
        "Failed to update password. Please try again.";
      notifications.show({
        title: "Error",
        message: msg,
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  const handleUpdate = () => {
    const { password, confirmPassword } = passwordValues;

    // Basic validations
    if (!id) {
      notifications.show({
        title: "No user",
        message: "User ID not found. Please sign in again.",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    if (!password || !confirmPassword) {
      notifications.show({
        title: "Missing fields",
        message: "Please enter and confirm your new password.",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    if (password.length < 6) {
      notifications.show({
        title: "Weak password",
        message: "Password should be at least 6 characters.",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (password !== confirmPassword) {
      notifications.show({
        title: "Password mismatch",
        message:
          "Your new password and confirmation do not match. Please try again.",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
      return; // ⛔ do NOT call mutate
    }

    // ✅ Valid → run mutation (pass variables instead of closing over state)
    updateMutation.mutate({ id, password });
  };

  return (
    <section className="p-4">
      {/* Remove this in production; useful for quick debugging */}
      {/* <pre>{JSON.stringify({ id }, null, 2)}</pre> */}

      <PasswordInput
        classNames={{ label: "mb-1" }}
        radius="md"
        label="New Password"
        placeholder="New password"
        mb="md"
        required
        value={passwordValues.password}
        onChange={(e) =>
          setPasswordValues((prevValue) => ({
            ...prevValue,
            password: e.target.value,
          }))
        }
      />

      <PasswordInput
        classNames={{ label: "mb-1" }}
        radius="md"
        label="Confirm Password"
        placeholder="Confirm password"
        mb="md"
        required
        value={passwordValues.confirmPassword}
        onChange={(e) =>
          setPasswordValues((prevValue) => ({
            ...prevValue,
            confirmPassword: e.target.value,
          }))
        }
      />

      <Button
        // v5: isPending; if you’re on v4, switch to isLoading
        loading={updateMutation.isPending}
        disabled={updateMutation.isPending || !id}
        onClick={handleUpdate}
        loaderProps={{ type: "bars" }}
        fullWidth
        radius="md"
        size="sm"
        classNames={{ root: "!bg-primary hover:!bg-primary-hover" }}
      >
        Update Password
      </Button>
    </section>
  );
}
