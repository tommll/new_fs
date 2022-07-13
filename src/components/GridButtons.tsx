import * as React from "react";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import { type } from "os";

export const MonthlyHourButton = ({ onClick, label }: any) => (
  <ButtonGroup width="170px">
    <Button type="button" onClick={onClick}>
      {label}
    </Button>
  </ButtonGroup>
);

export const ShowAllocatedButtons = ({
  showUserHours,
  setShowUserHours
}: any) => (
  <ButtonGroup width="200px">
    <Button
      togglable
      selected={showUserHours === "Both"}
      onClick={() => setShowUserHours("Both")}
    >
      Both
    </Button>
    <Button
      togglable
      selected={showUserHours === "Allocated"}
      onClick={() => setShowUserHours("Allocated")}
    >
      A
    </Button>
    <Button
      togglable
      selected={showUserHours === "Worked"}
      onClick={() => setShowUserHours("Worked")}
    >
      W
    </Button>
  </ButtonGroup>
);

export const FilterButtons = ({ filter, setFilter, entity }: any) => (
  <ButtonGroup width="380px">
    <Button togglable selected={filter === 100} onClick={() => setFilter(100)}>
      Show All {entity}
    </Button>
    <Button togglable selected={filter === 30} onClick={() => setFilter(30)}>
      30%
    </Button>
    <Button togglable selected={filter === 10} onClick={() => setFilter(10)}>
      10%
    </Button>
  </ButtonGroup>
);

export const ToggleVirtual = ({ pagination, setPagination }: any) => (
  <ButtonGroup width="200px">
    <Button
      togglable
      selected={pagination === false}
      onClick={() => setPagination(false)}
    >
      Virtual
    </Button>
    <Button
      togglable
      selected={pagination === true}
      onClick={() => setPagination(true)}
    >
      Paginate
    </Button>
  </ButtonGroup>
);
