import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { api } from "~/utils/api";
import logo from "~/assets/logo.jpg";
import { useRouter } from "next/router";
import { Button } from "@nextui-org/button";

export default function Home() {
  return (
    <>
      <Head>
        <title>My Finances</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-pattern flex flex-1 flex-col items-center justify-center gap-8">
        <h1 className="flex gap-2 text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          My{" "}
          <span className="block animate-[levitate_13s_ease_infinite_1s] text-primary">
            Finances
          </span>{" "}
          App
        </h1>
        <Image
          src={logo}
          alt="LOGO"
          width={160}
          height={160}
          className="animate-[levitate_13s_ease_infinite_1s_reverse] rounded-3xl"
        />

        <AuthShowcase />
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();
  const router = useRouter();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const handleSign = () => {
    signIn("google", {
      callbackUrl: "/dashboard",
      redirect: false,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>

      <Button
        color="success"
        variant="ghost"
        onClick={sessionData ? () => void signOut() : () => void handleSign()}
      >
        {sessionData ? "Sign out" : "Sign in with google"}
      </Button>
    </div>
  );
}
