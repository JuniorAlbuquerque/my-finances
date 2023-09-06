import {
  Input,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Chip,
  type ChipProps,
  type Selection,
  useDisclosure,
} from "@nextui-org/react";
import {
  type Key,
  useCallback,
  useState,
  type FunctionComponent,
  useRef,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { TableActions } from "~/components/TableActions";
import { montserrat } from "~/pages/_app";
import { formatCurrency } from "~/utils/formatCurrency";
import { parseISO, format } from "date-fns";
import { AddExpenses, categoryList } from "~/components/AddExpenditure";
import { api } from "~/utils/api";
import { type Expenditure } from "@prisma/client";
import { formatDate } from "~/utils/formats";
import { toast } from "react-toastify";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "DESCRIPTION", uid: "description", sortable: true },
  { name: "VALUE", uid: "value", sortable: true },
  { name: "PAYMENT DATE", uid: "paymentDate", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "CATEGORY", uid: "category", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const filterOptions = [
  { name: "Pago", uid: "PAID" },
  { name: "Aguardando pagamento", uid: "WAITING" },
];

const years = ["2020", "2021", "2022", "2023", "2024"];

const categoryColorMap = {
  food: "warning",
  rent: "secondary",
  other: "default",
  home: "success",
  card: "danger",
};

const statusColorMap = {
  PAID: "success",
  WAITING: "warning",
};

const statusText = {
  PAID: "Pago",
  WAITING: "Aguardando",
};

const months = [...Array(12).keys()].map((_, index) => {
  const date = parseISO(`2023-${(index + 1).toString().padStart(2, "0")}-01`);
  return {
    date: date,
    name: format(date, "MMMM"),
    shortname: format(date, "MMM"),
  };
});

const today = new Date();
const initialMonthIndex = today.getMonth();

export const Expenditures: FunctionComponent = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [yearFilter, setYearFilter] = useState<Selection>(new Set(["2023"]));
  const [filterValue, setFilterValue] = useState("");
  const [activeMonth, setActiveMonth] = useState(initialMonthIndex);

  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  const monthsItemsRef = useRef<HTMLButtonElement[]>([]);
  const monthWrapperRef = useRef<HTMLDivElement>(null);

  const utils = api.useContext();

  const syncFixedExpenses = api.expense.syncFixedExpense.useMutation();

  const { data, isFetching } = api.expense.getAllExpensesByMonth.useQuery(
    activeMonth,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      placeholderData: [],
    }
  );

  const sumExpenses = data?.reduce((acc, current) => acc + current.value, 0);

  const selectedYear = useMemo(
    () => Array.from(yearFilter).join(", ").replaceAll("_", " "),
    [yearFilter]
  );

  const handleSyncFixedExpenses = useCallback(() => {
    syncFixedExpenses.mutate(activeMonth, {
      onSuccess() {
        toast("Despesas fixas sincronizadas com o mês selecionado", {
          type: "success",
        });
        utils.expense.getAllExpensesByMonth.invalidate();
      },
    });
  }, [activeMonth, syncFixedExpenses, utils.expense.getAllExpensesByMonth]);

  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const TopContent = (
    <div className="flex flex-col gap-6 pb-2">
      <div className="flex flex-wrap gap-4 pt-4">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search by description..."
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />

        <div className="ml-auto flex flex-wrap gap-4">
          <Button
            color="warning"
            className="w-full sm:w-fit"
            isLoading={syncFixedExpenses.isLoading}
            onClick={handleSyncFixedExpenses}
          >
            Sincronizar despesas fixas
          </Button>
          <Button color="success" className="w-full sm:w-fit" onClick={onOpen}>
            Adicionar +
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="ml-auto flex flex-wrap items-end gap-3">
          <Dropdown className={montserrat.className}>
            <DropdownTrigger className="flex">
              <Button
                // endContent={<ChevronDownIcon className="text-small" />}
                variant="solid"
                color="secondary"
              >
                {selectedYear}

                <IoIosArrowDown />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={yearFilter}
              selectionMode="single"
              onSelectionChange={setYearFilter}
            >
              {years.map((year) => (
                <DropdownItem key={year} className="capitalize">
                  {year}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown className={montserrat.className}>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                // endContent={<ChevronDownIcon className="text-small" />}
                variant="flat"
              >
                Status
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={statusFilter}
              selectionMode="multiple"
              onSelectionChange={setStatusFilter}
            >
              {filterOptions.map((status) => (
                <DropdownItem
                  key={status.uid}
                  className="capitalize"
                  color="secondary"
                >
                  {status.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div
        className="flex justify-between gap-2 overflow-x-scroll scrollbar-hide"
        ref={monthWrapperRef}
      >
        {months?.map((month, index) => (
          <Button
            key={month.date?.toDateString()}
            ref={(item) => (monthsItemsRef.current[index] = item!)}
            onClick={() => void onMonthClick(index, month.date)}
            variant={activeMonth === index ? "bordered" : "solid"}
            color={activeMonth === index ? "secondary" : "default"}
          >
            {month.shortname}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderCell = useCallback((item: Expenditure, columnKey: Key) => {
    const cellValue = item[columnKey as keyof Expenditure];

    switch (columnKey) {
      case "category":
        return (
          <Chip
            className="text-xs capitalize"
            color={
              categoryColorMap[
                item.category as keyof typeof categoryColorMap
              ] as ChipProps["color"]
            }
            size="sm"
            variant="flat"
          >
            {categoryList[cellValue as keyof typeof categoryList] as ReactNode}
          </Chip>
        );
      case "paymentDate":
        return formatDate(cellValue as string);
      case "status":
        return (
          <Chip
            className="text-xs capitalize"
            color={statusColorMap[item.status] as ChipProps["color"]}
            size="sm"
            variant="flat"
          >
            {statusText[cellValue as keyof typeof statusText]}
          </Chip>
        );
      case "value":
        return (
          <div className="flex items-center gap-2">
            <p className="text-danger">{formatCurrency(item.value, true)}</p>
            {item.fixed && (
              <Chip size="sm" variant="flat" className="text-xs" color="danger">
                Fixed
              </Chip>
            )}
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2 pl-4">
            <Dropdown className={montserrat.className}>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  {/* <VerticalDotsIcon className="text-default-300" /> */}
                  <BsThreeDotsVertical />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue as ReactNode;
    }
  }, []);

  const onMonthClick = (index: number, date: Date) => {
    setActiveMonth(index);
  };

  useEffect(() => {
    if (activeMonth) {
      const currentMonthRef = monthsItemsRef.current[activeMonth];

      monthWrapperRef.current?.scrollTo({
        left:
          currentMonthRef?.offsetLeft! -
          (monthWrapperRef.current.offsetWidth -
            currentMonthRef?.offsetWidth!) /
            2,
        behavior: "smooth",
      });
    }
  }, [activeMonth]);

  return (
    <div className="flex flex-col gap-4">
      <TableActions
        data={data!}
        isLoading={isFetching}
        columns={columns}
        page={page}
        setPage={setPage}
        filterType="description"
        filterDropdownType="status"
        filterValue={filterValue}
        statusFilter={statusFilter}
        filterOptions={filterOptions}
        initialVisibleColumns={[
          "category",
          "paymentDate",
          "description",
          "value",
          "status",
          "actions",
        ]}
        initialSort={{
          column: "paymentDate",
          direction: "ascending",
        }}
        renderCell={renderCell}
        headerContent={TopContent}
      />

      <h4 className="self-end p-4 text-xl font-semibold text-danger">
        <span className="text-base">Total:</span>{" "}
        {formatCurrency(sumExpenses!, true)}
      </h4>

      <AddExpenses
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};
