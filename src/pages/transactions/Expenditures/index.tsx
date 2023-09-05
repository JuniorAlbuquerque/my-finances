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
} from "@nextui-org/react";
import {
  type Key,
  useCallback,
  useState,
  type FunctionComponent,
  useRef,
  useMemo,
  useEffect,
} from "react";
import { BsArrowDown, BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { TableActions } from "~/components/TableActions";
import { montserrat } from "~/pages/_app";
import { formatCurrency } from "~/utils/formatCurrency";
import { parseISO, format } from "date-fns";

type ExpendituresData = {
  id: number;
  description: string;
  date: string;
  category: string;
  value: number;
  fixed?: boolean;
  card?: string;
  status: "paid" | "waiting";
};

const data: ExpendituresData[] = [
  {
    id: 1,
    description: "Apartment rent",
    date: "10",
    category: "rent",
    fixed: true,
    value: 1500,
    status: "waiting",
  },
  {
    id: 2,
    description: "Loan Car",
    date: "15",
    category: "other",
    fixed: true,
    value: 1055,
    status: "waiting",
  },
  {
    id: 3,
    description: "Cellphone",
    date: "15",
    category: "other",
    fixed: true,
    value: 45,
    status: "waiting",
  },
  {
    id: 4,
    description: "Nubank",
    date: "8",
    category: "card",
    value: 2560,
    card: "nubank",
    status: "waiting",
  },
  {
    id: 4,
    description: "Amex",
    date: "8",
    category: "card",
    value: 3543.74,
    card: "amex",
    status: "waiting",
  },
];

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "DESCRIPTION", uid: "description", sortable: true },
  { name: "VALUE", uid: "value", sortable: true },
  { name: "PAYMENT DATE", uid: "date", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "CATEGORY", uid: "category", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const filterOptions = [
  { name: "Paid", uid: "paid" },
  { name: "Waiting", uid: "waiting" },
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
  paid: "success",
  waiting: "warning",
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

  const monthsItemsRef = useRef<HTMLButtonElement[]>([]);
  const monthWrapperRef = useRef<HTMLDivElement>(null);

  const sumExpenses = data?.reduce((acc, current) => acc + current.value, 0);

  const selectedYear = useMemo(
    () => Array.from(yearFilter).join(", ").replaceAll("_", " "),
    [yearFilter]
  );

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
      <div className="flex flex-wrap items-end justify-between gap-3 pt-4">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search by description..."
          // startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
        <div className="ml-auto flex items-end gap-3">
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
          <Button color="success">Add New</Button>
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

  const renderCell = useCallback((item: ExpendituresData, columnKey: Key) => {
    const cellValue = item[columnKey as keyof ExpendituresData];

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
            {cellValue}
          </Chip>
        );
      case "status":
        return (
          <Chip
            className="text-xs capitalize"
            color={statusColorMap[item.status] as ChipProps["color"]}
            size="sm"
            variant="flat"
          >
            {cellValue}
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
        return cellValue;
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
        data={data}
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
          "date",
          "description",
          "value",
          "status",
          "actions",
        ]}
        initialSort={{
          column: "date",
          direction: "ascending",
        }}
        renderCell={renderCell}
        headerContent={TopContent}
      />

      <h4 className="self-end p-4 text-xl font-semibold text-danger">
        <span className="text-base">Total:</span>{" "}
        {formatCurrency(sumExpenses, true)}
      </h4>
    </div>
  );
};
