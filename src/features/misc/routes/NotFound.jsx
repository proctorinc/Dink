import { useNavigate } from "react-router-dom";

import { Button } from "@/components/Elements/Button";

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex text-center justify-center items-center bg-black h-screen">
      <div className="bg-clip-text font-extrabold text-transparent">
        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-50 to-gray-900">
          404
        </h1>
        <h3 className="text-3xl font-extralight text-gray-700">Not Found</h3>
        <div className="py-10">
          <Button text="Go to Dink" onClick={() => navigate("/")} />
        </div>
      </div>
    </div>
  );
};
