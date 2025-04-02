import { Icon } from "@iconify/react/dist/iconify.js";

const TRDWDropdown = ({
  contents,
  selected,
  onChange,
}: {
  contents: string[];
  selected: string;
  onChange: (selected: string) => void;
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="flex text-black bg-gray-200 rounded-lg w-fit px-4">
      <select value={selected} onChange={handleChange} className="w-[8vw] py-4 focus:outline-none">
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
