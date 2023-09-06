import {
  Button,
  Checkbox,
  CheckboxGroup,
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
import { addExpenseSchema } from "~/server/schemas/expenses";
import Make, { currency, currencyFn } from "make-currency";

const BRL = Make.TYPES.BRL;
Make.CONFIGURE({ money: BRL });

type AddFixedExpensesProps = {
  isOpen: boolean;
  onSubmit?: () => void;
  onClose?: () => void;
  onOpenChange?: () => void;
};

type ExpenseData = z.infer<typeof addExpenseSchema>;

export const categoryList = {
  food: "Alimentação",
  home: "Casa",
  rent: "Aluguel",
  card: "Cartão",
  other: "Outros",
};

export const AddExpenses: FunctionComponent<AddFixedExpensesProps> = ({
  isOpen,
  onOpenChange,
  onClose,
}) => {
  const {
    control,
    watch,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ExpenseData>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      value: 0,
    },
  });

  const { data: cards } = api.card.getAll.useQuery(undefined, {
    placeholderData: [],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const addExpense = api.expense.addExpense.useMutation();
  const utils = api.useContext();

  const onSubmit = (data: ExpenseData) => {
    addExpense.mutate(
      {
        category: data?.category,
        description: data?.description,
        paymentDate: data?.paymentDate,
        value: data?.value,
        status: data?.status,
        cardId: data?.cardId,
      },
      {
        onSuccess() {
          if (onClose) {
            onClose();
          }
          toast("Despesa cadastrada com sucesso", {
            type: "success",
          });
          utils.expense.getAllExpensesByMonth.invalidate();
        },
        onError(error) {
          toast(error?.message, {
            type: "error",
          });
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
          paymentDate: null!,
          value: 0,
        });
      }}
      placement="top-center"
    >
      <ModalContent className={montserrat.className}>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Adicionar despesa
            </ModalHeader>
            <ModalBody className="flex flex-col gap-6">
              <Input
                autoFocus
                label="Descrição*"
                placeholder="Ex: fatura cartão"
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
                    name={name}
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
                type="date"
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

                {!!errors?.category?.message && (
                  <div className="relative flex flex-col gap-1.5 px-1 pb-2">
                    <div
                      className="absolute left-1 text-tiny text-danger"
                      id="react-aria7556356910-:rfb:"
                    >
                      Campo obrigatório
                    </div>
                  </div>
                )}
              </div>

              {watch("category") === "card" && (
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="category"
                    className="block origin-top-left pb-1.5 text-small font-medium text-foreground transition-all !duration-200 !ease-out will-change-auto motion-reduce:transition-none"
                  >
                    Cartão
                  </label>

                  <Controller
                    control={control}
                    name="cardId"
                    render={({ field: { value, onChange } }) => (
                      <Dropdown className={montserrat.className}>
                        <DropdownTrigger>
                          <Button
                            variant="bordered"
                            id="category"
                            className="flex justify-start text-left capitalize"
                          >
                            {
                              cards?.find(
                                (card) =>
                                  card.id?.toString() ===
                                  watch("cardId")?.toString()!
                              )?.name
                            }
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Single selection example"
                          variant="flat"
                          disallowEmptySelection
                          selectionMode="single"
                          selectedKeys={value?.toString()}
                          onSelectionChange={(key) => {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
                            const val = (key as any).anchorKey;
                            onChange(parseInt(val as string));
                          }}
                        >
                          {
                            cards?.map((card) => (
                              <DropdownItem key={card?.id}>
                                {card?.name}
                              </DropdownItem>
                            ))!
                          }
                        </DropdownMenu>
                      </Dropdown>
                    )}
                  />

                  {!!errors?.category?.message && (
                    <div className="relative flex flex-col gap-1.5 px-1 pb-2">
                      <div
                        className="absolute left-1 text-tiny text-danger"
                        id="react-aria7556356910-:rfb:"
                      >
                        Campo obrigatório
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Controller
                control={control}
                name="status"
                render={({ field: { name, ref, value, onChange } }) => (
                  <CheckboxGroup
                    label="Status"
                    name={name}
                    errorMessage={errors?.status?.message}
                    classNames={{
                      errorMessage: "text-tiny",
                    }}
                    ref={ref}
                    value={[value]}
                    onValueChange={(val) => {
                      console.log(val);
                      onChange(val[1]);
                    }}
                  >
                    <Checkbox color="warning" value="WAITING">
                      Pendente pagamento
                    </Checkbox>
                    <Checkbox color="success" value="PAID">
                      Pago
                    </Checkbox>
                  </CheckboxGroup>
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="success"
                isLoading={addExpense.isLoading}
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
