import clsx from "clsx";
import { type FunctionComponent } from "react";
import { type IconType } from "react-icons";
import { SiNubank } from "react-icons/si";
import { SlCreditCard } from "react-icons/sl";
import { formatCurrency } from "~/utils/formatCurrency";
import AmexLogo from "~/assets/amex.png";
import Image from "next/image";
import { Card } from "@nextui-org/react";

export type Bank = "nubank" | "inter" | "iti" | "amex";

type CreditCardProps = {
  bank: Bank;
  limit: number;
};

type BankList = {
  [key in Bank]: {
    icon: IconType;
    name: string;
    color?: string;
  };
};

export const CreditCard: FunctionComponent<CreditCardProps> = ({
  bank,
  limit,
}) => {
  const currentBank: BankList = {
    amex: {
      icon: SlCreditCard,
      name: "American Express",
      color: "text-englishBlue-200",
    },
    inter: {
      icon: SlCreditCard,
      name: "Banco Inter",
      color: "text-amber-500",
    },
    iti: {
      icon: SlCreditCard,
      name: "Iti",
      color: "text-rose-400",
    },
    nubank: {
      icon: SiNubank,
      name: "Nubank",
      color: "text-violet-500",
    },
  };
  const Icon = currentBank[bank]?.icon || SlCreditCard;

  return (
    <Card
      className={clsx(
        "flex flex-col justify-between gap-4 p-8",
        "w-full dark:from-zinc-900 dark:to-zinc-800"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">
          {currentBank[bank]?.name || bank}
        </p>

        {bank === "amex" ? (
          <Image src={AmexLogo} alt="AMEX" width={50} height={50} />
        ) : (
          <Icon className={currentBank[bank]?.color} size={42} />
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2 font-semibold">
        <small className="font-normal text-default-500">limit</small>
        <span className="flex items-baseline gap-2 text-2xl text-green-800 dark:text-green-200">
          {formatCurrency(limit)}
          <span className="text-sm">R$</span>
        </span>
      </div>
    </Card>
  );
};
