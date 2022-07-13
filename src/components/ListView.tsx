import * as React from "react";
import {
  GridColumn as Column,
  getSelectedState
} from "@progress/kendo-react-grid";
import { peopleData } from "../peopleData";
import { GenericGrid } from "./GenericGrid";

export const ListView = () => {
  const selectable = {
    enabled: true,
    drag: true,
    cell: true,
    mode: "multiple"
  };
  return (
    <div>
      <h1>People</h1>
      <GenericGrid data={peopleData} dataItemId="id" selectable={selectable}>
        <Column field="fullName" title="Full Name" />
        <Column field="email" title="Email Address" />
        <Column field="security" title="Security" />
        <Column field="performanceReport" title="Performance Report" />
        <Column field="timeOffApprover" title="Time Off Approver" />
        <Column field="team" title="Team" />
      </GenericGrid>
    </div>
  );
};
