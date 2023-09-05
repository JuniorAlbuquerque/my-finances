import {
  Button,
  Chip,
  type ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  type Selection,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { type FixedInflows as FixedInflowsData } from "@prisma/client";
import {
  useCallback,
  type FunctionComponent,
  type Key,
  useState,
  type ReactNode,
} from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AddFixedInflow } from "~/components/AddFixedInflows";
import { TableActions } from "~/components/TableActions";
import { montserrat } from "~/pages/_app";
import { api } from "~/utils/api";
import { formatCurrency } from "~/utils/formatCurrency";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "DESCRIPTION", uid: "description", sortable: true },
  { name: "VALUE", uid: "value", sortable: true },
  { name: "PAYMENT DATE", uid: "paymentDate", sortable: true },
  { name: "CATEGORY", uid: "category", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const filterOptions = [
  { name: "Food", uid: "food" },
  { name: "Rent", uid: "rent" },
  { name: "Other", uid: "other" },
  { name: "Salary", uid: "salary" },
];

const statusColorMap = {
  food: "warning",
  rent: "secondary",
  other: "default",
  salary: "success",
};

export const FixedInflows: FunctionComponent = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [filterValue, setFilterValue] = useState("");

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { data, isFetching } = api.inflows.getAllFixedInflows.useQuery(
    undefined,
    {
      placeholderData: [],
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const sumExpenses = data?.reduce((acc, current) => acc + current.value, 0);

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
    <div className="flex items-end justify-between gap-3">
      <Input
        isClearable
        className="w-full sm:max-w-[44%]"
        placeholder="Search by description..."
        // startContent={<SearchIcon />}
        value={filterValue}
        onClear={() => onClear()}
        onValueChange={onSearchChange}
      />
      <div className="flex gap-3">
        <Dropdown className={montserrat.className}>
          <DropdownTrigger className="hidden sm:flex">
            <Button
              // endContent={<ChevronDownIcon className="text-small" />}
              variant="flat"
            >
              Category
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
              <DropdownItem key={status.uid} className="capitalize">
                {status.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <Button color="success" onClick={onOpen}>
          Add New
        </Button>
      </div>
    </div>
  );

  const renderCell = useCallback((item: FixedInflowsData, columnKey: Key) => {
    const cellValue = item[columnKey as keyof FixedInflowsData];

    switch (columnKey) {
      case "category":
        return (
          <Chip
            className="text-xs capitalize"
            color={
              statusColorMap[
                item.category as keyof typeof statusColorMap
              ] as ChipProps["color"]
            }
            size="sm"
            variant="flat"
          >
            {cellValue as ReactNode}
          </Chip>
        );
      case "value":
        return (
          <p className="text-success">{formatCurrency(item.value, true)}</p>
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

  return (
    <div className="flex flex-col gap-4 pt-4">
      <TableActions
        data={data!}
        isLoading={isFetching}
        columns={columns}
        page={page}
        setPage={setPage}
        filterType="description"
        filterDropdownType="category"
        filterValue={filterValue}
        statusFilter={statusFilter}
        filterOptions={filterOptions}
        initialVisibleColumns={[
          "category",
          "date",
          "description",
          "value",
          "actions",
        ]}
        initialSort={{
          column: "paymentDate",
          direction: "ascending",
        }}
        renderCell={renderCell}
        headerContent={TopContent}
      />

      <h4 className="self-end p-4 text-xl font-semibold text-success">
        <span className="text-base">Total:</span>{" "}
        {formatCurrency(sumExpenses!, true)}
      </h4>

      <AddFixedInflow
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};
