import * as React from "react";
import { GridCellProps, GridHeaderCellProps } from "@progress/kendo-react-grid";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { Modal } from "./Modal";
import { PieChart } from "./pieChart";

export const TooltipCellWithModal = (props: GridCellProps) => {
  let data;

  if (props.field!.includes(".")) {
    const fields = props.field!.split(".");
    data = props.dataItem?.[fields[0]]?.[fields[1]];
  } else {
    data = props.dataItem[props.field!];
  }
  const [show, setShow] = React.useState(false);
  return (
    <td className={props.className} colSpan={props.colSpan} style={props.style}>
      <Tooltip anchorElement="target" position="right">
        <a
          onClick={() => setShow(!show)}
          href="#"
          title="Click to see more info"
        >
          {data}
        </a>
      </Tooltip>
      <Modal show={show}>
        <div
          style={{
            height: 400,
            width: 400,
            backgroundColor: "aliceblue",
            position: "absolute",
            top: "20%",
            left: "40%",
            display: "flex",
            flexDirection: "column",
            padding: 30,
            borderRadius: 5,
            zIndex: 10000
          }}
        >
          <div style={{ cursor: "pointer" }} onClick={() => setShow(false)}>
            Exit
          </div>
          <div style={{ width: "100%", fontSize: 80, textAlign: "center" }}>
            {data}
          </div>
          <div style={{ width: "100%", fontSize: 80, textAlign: "center" }}>
            {props.dataIndex}
          </div>
          <div style={{ width: "100%", fontSize: 80, textAlign: "center" }}>
            Wow!
          </div>
          <div style={{ width: "100%", fontSize: 80, textAlign: "center" }}>
            Awesome
          </div>
        </div>
      </Modal>
    </td>
  );
};

type TooltipHeaderCellProps = GridHeaderCellProps & { column: any; data: any };

export const TooltipHeaderCellWithModal = ({
  column,
  data,
  ...props
}: TooltipHeaderCellProps) => {
  const [show, setShow] = React.useState(false);
  const [series, setSeries] = React.useState([]);

  const userID = column.id;

  const onClick = () => {
    setShow(!show);

    const JPMContainsUser = data
      ?.filter(
        (item: any) =>
          Object.keys(item).includes(userID) && item[userID].w !== undefined
      )
      .sort((a: any, b: any) => {
        return a[userID] - b[userID];
      });

    setSeries(
      JPMContainsUser?.slice(0, 10).map((_: any) => ({
        jobName: _.name,
        // @ts-ignore
        worked: _[userID]?.w
      }))
    );
  };

  return (
    <td>
      <Tooltip anchorElement="target" position="right">
        <a onClick={onClick} href="#" title="Click to see more info">
          {props.title}
        </a>
      </Tooltip>
      <Modal show={show}>
        <div
          style={{
            height: 600,
            width: 600,
            backgroundColor: "aliceblue",
            position: "absolute",
            top: "20%",
            left: "40%",
            display: "flex",
            flexDirection: "column",
            padding: 30,
            borderRadius: 5,
            zIndex: 10000
          }}
        >
          <div
            style={{ cursor: "pointer", padding: "0 0 1em" }}
            onClick={() => setShow(false)}
          >
            CLOSE
          </div>
          <PieChart series={series} title={props.title!} />
        </div>
      </Modal>
    </td>
  );
};
