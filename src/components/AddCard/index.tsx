import {
  Button,
  Checkbox,
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
import { addCardSchema } from "~/server/schemas/card";
import { type z } from "zod";
import { api } from "~/utils/api";
import { toast } from "react-toastify";

type AddCardProps = {
  isOpen: boolean;
  onSubmit?: () => void;
  onClose?: () => void;
  onOpenChange?: () => void;
};

type Card = z.infer<typeof addCardSchema>;

export const AddCard: FunctionComponent<AddCardProps> = ({
  isOpen,
  onOpenChange,
  onClose,
}) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Card>({
    resolver: zodResolver(addCardSchema),
    defaultValues: {
      main: false,
    },
  });

  const addCard = api.card.add.useMutation();
  const utils = api.useContext();

  const onSubmit = (data: Card) => {
    console.log(data);

    addCard.mutate(
      {
        name: data?.name,
        balance: data?.balance,
        limit: data?.limit,
        main: data?.main,
      },
      {
        onSuccess() {
          if (onClose) {
            onClose();
            toast("Cartão cadastrado com sucesso", {
              type: "success",
            });
            utils.card.getAll.invalidate();
          }
        },
        onError() {
          toast("Erro ao cadastrar com sucesso", {
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
      placement="top-center"
    >
      <ModalContent className={montserrat.className}>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Adicionar cartão
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Nome*"
                placeholder="Nome do cartão"
                variant="bordered"
                errorMessage={errors?.name?.message}
                {...register("name")}
              />
              <Input
                label="Limite*"
                placeholder="Limite total do cartão"
                type="number"
                variant="bordered"
                errorMessage={errors?.limit?.message}
                {...register("limit")}
              />
              <Input
                label="Saldo"
                placeholder="Saldo total do cartão"
                type="number"
                variant="bordered"
                errorMessage={errors?.balance?.message}
                {...register("balance")}
              />
              <Controller
                control={control}
                name="main"
                render={({ field: { name, onChange, ref } }) => {
                  return (
                    <Checkbox
                      color="success"
                      classNames={{
                        label: "text-small",
                      }}
                      name={name}
                      ref={ref}
                      onChange={(event) => {
                        onChange(event.target.checked);
                      }}
                    >
                      Cartão principal
                    </Checkbox>
                  );
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="success"
                isLoading={addCard.isLoading}
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
