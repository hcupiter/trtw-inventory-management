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
    <div className="w-40">
      <select
        value={selected}
        onChange={handleChange}
        className="text-black px-4 py-4 bg-gray-200 rounded-lg appearance-none"
      >
        {contents.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TRDWDropdown;
