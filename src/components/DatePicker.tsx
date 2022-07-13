import * as React from "react";

import { DatePicker } from "@progress/kendo-react-dateinputs";

export const CTDatePicker = () => {
  const value = new Date();
  return (
    <div className="example-wrapper row">
      <div className="col-xs-12 col-md-6 example-col">
        <label>Pick a date :</label>
        <DatePicker defaultValue={value} />
      </div>
    </div>
  );
};
