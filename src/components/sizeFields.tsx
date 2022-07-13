import * as React from "react";
import {
  Field,
  FieldRenderProps,
  FieldWrapper,
  Form,
  FormElement,
  FormRenderProps
} from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";

const FormInput = (fieldRenderProps: FieldRenderProps) => {
  const {
    touched,
    label,
    id,
    valid,
    disabled,
    hint,
    type,
    optional,
    ...others
  } = fieldRenderProps;

  return (
    <FieldWrapper>
      <label>{label}</label>
      <div className={"k-form-field-wrap"}>
        <Input type={type} id={id} {...others} validationMessage="" />
      </div>
    </FieldWrapper>
  );
};

export const SizeFields = ({
  rowSize,
  colSize,
  onSubmit
}: {
  rowSize: number;
  colSize: number;
  onSubmit: (dataItem: any) => void;
}) => {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        rowSize,
        colSize
      }}
      render={(formRenderProps: FormRenderProps) => (
        // @ts-ignore
        <FormElement
          style={{
            display: "grid",
            maxWidth: 650,
            // @ts-ignore
            "grid-template-columns": "15em 15em 8em",
            "column-gap": "3em",
            margin: "0 0.5em 0.5em"
          }}
        >
          <div className="mb-3">
            <Field
              name={"colSize"}
              label={"Total Users"}
              component={FormInput}
            />
          </div>
          <div className="mb-3">
            <Field
              name={"rowSize"}
              label={"Total Jobs"}
              component={FormInput}
            />
          </div>
          <div className="k-form-buttons">
            <button type={"submit"} className="k-button">
              Submit
            </button>
          </div>
        </FormElement>
      )}
    />
  );
};
