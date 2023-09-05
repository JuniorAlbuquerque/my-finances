import { Pagination, Button } from "@nextui-org/react";
import { type FunctionComponent } from "react";

type BottomContentProps = {
  page: number;
  pages: number;
  setPage(page: number): void;
  onPreviousPage(): void;
  onNextPage(): void;
};

export const BottomContent: FunctionComponent<BottomContentProps> = ({
  page,
  pages,
  setPage,
  onPreviousPage,
  onNextPage,
}) => {
  return (
    <div className="flex items-center justify-between px-2 py-2">
      <Pagination
        isCompact
        showControls
        showShadow={false}
        color="success"
        page={page}
        total={pages}
        onChange={setPage}
      />
      <div className="hidden w-[30%] justify-end gap-2 sm:flex">
        <Button
          isDisabled={pages === 1}
          size="sm"
          variant="flat"
          onPress={onPreviousPage}
        >
          Previous
        </Button>
        <Button
          isDisabled={pages === 1}
          size="sm"
          variant="flat"
          onPress={onNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
