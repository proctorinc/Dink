import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoadingPage = () => {
  return (
    <main className="flex flex-grow flex-col items-center justify-center text-white">
      <div className="flex w-full max-w-md flex-grow flex-col items-center justify-center px-4">
        <div className="animate-spin">
          <FontAwesomeIcon
            size="3x"
            className="text-primary-light"
            icon={faCircleHalfStroke}
          />
        </div>
      </div>
    </main>
  );
};

export default LoadingPage;
