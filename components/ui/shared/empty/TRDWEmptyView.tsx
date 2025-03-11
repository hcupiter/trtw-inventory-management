const TRDWEmptyView = ({ label }: { label: string }) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <p className="text-gray-400 text-lg">{label}</p>
    </div>
  );
};

export default TRDWEmptyView;
