export const VendorTag = ({ tag }: { tag: string }) => {
  return (
    <div className="px-2 py-1 bg-white rounded-lg text-blue font-bold w-fit h-fit">
      <p>{tag}</p>
    </div>
  );
};
