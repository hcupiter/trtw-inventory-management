import Spinner from "react-bootstrap/Spinner";

export const TRDWLoadingView = ({ label }: { label?: string }) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <p className="text-gray-400 text-lg">{label}</p>
    </div>
  );
};
