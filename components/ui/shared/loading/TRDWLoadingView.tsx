export const TRDWLoadingView = ({ label }: { label?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5">
      <div className="animate-ping rounded-full h-5 w-5 bg-gray"></div>
      <p className="text-gray-400 text-base">{label}</p>
    </div>
  );
};
