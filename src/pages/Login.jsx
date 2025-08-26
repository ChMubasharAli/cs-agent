import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { TextInput, PasswordInput, Button, Text, Paper } from "@mantine/core";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axios";

const loginUser = async ({ email, password }) => {
  const response = await apiClient.post("/api/login", { email, password });
  return response.data;
};

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      notifications.show({
        title: "Success",
        message: "You have successfully logged in!",
        color: "#0ea5e9", // primary
        autoClose: 3000,
      });

      const userData = data.agent;
      const token = data.token;

      if (userData && token) dispatch(authLogin({ userData, token }));

      if (userData.role === "admin") navigate("/admin");
    },
    onError: (error) => {
      console.log(error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Invalid email or password",
        color: "#f43f5e", // accent
        autoClose: 5000,
      });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-background to-secondary p-4">
      <Paper
        radius="lg"
        shadow="xl"
        className="w-full max-w-md p-8 bg-background/90 backdrop-blur-sm"
      >
        <Text
          size="xl"
          weight={700}
          ta={"center"}
          fw={"bold"}
          fz={"h1"}
          classNames={{ root: "!text-primary" }}
        >
          Welcome Back
        </Text>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextInput
            classNames={{ label: "mb-1" }}
            radius="md"
            label="Email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            size="md"
          />

          <PasswordInput
            classNames={{ label: "mb-1" }}
            radius="md"
            label="Password"
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            size="md"
          />

          <Button
            type="submit"
            fullWidth
            radius="md"
            size="md"
            loading={mutation.isPending}
            loaderProps={{ type: "bars" }}
            classNames={{ root: "!bg-primary hover:!bg-primary-hover" }}
          >
            Log In
          </Button>
          {/* <Text size="sm" className="text-center text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-primary hover:text-primary-hover font-medium"
              >
                Sign Up
              </a>
            </Text> */}
        </form>
      </Paper>
    </div>
  );
};

export default LoginPage;
