import { GridCellProps, GridRowProps } from "@progress/kendo-react-grid";
import * as React from "react";
interface RowRenderProps {
  originalProps: GridRowProps;
  tr: React.ReactElement<HTMLTableRowElement>;
  exitEdit: (props: GridRowProps) => void;
  editField: string | undefined;
}

export const BooleanGridCell = (props: GridCellProps) => {
  const { className, columnIndex, dataItem, field, style } = props;
  const { Discontinued, champion } = dataItem;
  const value = Discontinued || champion ? "✔️" : "❌";
  return (
    <td
      style={style}
      className={className}
      aria-colindex={columnIndex}
      role="gridcell"
    >
      {value}
    </td>
  );
};

export const RowRender = (props: RowRenderProps) => {
  const trProps = {
    ...props.tr.props,
    onBlur: () => {
      props.exitEdit(props.originalProps);
    }
  };
  return React.cloneElement(props.tr, { ...trProps }, props.tr.props.children);
};
