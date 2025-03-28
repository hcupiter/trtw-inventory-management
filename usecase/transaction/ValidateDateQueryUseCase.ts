export const validateDateQueryUseCase = ({
  from,
  to,
}: {
  from: Date;
  to: Date;
}): string | undefined => {
  // Validate Date
  if (from > to) {
    return "Tanggal awal tidak boleh melebihi hari akhir!";
  }

  if (from > new Date()) {
    return "Error! Tanggal awal tidak bisa melebihi hari ini!";
  }
};
