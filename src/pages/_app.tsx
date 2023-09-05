import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { ToastContainer } from "react-toastify";
import "~/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import { Montserrat } from "next/font/google";
import { ThemeProvider } from "~/providers/ThemeProvider";
import { Header } from "~/components/Header";
import clsx from "clsx";

export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--body-font",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <main className={clsx(montserrat.className, "flex h-screen flex-col")}>
          <Header />

          <Component {...pageProps} />

          <ToastContainer
            toastClassName="toast-content"
            position="bottom-left"
            className={montserrat.className}
          />
        </main>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
