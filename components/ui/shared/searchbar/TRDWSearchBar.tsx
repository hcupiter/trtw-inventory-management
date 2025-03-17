import { Icon } from "@iconify/react";

export const TRDWSearchBar = ({
  placeholder,
  value,
  onChange,
  ...props
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="flex w-full gap-2 items-center border border-gray-300 px-4 py-4 rounded-md">
      <Icon icon={"material-symbols:search"} className="text-gray w-5 h-5" />
      <input
        type={"text"}
        className={`flex w-full outline-none focus:border-none`}
        placeholder={placeholder}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        {...props}
      />
    </div>
  );
};

export default TRDWSearchBar;
