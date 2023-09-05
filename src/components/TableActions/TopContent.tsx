import {
  type ReactNode,
  type ChangeEvent,
  type FunctionComponent,
} from "react";

type TopContentProps = {
  total: number;
  content?: ReactNode;
  onRowsPerPageChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export const TopContent: FunctionComponent<TopContentProps> = ({
  total,
  content,
  onRowsPerPageChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {content}
      <div className="flex items-center justify-between">
        <span className="text-small text-default-400">Total {total} data</span>
        <label className="flex items-center text-small text-default-400">
          Rows per page:
          <select
            className="bg-transparent text-small text-default-400 outline-none"
            onChange={onRowsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </div>
  );
};
