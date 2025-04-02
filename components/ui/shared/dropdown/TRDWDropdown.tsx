import { useRef } from "react";

const TRDWDropdown = ({
  contents,
  selected,
  onChange,
}: {
  contents: string[];
  selected: string;
  onChange: (selected: string) => void;
}) => {
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div
      className="flex text-black bg-gray-200 rounded-lg w-fit px-4 cursor-pointer"
      onClick={() => selectRef.current?.focus()} // Focus on select
    >
      <select
        value={selected}
        onChange={handleChange}
        className="w-[8vw] py-4 focus:outline-none bg-transparent cursor-pointer"
        ref={selectRef} // Assign ref to select
      >
        {contents.map((item, index) => (
          <option key={index} value={item} className="select-none">
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TRDWDropdown;
