import { Loader } from "@mantine/core";
import React from "react";

export default function LoaderComp() {
  return (
    <div className="flex items-center justify-center ">
      <Loader color="#0ea5e9" size={"sm"} type="bars" my={"md"} />
    </div>
  );
}
