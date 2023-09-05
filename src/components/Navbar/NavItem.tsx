import Link from "next/link";
import { type FunctionComponent } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";
import { NavbarItem } from "@nextui-org/react";

type NavItemProps = {
  label: string;
  route: string;
};

export const NavItem: FunctionComponent<NavItemProps> = ({ label, route }) => {
  const currentRoute = usePathname();
  const isSelected = currentRoute === route;

  return (
    <NavbarItem isActive={isSelected} className="relative text-sm">
      <Link
        color="foreground"
        href={route}
        className={clsx({ "text-primary": isSelected })}
      >
        {label}
      </Link>
      {isSelected && (
        <motion.div
          className="absolute h-1 w-full bg-primary underline"
          layoutId="underline"
        />
      )}
    </NavbarItem>
  );
};
