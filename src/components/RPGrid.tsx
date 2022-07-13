import * as React from "react";
import {
  Grid,
  GridFooterCellProps,
  GridItemChangeEvent,
  GridPageChangeEvent,
  GridRowProps
} from "@progress/kendo-react-grid";
import { GridColumn as Column } from "@progress/kendo-react-grid";
import { RowRender } from "./renderer";
import { TooltipHeaderCellWithModal } from "./TooltipCell";

import { GridCellPropsEdit } from "./interfaces";
import {
  MonthlyHourButton,
  ShowAllocatedButtons,
  ToggleVirtual
} from "./GridButtons";

const initialDataState = { skip: 0, take: 50 };

export type filterRows = 100 | 30 | 10 | 0;
export type filterCols = 100 | 30 | 10 | 0;

type ShowAllocated = "Both" | "Allocated" | "Worked";

const useGridData = ({ rows, setRows, onUpdateJPMData }: any) => {
  const [editField, setEditField] = React.useState<string | undefined>(
    undefined
  );
  const [pagination, setPagination] = React.useState(false);

  const enterEdit = (dataItem: any, field: string | undefined) => {
    // if (editField !== undefined) {
    // 	return;
    // }
    const newData = rows?.map((item: any) => ({
      ...item,
      inEdit: item.id === dataItem.id ? field : undefined
    }));
    setRows(newData);
    setEditField(field);
  };

  const exitEdit = async (props: GridRowProps) => {
    const userID = editField?.split(".")[0];
    const jobID = props.dataItem.id;
    const newData = rows?.map((item: any) => ({
      ...item,
      inEdit: undefined
    }));
    try {
      await onUpdateJPMData({
        userID,
        jobID,
        hours: props.dataItem[userID!].a
      });
      setEditField(undefined);
      setRows(newData);
    } catch (ex) {
      console.log({ ex });
    }
  };

  const customCell: any = (
    td: React.ReactElement<HTMLTableCellElement>,
    props: GridCellPropsEdit
  ) => {
    const dataItem = props.dataItem;
    const cellField = props.field;
    const inEditField = dataItem[props.editField || ""];
    const onClick = () =>
      cellField && cellField === inEditField
        ? {}
        : enterEdit(dataItem, cellField);

    return (
      //@ts-ignore
      <td
        {...props}
        aria-colindex={props.columnIndex}
        role="gridcell"
        onClick={onClick}
      >
        {td.props.children}
      </td>
    );
  };

  const itemChange = (event: GridItemChangeEvent) => {
    let fields = event.field!.split(".");

    if (event.dataItem[fields[0]] === undefined) {
      event.dataItem[fields[0]] = {};
    }
    event.dataItem[fields[0]][fields[1]] = event.value;
    let newData = rows?.map((item: any) => {
      if (item.id === event.dataItem.id) {
        //@ts-ignore
        item[fields[0]][fields[1]] = event.value;
      }
      return item;
    });
    setRows(newData);
  };

  const customRowRender: any = (
    tr: React.ReactElement<HTMLTableRowElement>,
    props: GridRowProps
  ) => (
    <RowRender
      originalProps={props}
      tr={tr}
      exitEdit={exitEdit}
      editField={editField}
    />
  );

  return {
    pagination,
    setPagination,
    customCell,
    customRowRender,
    itemChange
  };
};

const totalCell = (
  props: GridFooterCellProps,
  personAllocatedTotal: Record<string, number>,
  personWorkedTotal: Record<string, number>
) => {
  const fields = (props.field || "").split(".");
  const id = fields[0];
  const hourType = fields[1];

  const record = hourType === "a" ? personAllocatedTotal : personWorkedTotal;

  return (
    <td colSpan={props.colSpan} style={props.style}>
      {record[id] || 0} hrs
    </td>
  );
};

function determineChildrenColumns(
  column: any,
  showUserHours: string,
  rows: any,
  personAllocatedTotal: Record<string, number>,
  personWorkedTotal: Record<string, number>
) {
  const allocated = (
    <Column
      field={`${column.id}.a`}
      title="allocated"
      width={showUserHours === "Both" ? 100 : 200}
      editor="numeric"
      footerCell={(props: GridFooterCellProps) => {
        return totalCell(props, personAllocatedTotal, personWorkedTotal);
      }}
    />
  );

  const worked = (
    <Column
      field={`${column.id}.w`}
      title="worked"
      width={showUserHours === "Both" ? 100 : 200}
      editable={false}
      footerCell={(props: GridFooterCellProps) => {
        return totalCell(props, personAllocatedTotal, personWorkedTotal);
      }}
    />
  );

  const grandChildren = [];
  if (showUserHours === "Both") {
    grandChildren.push(allocated, worked);
  } else if (showUserHours === "Allocated") {
    grandChildren.push(allocated);
  } else if (showUserHours === "Worked") {
    grandChildren.push(worked);
  }

  const child = [
    <Column
      title={column.name}
      className="headerClass"
      headerCell={(props) => {
        return (
          <TooltipHeaderCellWithModal {...props} column={column} data={rows} />
        );
      }}
      width={200}
    >
      {grandChildren}
    </Column>
  ];

  return <Column title={column.h!.toString()} children={child} width={200} />;
}

export const RPGrid = ({
  rows,
  columns,
  setRows,
  personAllocatedTotal,
  personWorkedTotal,
  totalCount,
  onUpdateJPMData
}: any) => {
  const [page, setPage] = React.useState(initialDataState);

  const [showUserHours, setShowUserHours] = React.useState<ShowAllocated>(
    "Both"
  );

  const {
    pagination,
    setPagination,
    customCell,
    customRowRender,
    itemChange
  } = useGridData({ rows, setRows, onUpdateJPMData });

  return (
    <>
      <div className="filterButtonContainer">
        <ShowAllocatedButtons
          showUserHours={showUserHours}
          setShowUserHours={setShowUserHours}
        />
        <ToggleVirtual pagination={pagination} setPagination={setPagination} />
      </div>

      <Grid
        style={{ height: "600px", width: "1400px" }}
        data={rows?.slice(page.skip, page.skip + page.take)}
        cellRender={customCell}
        editField="inEdit"
        onItemChange={itemChange}
        rowRender={customRowRender}
        skip={page.skip}
        take={page.take}
        total={totalCount}
        pageable={pagination ? true : false}
        scrollable={pagination ? "scrollable" : "virtual"}
        onPageChange={(event: GridPageChangeEvent) => setPage(event.page)}
        columnVirtualization
      >
        <Column
          title="Job Name"
          field="name"
          locked
          width={200}
          editable={false}
        />
        {columns?.map((column: any) => {
          return determineChildrenColumns(
            column,
            showUserHours,
            rows,
            personAllocatedTotal,
            personWorkedTotal
          );
        })}
        <Column
          title="Allocated Total"
          field="allocatedTotal"
          locked
          width={120}
        />
        <Column title="Worked Total" field="workedTotal" locked width={120} />
      </Grid>
    </>
  );
};
