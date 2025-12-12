import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Switch, Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import apiClient from "../api/axios";
import { RxCheck, RxCross2 } from "react-icons/rx";

const CustomerSatisfactionToggler = ({
  callId,
  initialSatisfied,
  switchSize = "xl",
  textSize = "xs",
  onToggleSuccess, // Naya prop add karenge
}) => {
  const queryClient = useQueryClient();

  const { mutate: toggleSatisfaction, isPending: isToggling } = useMutation({
    mutationFn: () => apiClient.patch(`/api/call/${callId}/satisfied`),
    onSuccess: (response) => {
      // Individual call refresh
      queryClient.invalidateQueries(["call", callId]);

      // Calls list refresh - IMPORTANT
      queryClient.invalidateQueries(["calls"]);

      // Notify parent component if callback provided
      if (onToggleSuccess && response?.data) {
        onToggleSuccess(response.data.data);
      }

      notifications.show({
        title: "Success",
        message: "Customer satisfaction updated",
        color: "green",
        icon: <RxCheck size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Failed to update customer satisfaction",
        color: "red",
        icon: <RxCross2 size={18} />,
        position: "top-right",
        autoClose: 4000,
      });
    },
  });

  return (
    <div className="flex items-center justify-between bg-green-50 p-4 rounded-xl border border-green-200">
      <p className={`text-${textSize} font-medium `}>
        Is user satisfied with call ?
      </p>
      {isToggling ? (
        <Loader color="green" type="dots" size={"lg"} />
      ) : (
        <Switch
          checked={initialSatisfied}
          onChange={toggleSatisfaction}
          classNames={{ trackLabel: "!text-base" }}
          onLabel="Yes"
          offLabel="No"
          disabled={isToggling}
          size={switchSize}
          color={"blue"}
        />
      )}
    </div>
  );
};

export default CustomerSatisfactionToggler;
