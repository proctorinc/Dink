import React from "react";
import { api } from "@utils/api";

const Test = () => {
  const hello = api.example.hello.useQuery({ text: "from TRPC" });
  return <div>{hello.data ? hello.data.greeting : "Loading..."}</div>;
};

export default Test;
