import Link from "next/link";
import { type FunctionComponent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavItem } from "./NavItem";
import { NavbarContent, NavbarItem } from "@nextui-org/react";

export const routes = [
  {
    label: "Home",
    route: "/dashboard",
  },
  {
    label: "Transações",
    route: "/transactions",
  },
  {
    label: "Cartões",
    route: "/cards",
  },
  {
    label: "Planejamento",
    route: "/planning",
  },
];

export const NavBarData: FunctionComponent = () => {
  return (
    <NavbarContent className="hidden gap-4 sm:flex" justify="center">
      {routes?.map((item) => (
        <NavItem key={item?.route} label={item?.label} route={item?.route} />
      ))}
    </NavbarContent>
  );
};
