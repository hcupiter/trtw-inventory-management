import { ReactNode } from "react";
import TRDWButton, { ButtonVariant } from "../button/TRDWButton";

export const OverlayConfirmation = ({
  title,
  description,
  actionReversed,
  confirmButtonLbl,
  cancelButtonLbl,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  actionReversed?: boolean;
  confirmButtonLbl?: string;
  cancelButtonLbl?: string;
  onConfirm: () => void;
  onCancel: () => void;
}): ReactNode => {
  return (
    <div className="flex flex-col w-100 bg-white gap-6">
      <div className="flex flex-col">
        <p className="font-bold text-lg">{title}</p>
        <p>{description}</p>
      </div>

      <div
        className={`flex w-full justify-between gap-4 ${
          actionReversed ? "flex-row-reverse" : ""
        }`}
      >
        <TRDWButton
          fullWidth
          variant={ButtonVariant.SECONDARY}
          onClick={onConfirm}
        >
          {confirmButtonLbl ? confirmButtonLbl : "Konfirmasi"}
        </TRDWButton>
        <TRDWButton fullWidth variant={ButtonVariant.DANGER} onClick={onCancel}>
          {cancelButtonLbl ? cancelButtonLbl : "Batalkan"}
        </TRDWButton>
      </div>
    </div>
  );
};
