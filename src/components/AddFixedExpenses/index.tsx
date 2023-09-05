import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { type FunctionComponent } from "react";
import { montserrat } from "~/pages/_app";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { type z } from "zod";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { addFixedExpenseSchema } from "~/server/schemas/expenses";
import Make, { currency, currencyFn } from "make-currency";

const BRL = Make.TYPES.BRL;
Make.CONFIGURE({ money: BRL });

type AddFixedExpensesProps = {
  isOpen: boolean;
  onSubmit?: () => void;
  onClose?: () => void;
  onOpenChange?: () => void;
};

type FixedExpense = z.infer<typeof addFixedExpenseSchema>;

export const categoryList = {
  food: "Alimentação",
  home: "Casa",
  rent: "Aluguel",
  other: "Outros",
};

export const AddFixedExpenses: FunctionComponent<AddFixedExpensesProps> = ({
  isOpen,
  onOpenChange,
  onClose,
}) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FixedExpense>({
    resolver: zodResolver(addFixedExpenseSchema),
    defaultValues: {
      value: 0,
    },
  });

  const addFixedExpense = api.expense.addFixedExpense.useMutation();
  const utils = api.useContext();

  const onSubmit = (data: FixedExpense) => {
    addFixedExpense.mutate(
      {
        category: data?.category,
        description: data?.description,
        paymentDate: data?.paymentDate,
        value: data?.value,
      },
      {
        onSuccess() {
          if (onClose) {
            onClose();
          }
          toast("Despesa fixa cadastrada com sucesso", {
            type: "success",
          });
          utils.expense.getAllFixedExpenses.invalidate();
        },
      }
    );
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={() => {
        reset({
          category: "",
          description: "",
          paymentDate: "",
          value: 0,
        });
      }}
      placement="top-center"
    >
      <ModalContent className={montserrat.className}>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Adicionar despesa fixa
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Descrição*"
                placeholder="Ex: aluguel"
                labelPlacement="outside"
                variant="bordered"
                errorMessage={errors?.description?.message}
                {...register("description")}
              />

              <Controller
                control={control}
                name="value"
                render={({ field: { name, value, onChange, ref, onBlur } }) => (
                  <Input
                    label="Valor*"
                    labelPlacement="outside"
                    placeholder="0.00"
                    variant="bordered"
                    errorMessage={errors?.value?.message}
                    value={currency(value || 0, "INPUT")}
                    onBlur={onBlur}
                    onChange={(event) => {
                      // console.log(currencyFn(event.target.value))
                      onChange(currencyFn(event.target.value).floatValue);
                    }}
                    ref={ref}
                  />
                )}
              />

              <Input
                label="Data de pagamento*"
                labelPlacement="outside"
                placeholder="Saldo total do cartão"
                type="number"
                variant="bordered"
                errorMessage={errors?.paymentDate?.message}
                {...register("paymentDate")}
              />

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="category"
                  className="block origin-top-left pb-1.5 text-small font-medium text-foreground transition-all !duration-200 !ease-out will-change-auto motion-reduce:transition-none"
                >
                  Categoria
                </label>

                <Controller
                  control={control}
                  name="category"
                  render={({ field: { value, onChange } }) => (
                    <Dropdown className={montserrat.className}>
                      <DropdownTrigger>
                        <Button
                          variant="bordered"
                          id="category"
                          className="flex justify-start text-left capitalize"
                        >
                          {categoryList[value as keyof typeof categoryList]}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Single selection example"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={value}
                        onSelectionChange={(key) => {
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
                          const val = (key as any).anchorKey;
                          onChange(val);
                        }}
                      >
                        {Object.entries(categoryList)?.map(([key, value]) => (
                          <DropdownItem key={key}>{value}</DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  )}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="success"
                isLoading={addFixedExpense.isLoading}
                onPress={() => void handleSubmit(onSubmit)()}
              >
                Cadastrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
