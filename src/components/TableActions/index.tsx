import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  type Selection,
  type SortDescriptor,
  Spinner,
} from "@nextui-org/react";
import {
  useState,
  useCallback,
  useMemo,
  type ReactNode,
  type Key,
  type ChangeEvent,
} from "react";
import { BottomContent } from "./BottomContent";
import { TopContent } from "./TopContent";

type FilterOptions = {
  name: string;
  uid: string;
};

type Columns = {
  name: string;
  uid: string;
  sortable?: boolean;
};

type TableActionsProps<T> = {
  data: T[];
  columns: Columns[];
  filterType: keyof T;
  filterDropdownType?: keyof T;
  filterOptions: FilterOptions[];
  initialVisibleColumns: string[];
  rowsPerPage?: number;
  initialRowsPerPage?: number;
  initialSort: {
    column: keyof T;
    direction: "ascending" | "descending";
  };
  headerContent?: ReactNode;
  filterValue?: string;
  statusFilter?: Selection;
  page: number;
  isLoading?: boolean;
  setPage(page: number): void;
  renderCell: (item: T, columnKey: Key) => ReactNode;
};

export const TableActions = <T,>({
  data,
  filterType,
  filterOptions,
  initialRowsPerPage = 5,
  initialVisibleColumns,
  initialSort,
  columns,
  filterValue,
  statusFilter = "all",
  filterDropdownType,
  page = 1,
  headerContent,
  isLoading,
  setPage,
  renderCell,
}: TableActionsProps<T>) => {
  // const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(
    initialSort as SortDescriptor
  );

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      Array.from(initialVisibleColumns).includes((column as any).uid)
    );
  }, [columns, initialVisibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredData = [...data];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        (item[filterType] as string)
          ?.toLowerCase()
          .includes(filterValue!.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== filterOptions.length
    ) {
      filteredData = filteredData.filter((item) =>
        Array.from(statusFilter).includes(item[filterDropdownType!] as string)
      );
    }

    return filteredData;
  }, [
    data,
    statusFilter,
    filterOptions.length,
    filterType,
    filterValue,
    filterDropdownType,
    hasSearchFilter,
  ]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof (typeof items)[0]];
      const second = b[sortDescriptor.column as keyof (typeof items)[0]];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={
        <BottomContent
          page={page}
          pages={pages}
          setPage={setPage}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
        />
      }
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      sortDescriptor={sortDescriptor}
      topContent={
        <TopContent
          total={data?.length}
          onRowsPerPageChange={onRowsPerPageChange}
          content={headerContent}
        />
      }
      topContentPlacement="outside"
      isStriped
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={
          <div>
            {isLoading ? (
              <Spinner />
            ) : (
              <span>Nenhuma informação cadastrada</span>
            )}
          </div>
        }
        items={sortedItems}
      >
        {(item) => (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          <TableRow key={(item as any)?.id as number}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
