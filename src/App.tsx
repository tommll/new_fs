import React, { Component } from "react";
import useSWR from "swr";
import "./App.css";
import "./KendoCustomTheme.css";
import { filterCols, filterRows, RPGrid } from "./components/RPGrid";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { ListView } from "./components/ListView";
import { deleteTable, IColumns, rpTable } from "./utils/dexie";
import Dexie from "dexie";
import {
  MultiSelect,
  MultiSelectChangeEvent
} from "@progress/kendo-react-dropdowns";
import { SizeFields } from "./components/sizeFields";

let personAllocatedTotal: Record<string, number> = {};
let personWorkedTotal: Record<string, number> = {};

const calculateAllocatedTotal = (rows: any, columns?: any) => {
  const keys = columns?.map((item: any) => item.id);
  if (
    Object.keys(personAllocatedTotal).length === 0 &&
    Object.keys(personWorkedTotal).length === 0 &&
    rows
  ) {
    rows.forEach((jpm: any) => {
      let jobWorkedTotal = 0;
      let jobAllocatedTotal = 0;
      Object.keys(jpm).forEach((key) => {
        if (
          key !== "id" &&
          key !== "name" &&
          (columns === undefined || keys.includes(key))
        ) {
          const allocated = parseInt(jpm[key]?.a || 0, 10);
          personAllocatedTotal[key] =
            (personAllocatedTotal[key] || 0) + allocated;

          const worked = parseInt(jpm[key]?.w || 0, 10);
          personWorkedTotal[key] = (personWorkedTotal[key] || 0) + worked;

          jobAllocatedTotal += allocated;
          jobWorkedTotal += worked;
        }
      });

      jpm.allocatedTotal = `${jobAllocatedTotal} hrs`;
      jpm.workedTotal = `${jobWorkedTotal} hrs`;
    });
  }
};

//@ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const middleware = ({
  setSelectedJobs,
  setSelectedUsers,
  dispatchAllUserJobs
}: any) => {
  return (key: any, fetcher: any, config: any) => {
    const swr = useSWR(key, fetcher, { revalidateOnFocus: false });

    React.useEffect(() => {
      const insertData = async () => {
        await rpTable.columns?.clear();
        await rpTable.jpmData?.clear();
        if (swr.data?.columns) {
          await rpTable.columns?.bulkAdd(swr.data.columns);
          await rpTable.jpmData?.bulkAdd(swr.data.JPMData);
          await rpTable.users?.bulkAdd(swr.data.columns);
          await rpTable.jobs?.bulkAdd(
            swr.data.JPMData.map((row: any) => ({ id: row.id, name: row.name }))
          );

          const orderedJobs = () =>
            swr.data.JPMData.sort((a: any, b: any) =>
              a.name.localeCompare(b.name)
            );

          const orderedUsers = () =>
            swr.data.columns.sort((a: any, b: any) =>
              a.name.localeCompare(b.name)
            );

          dispatchAllUserJobs({
            type: "UPDATE_JPM",
            payload: {
              jobs: orderedJobs(),
              users: orderedUsers()
            }
          });

          setSelectedJobs([]);
          setSelectedUsers([]);
        }
      };

      insertData();
    }, [swr.data]);

    if (swr.data) {
      calculateAllocatedTotal(swr.data.JPMData);
    }

    return swr;
  };
};

const JPMReducer = (state: any, dispatch: any) => {
  switch (dispatch.type) {
    case "UPDATE_JPM":
      return {
        ...state,
        allUsers: dispatch.payload.users,
        allJobs: dispatch.payload.jobs
      };
    case "UPDATE_COLUMNS":
      return {
        ...state,
        columns: dispatch.payload.columns
      };
    case "UPDATE_ROWS":
      return {
        ...state,
        rows: dispatch.payload.rows
      };
  }
};

deleteTable();
const App = () => {
  const [[rowSize, colSize], setSize] = React.useState([1000, 300]);
  const [
    { allUsers, allJobs, columns, rows },
    dispatchAllUserJobs
  ] = React.useReducer(JPMReducer, {
    allUsers: [],
    allJobs: [],
    columns: [],
    rows: []
  });

  const [selectedUsers, setSelectedUsers] = React.useState<
    Record<string, any>[]
  >([]);
  const [selectedJobs, setSelectedJobs] = React.useState<Record<string, any>[]>(
    []
  );

  const baseURL = "https://rp-performance.azurewebsites.net";
  //const baseURL = 'http://localhost:8080';

  useSWR(`${baseURL}/api/?csize=${colSize}&rsize=${rowSize}`, fetcher, {
    use: [
      () =>
        middleware({
          setSelectedJobs,
          setSelectedUsers,
          dispatchAllUserJobs
        })
    ]
  });

  React.useEffect(() => {
    const insertData = async () => {
      let data;

      if (selectedUsers.length === 0) {
        data = await rpTable.columns?.toArray();
      } else {
        data = await rpTable.columns
          .where("id")
          .anyOf(selectedUsers.map((item: any) => item.id))
          .toArray();
      }

      personAllocatedTotal = {};
      personWorkedTotal = {};
      calculateAllocatedTotal(
        rows?.length ? rows : await rpTable.jpmData?.toArray(),
        data
      );
      dispatchAllUserJobs({
        type: "UPDATE_COLUMNS",
        payload: {
          columns: data
        }
      });
    };

    insertData();
  }, [selectedUsers]);

  React.useEffect(() => {
    const insertData = async () => {
      let data;

      if (selectedJobs.length === 0) {
        data = await rpTable.jpmData?.toArray();
      } else {
        data = await rpTable.jpmData
          .where("id")
          .anyOf(selectedJobs.map((item: any) => item.id))
          .toArray();
      }

      personAllocatedTotal = {};
      personWorkedTotal = {};
      calculateAllocatedTotal(
        data,
        columns?.length ? columns : await rpTable.columns?.toArray()
      );
      dispatchAllUserJobs({
        type: "UPDATE_ROWS",
        payload: {
          rows: data
        }
      });
    };

    insertData();
  }, [selectedJobs]);

  const handleUserSelect = (event: MultiSelectChangeEvent) => {
    setSelectedUsers(event.value);
  };

  const handleJobSelect = (event: MultiSelectChangeEvent) => {
    setSelectedJobs(event.value);
  };

  const onSubmit = ({ rowSize, colSize }: any) => {
    setSize([parseInt(rowSize, 10), parseInt(colSize, 10)]);
  };

  const totalCount = allJobs.length;

  const setRows = (data: any) => {
    dispatchAllUserJobs({
      type: "UPDATE_ROWS",
      payload: {
        rows: data
      }
    });
  };

  const onUpdateJPMData = async ({ jobID, userID, hours }: any) => {
    // put this in transaction so we don't alter the table while we're updating
    // see https://dexie.org/docs/Tutorial/Best-Practices#3-avoid-using-other-async-apis-inside-transactions
    await rpTable.transaction("rw", rpTable.jpmData, async () => {
      const res = await Dexie.waitFor(() =>
        fetch(`${baseURL}/api`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            jobID,
            userID,
            hours
          })
        })
      );
      // @ts-ignore
      if (res.status === 200) {
        console.log("success");

        await rpTable.jpmData.get(jobID).then(async (jpm: any) => {
          let userData = jpm[userID];
          if (userData === undefined) {
            userData = {};
          }

          userData.a = hours;

          await rpTable.jpmData.update(jobID, {
            [userID]: userData
          });
        });

        //refresh grid
        setSelectedJobs([...selectedJobs]);
      } else {
        throw new Error("server error");
      }
    });
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="list-view" element={<ListView />} />
            {/* <Route
              path="rp-grid"
              element={
                <>
                  <SizeFields
                    rowSize={rowSize}
                    colSize={colSize}
                    onSubmit={onSubmit}
                  />
                  <p>Jobs Filter:</p>
                  <MultiSelect
                    data={allJobs}
                    autoClose={false}
                    textField="name"
                    dataItemKey="id"
                    onChange={handleJobSelect}
                    value={selectedJobs}
                  />
                  <p>Users Filter:</p>
                  <MultiSelect
                    data={allUsers}
                    autoClose={false}
                    textField="name"
                    dataItemKey="id"
                    onChange={handleUserSelect}
                    value={selectedUsers}
                  />
                  <RPGrid
                    rows={rows}
                    columns={columns}
                    setRows={setRows}
                    personAllocatedTotal={personAllocatedTotal}
                    personWorkedTotal={personWorkedTotal}
                    totalCount={totalCount}
                    onUpdateJPMData={onUpdateJPMData}
                  />
                </>
              }
            /> */}
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
