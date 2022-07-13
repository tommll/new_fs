import * as React from "react";
import {
  Grid,
  GridPageChangeEvent,
  getSelectedState,
  GridColumn as Column
} from "@progress/kendo-react-grid";
import { getter } from "@progress/kendo-react-common";
import {
  CompositeFilterDescriptor,
  filterBy,
  orderBy,
  SortDescriptor
} from "@progress/kendo-data-query";

type GenericGridProps<T> = {
  children?: any;
  data: T[];
  dataItemId: string;
  selectable: any;
};

export const GenericGrid = <T>({
  children,
  data,
  dataItemId,
  selectable
}: GenericGridProps<T>) => {
  // #region selected state
  const DATA_ITEM_KEY = dataItemId;
  const SELECTED_FIELD = "selected";
  const idGetter = getter(DATA_ITEM_KEY);
  const [dataState] = React.useState(
    data.map((dataItem) => ({ ...dataItem, selected: false }))
  );
  const [selectedState, setSelectedState] = React.useState({});

  const onSelectionChange = React.useCallback(
    (event: any) => {
      const newSelectedState = getSelectedState({
        event,
        selectedState,
        dataItemKey: DATA_ITEM_KEY
      });
      setSelectedState(newSelectedState);
    },
    [selectedState]
  );

  const onHeaderSelectionChange = React.useCallback((event: any) => {
    const checkboxElement = event.syntheticEvent.target;
    const checked = checkboxElement.checked;
    const newSelectedState = {};
    event.dataItems.forEach((dataItem: string) => {
      //@ts-ignore
      newSelectedState[idGetter(dataItem)] = checked;
    });
  }, []);
  // #endregion

  // #region paging
  const initialDataState = { skip: 0, take: 10 };

  const [page, setPage] = React.useState(initialDataState);

  const pageChange = (event: GridPageChangeEvent) => setPage(event.page);
  //#endregion

  // #region sorting
  const initialSortState: SortDescriptor[] = [
    {
      dir: "asc",
      field: "fullName"
    }
  ];
  const [sort, setSort] = React.useState(initialSortState);

  // #endregion

  // #region filtering
  const initialFilterState: CompositeFilterDescriptor = {
    logic: "and",
    filters: []
  };
  const [filter, setFilter] = React.useState(initialFilterState);
  // #endregion
  return (
    <Grid
      data={filterBy(
        orderBy(
          dataState.slice(page.skip, page.take + page.skip).map((item) => ({
            ...item,
            //@ts-ignore
            [SELECTED_FIELD]: selectedState[idGetter(item)]
          })),
          sort
        ),
        filter
      )}
      style={{ height: 400, width: "90%", margin: "auto" }}
      skip={page.skip}
      take={page.take}
      total={dataState.length}
      sortable
      sort={sort}
      //@ts-ignore
      onSortChange={(e) =>
        setSort(([sortObj]) => {
          //@ts-ignore
          if (e.sort[0]?.field !== sortObj[0]?.field) {
            return e.sort;
          }
          return [{ ...sortObj, dir: sortObj.dir === "asc" ? "desc" : "asc" }];
        })
      }
      pageable
      onPageChange={pageChange}
      dataItemKey={DATA_ITEM_KEY}
      selectedField={SELECTED_FIELD}
      selectable={selectable}
      onSelectionChange={onSelectionChange}
      onHeaderSelectionChange={onHeaderSelectionChange}
      reorderable
      filterable
      filter={filter}
      onFilterChange={(e) => setFilter(e.filter)}
    >
      <Column
        field={SELECTED_FIELD}
        width={50}
        filterable={false}
        headerSelectionValue={
          //@ts-ignore
          dataState.findIndex((item) => !selectedState[idGetter(item)]) === -1
        }
      />
      {children}
    </Grid>
  );
};
