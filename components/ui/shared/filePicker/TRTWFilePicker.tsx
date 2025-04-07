import { useRef } from "react";

export const TRTWFilePicker = ({
  label,
  mandatory = false,
  error,
  disabled = false,
  file,
  onChange,
}: {
  label: string;
  mandatory?: boolean;
  error?: string;
  disabled?: boolean;
  file?: File | undefined;
  onChange: (file: File | undefined) => void;
}) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || undefined;
    onChange(selectedFile);
  };

  const handleClick = () => {
    if (!disabled && hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  return (
    <div className="flex w-full flex-col items-start gap-1">
      <label className="text-base font-bold text-black">
        {label} {mandatory && <span className="text-red-500">*</span>}
      </label>
      <div className="flex flex-col w-full">
        {/* Custom button element that triggers file input */}
        <div
          onClick={handleClick}
          className={`w-fit rounded-lg px-4 py-3 border cursor-pointer ${
            disabled
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          } ${error ? "border-red-500" : "border-gray-300"}`}
        >
          {file ? (
            <p className="">{file.name}</p>
          ) : (
            <p className="text-gray">Pilih file database...</p>
          )}
        </div>
        {/* Hidden file input */}
        <input
          type="file"
          ref={hiddenFileInput}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};
