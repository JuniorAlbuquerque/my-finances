import { useSession } from "next-auth/react";
import Image from "next/image";
// import Link from "next/link";
import { useState, type FunctionComponent } from "react";
import { BiHeadphone, BiPowerOff } from "react-icons/bi";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { NavBarData, routes } from "../Navbar";
import { Button } from "@nextui-org/button";
import {
  Avatar,
  AvatarIcon,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { montserrat } from "~/pages/_app";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

export const Header: FunctionComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentRoute = usePathname();
  const { data: sessionData } = useSession();
  const router = useRouter();

  return (
    <Navbar
      shouldHideOnScroll
      maxWidth="xl"
      className="py-4"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />

        <NavbarBrand>
          <h1 className="font-bold">
            My <span className="text-primary">Finances</span>
          </h1>
        </NavbarBrand>
      </NavbarContent>

      {!!sessionData?.user && <NavBarData />}
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Button isIconOnly color="primary" variant="flat">
            <BiHeadphone size={18} />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>

        {!!sessionData?.user && (
          <NavbarItem>
            <Button
              isIconOnly
              onClick={() => {
                void signOut({
                  callbackUrl: "/",
                  redirect: true,
                });
              }}
              variant="flat"
              color="danger"
            >
              <BiPowerOff size={18} />
            </Button>
          </NavbarItem>
        )}

        {!!sessionData?.user && (
          <NavbarItem>
            <Avatar
              src={sessionData?.user?.image!}
              isBordered
              as="button"
              className="transition-transform"
              color="success"
              name={sessionData?.user?.name!}
              size="sm"
            />
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu className={clsx("mt-8", montserrat.className)}>
        {routes.map((item) => (
          <NavbarMenuItem key={`${item?.route}`}>
            <Link
              color={currentRoute === item?.route ? "primary" : "foreground"}
              className="w-ful"
              href={item?.route}
            >
              {item?.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );

  // return (
  //   <header className="flex items-center justify-between gap-24 px-12 py-10">
  //     <div className="flex items-center gap-8">
  //       <div className="rounded-lg bg-violet-800 p-4">Logo</div>
  //       <h1 className="font-bold">
  //         My <span className="text-primary">Finances</span>
  //       </h1>

  //       <NavBar />
  //     </div>

  //     <div className="flex items-center gap-8">
  //       {!!sessionData?.user && (
  //         <div className="hidden items-center gap-4 lg:flex">
  //           <div className="flex flex-col items-end">
  //             <p className="text-sm">{sessionData?.user?.name}</p>
  //             <p className="text-xs text-gray-400">
  //               {sessionData?.user?.email}
  //             </p>
  //           </div>

  //           <Image
  //             src={sessionData?.user?.image!}
  //             alt="PROFILE"
  //             width={50}
  //             height={50}
  //             className="rounded-xl"
  //           />
  //         </div>
  //       )}

  //       <div className="flex gap-4">
  //         <Button isIconOnly color="primary" variant="flat">
  //           <BiHeadphone size={18} />
  //         </Button>
  //         {/* <div className="cursor-pointer rounded-lg bg-primary p-2 text-violet-800">
  //         </div> */}

  //         <ThemeSwitcher />

  //         <Button
  //           isIconOnly
  //           onClick={() => void signOut()}
  //           variant="flat"
  //           color="danger"
  //         >
  //           <BiPowerOff size={18} />
  //         </Button>
  //       </div>
  //     </div>
  //   </header>
  // );
};
