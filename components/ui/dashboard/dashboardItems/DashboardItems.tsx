import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

const DashboardItems = ({
  label,
  href,
  iconName,
}: {
  label: string;
  href: string;
  iconName: string;
}) => {
  const pathname = usePathname(); // Get current path
  const isActive = pathname.startsWith(href);

  const stateStyle = isActive ? "bg-dark-blue font-bold" : "bg-blue";
  const baseStyle =
    "flex px-5 py-5 gap-5 rounded-tl-lg rounded-bl-lg text-white w-full items-center";

  return (
    <div className="select-none">
      <Link
        href={href}
        className={`${baseStyle} ${stateStyle} hover:font-bold`}
      >
        <Icon icon={iconName} className="w-5 h-5" />
        {label}
      </Link>
    </div>
  );
};

export default DashboardItems;
