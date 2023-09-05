import { Button } from "@nextui-org/button";
import { useTheme } from "next-themes";
import { useState, type FunctionComponent, useEffect } from "react";
import { BiMoon, BiSun } from "react-icons/bi";

export const ThemeSwitcher: FunctionComponent = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      isIconOnly
      variant="flat"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      color={theme === "dark" ? "warning" : "default"}
    >
      {/* 
    <div
      className={clsx(
        "tex-violet-800 cursor-pointer rounded-lg bg-englishBlue-500 p-2 text-white dark:bg-warning-100",
        {}
        )}
        
        > */}
      {theme === "light" ? <BiMoon size={18} /> : <BiSun size={18} />}
      {/* </div> */}
    </Button>
  );
};
