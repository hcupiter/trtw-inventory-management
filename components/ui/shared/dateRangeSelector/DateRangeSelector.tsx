import TRDWButton from "../button/TRDWButton";
import TRDWDatePicker from "../datepicker/TRDWDatePicker";

export const DateRangeSelector = ({
  startDate,
  endDate,
  onStartDateChanged,
  onEndDateChanged,
  onSearchClicked,
  error,
}: {
  startDate: Date;
  endDate: Date;
  onStartDateChanged: (date: Date) => void;
  onEndDateChanged: (date: Date) => void;
  onSearchClicked: () => void;
  error?: string;
}) => {
  return (
    <div className="flex flex-col w-full gap-2">
      <p className="flex text-base font-bold">Durasi transaksi</p>
      {/* Date Selection Container */}
      <div className="flex gap-4">
        <div className="flex gap-3 items-center">
          <TRDWDatePicker
            selected={startDate}
            onChange={(date) => {
              if (date) onStartDateChanged(date);
            }}
          />
          <p>hingga</p>
          <TRDWDatePicker
            selected={endDate}
            onChange={(date) => {
              if (date) onEndDateChanged(date);
            }}
          />
        </div>
        <TRDWButton
          iconName="material-symbols:search"
          onClick={onSearchClicked}
        >
          Cari
        </TRDWButton>
      </div>
      {error && <span className="text-red">{error}</span>}
    </div>
  );
};
