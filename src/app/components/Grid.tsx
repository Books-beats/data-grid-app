"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { useQueryState, createParser } from "nuqs";
import "ag-grid-community/styles/ag-theme-alpine.css";
import data from "../../../sample-applications.json";
import {
  ModuleRegistry,
  AllCommunityModule,
  GridState,
  StateUpdatedEvent,
} from "ag-grid-community";
import {
  UpdateStatusButton,
  StatusButtonParams,
} from "../components/UpdateStatusButton";
import * as XLSX from "xlsx";

// Define types for the row data
interface Skill {
  id: string;
  name: string;
  years: string;
}

interface SkillsContainerData {
  skills: Skill[];
}

interface SkillsContainer {
  data: SkillsContainerData;
}

interface RowData {
  id: string;
  userId: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  ctc: string;
  employer: string;
  currentContractType: string | null;
  currentWorkType: string | null;
  preferredWorkType: string;
  matchPercentage: number;
  offerCTC: number | string;
  offersInHand: string;
  overallExperience: string;
  willingToRelocate: boolean;
  expectedCTC: string;
  noticePeriod: string;
  applicationStatus: string;
  attachmentFileExtension: string;
  createdAt: string;
  skills: Skill[];
}

interface ColDef {
  field: string;
  headerName: string;
  cellRenderer?: (params: string) => string;
}

ModuleRegistry.registerModules([AllCommunityModule]);

const parseAsJson = createParser({
  parse(queryValue) {
    return JSON.parse(queryValue);
  },
  serialize(value) {
    return JSON.stringify(value);
  },
});

const DataGrid: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridState, setGridState] = useQueryState<GridState | undefined | null>(
    "gridState",
    parseAsJson
  );
  const [searchQuery, setSearchQuery] = useQueryState<string>("query", {
    defaultValue: "",
    parse: (query: string) => query,
  });
  // URL state management for rowData and colDefs
  const [rowData, setRowData] = useQueryState<RowData[]>("rowData", {
    defaultValue: data, // Default data if URL state is empty
    parse: (data: string) => JSON.parse(data), // Parse the JSON string to an object
  });

  function jsonToExcel(data: RowData[], fileName = "data") {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(excelFile)], {
      type: "application/octet-stream",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.xlsx`;

    link.click();
  }

  function s2ab(str: string) {
    const buf = new ArrayBuffer(str.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < str.length; i++) {
      view[i] = str.charCodeAt(i) & 0xff;
    }
    return buf;
  }

  const handleDownload = () => {
    jsonToExcel(data, "my-data");
  };

  const skillColumns = useMemo(() => {
    const uniqueSkills: string[] = Array.from(
      new Set(rowData.flatMap((row) => row.skills.map((skill) => skill.name)))
    );
    return uniqueSkills.map((skillName) => ({
      field: skillName,
      headerName: skillName,
      hide: false,
      headerComponent: "customHeader",
      suppressToolPanel: false,
      valueGetter: (params: SkillsContainer) => {
        const skill = params.data.skills.find(
          (skill: Skill) => skill.name === skillName
        );
        return skill ? `${skill.years} years` : "N/A";
      },
    }));
  }, [rowData]);

  const statusColumn = [
    {
      field: "applicationStatus",
      headerName: "Application Status",
      headerComponent: "customHeader",
      valueGetter: (params: StatusButtonParams) => {
        JSON.stringify(params.data);
      },
      cellRenderer: UpdateStatusButton,
      sortable: true,
      filter: true,
      hide: false,
      suppressToolPanel: false,
    },
  ];

  const baseColumns = [
    {
      field: "name",
      headerName: "Name",
      sortable: true,
      filter: true,
      hide: false,
      suppressToolPanel: false,
    },
    {
      field: "email",
      headerName: "Email",
      sortable: true,
      filter: true,
      hide: false,
      suppressToolPanel: false,
    },
    {
      field: "phone",
      headerName: "Phone",
      sortable: true,
      filter: true,
      hide: false,
      suppressToolPanel: false,
    },
    {
      field: "location",
      headerName: "Location",
      sortable: true,
      filter: true,
      hide: false,
      suppressToolPanel: false,
    },
    {
      field: "ctc",
      headerName: "CTC",
      sortable: true,
      filter: true,
      hide: false,
      suppressToolPanel: false,
    },
    {
      field: "expectedCTC",
      headerName: "Expected CTC",
      sortable: true,
      filter: true,
      hide: false,
      suppressToolPanel: false,
    },
    {
      field: "noticePeriod",
      headerName: "Notice Period",
      sortable: true,
      filter: true,
      hide: false,
      suppressToolPanel: false,
    },
  ];

  const [colDefs] = useQueryState<ColDef[]>("colDefs", {
    defaultValue: [...baseColumns, ...skillColumns, ...statusColumn],
    parse: (data) => JSON.parse(data),
  });

  useEffect(() => {
    if (!rowData.length) setRowData(data);
  }, [rowData, setRowData]);

  const exportCSV = () => gridRef?.current?.api.exportDataAsCsv();

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          padding: "0 10px",
        }}
      >
        {/* Global Search functionality */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          style={{
            width: "20%",
            padding: "0.15rem",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        {/* Export Buttons */}
        <div>
          <button
            onClick={exportCSV}
            style={{
              padding: "0.3rem 0.6rem",
              marginRight: "0.5rem",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#f0f0f0",
              cursor: "pointer",
            }}
          >
            Export CSV
          </button>
          <button
            onClick={handleDownload}
            style={{
              padding: "0.3rem 0.6rem",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#f0f0f0",
              cursor: "pointer",
            }}
          >
            Export Excel
          </button>
        </div>
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: 500, width: "100%", margin: "10px" }}
      >
        <AgGridReact
          initialState={gridState || undefined}
          onStateUpdated={(e: StateUpdatedEvent) => {
            setGridState(e.state);
          }}
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={{ sortable: true, filter: true, resizable: true }}
          pagination={true}
          paginationPageSize={20}
          quickFilterText={searchQuery}
          suppressMovableColumns={false}
        />
      </div>
    </>
  );
};

export default DataGrid;
