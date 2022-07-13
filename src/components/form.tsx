import * as React from "react";
import * as faker from "faker";
import {
  Form,
  Field,
  FormElement,
  FieldRenderProps,
  FormRenderProps,
  FormValidatorType
} from "@progress/kendo-react-form";
import { Error } from "@progress/kendo-react-labels";
import { Input } from "@progress/kendo-react-inputs";
import { getter } from "@progress/kendo-react-common";
import { CTDatePicker } from "./DatePicker";
import {
  MultiSelect,
  MultiSelectTree,
  getMultiSelectTreeValue
} from "@progress/kendo-react-dropdowns";
import {
  processMultiSelectTreeData,
  expandedState,
  treeData
} from "./multiselecttree-data-operations";
import { filterBy } from "@progress/kendo-data-query";
const empties = [...Array(20)];
const divisions = empties.map(() => faker.commerce.department());
const dataItemKey = "id";
const checkField = "checkField";
const checkIndeterminateField = "checkIndeterminateField";
const subItemsField = "items";
const expandField = "expanded";
const textField = "text";
const fields = {
  dataItemKey,
  checkField,
  checkIndeterminateField,
  expandField,
  subItemsField
};

const firstNameGetter: any = getter("firstName");
const lastNameGetter: any = getter("lastName");
const firstOrLastNameValidator = (values: any) => {
  if (firstNameGetter(values) || lastNameGetter(values)) {
    return;
  }

  return {
    VALIDATION_SUMMARY: "Please fill at least one of the following fields.",
    ["firstName"]: "Please check the validation summary for more information.",
    ["lastName"]: "Please check the validation summary for more information."
  };
};

const ValidatedInput = (fieldRenderProps: FieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  return (
    <div>
      <Input {...others} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

export const FormComponent = () => {
  const [selected, setSelected] = React.useState<any>(divisions);
  const onFilterChange = (e: any) =>
    setSelected(filterBy(divisions.slice(), e.filter));

  // #region MultiSelectTree
  const [value, setValue] = React.useState([]);
  // @ts-ignore
  const [expanded, setExpanded] = React.useState([treeData[0][dataItemKey]]);

  const onChange = (event: any) =>
    // @ts-ignore
    setValue(getMultiSelectTreeValue(treeData, { ...fields, ...event, value }));

  const onExpandChange = React.useCallback(
    // @ts-ignore
    (event) => setExpanded(expandedState(event.item, dataItemKey, expanded)),
    [expanded]
  );
  const treeDataMemo = React.useMemo(
    () =>
      // @ts-ignore
      processMultiSelectTreeData(treeData, {
        expanded,
        value,
        // @ts-ignore
        ...fields
      }),
    [expanded, value]
  );
  // #endregion

  const handleSubmit = (dataItem: any) =>
    alert(JSON.stringify(dataItem, null, 2));

  return (
    <Form
      onSubmit={handleSubmit}
      validator={firstOrLastNameValidator}
      render={(formRenderProps: FormRenderProps) => (
        <FormElement style={{ maxWidth: 650 }}>
          <fieldset className={"k-form-fieldset"}>
            <legend className={"k-form-legend"}>
              Please fill in the following information:
            </legend>
            {formRenderProps.visited &&
              formRenderProps.errors &&
              formRenderProps.errors.VALIDATION_SUMMARY && (
                <div className={"k-messagebox k-messagebox-error"}>
                  {formRenderProps.errors.VALIDATION_SUMMARY}
                </div>
              )}
            <div className="mb-3">
              <Field
                name={"firstName"}
                component={ValidatedInput}
                label={"First name"}
              />
            </div>
            <div className="mb-3">
              <Field
                name={"lastName"}
                component={ValidatedInput}
                label={"Last name"}
              />
            </div>
            <div style={{ marginTop: 20 }} className="mb-3">
              <MultiSelect
                label="Divisions"
                placeholder="Please select divisions"
                name="divisions"
                data={selected}
                onFilterChange={onFilterChange}
                filterable
              />
            </div>
            <div style={{ marginTop: 20 }} className="mb-3">
              <MultiSelectTree
                label="SubJobs"
                placeholder="Please select SubJobs"
                name="subJobs"
                data={treeDataMemo}
                value={value}
                onChange={onChange}
                textField={textField}
                dataItemKey={dataItemKey}
                checkField={checkField}
                checkIndeterminateField={checkIndeterminateField}
                subItemsField={subItemsField}
                expandField={expandField}
                onExpandChange={onExpandChange}
              />
            </div>
            <div style={{ marginTop: 20 }} className="mb-3">
              <CTDatePicker />
            </div>
          </fieldset>
          <div className="k-form-buttons">
            <button
              type={"submit"}
              className="k-button"
              disabled={!formRenderProps.allowSubmit}
            >
              Submit
            </button>
          </div>
        </FormElement>
      )}
    />
  );
};
