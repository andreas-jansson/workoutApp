import React, { Component, useState, useEffect } from "react";
import MaterialTable from "material-table";
import "../../static/css/manage-account-table.css";

function ManageAccountsPage() {
  const url = "/api/manage-user";
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    {
      title: "User ID",
      field: "id",
      editable: "never",
      filtering: false,
    },
    {
      title: "First name",
      field: "fname",
      filtering: false,
      validate: (rowData) =>
        rowData.fname.length < 3
          ? {
            isValid: false,
            helperText: "Forename must be longer than 3 Characters",
            }
          : true,
    },
    {
      title: "Last name",
      field: "lname",
      filtering: false,
      validate: (rowData) =>
        rowData.lname.length < 3
          ? {
              isValid: false,
              helperText: "Surname must be longer than 3 Characters",
            }
          : true,
    },
    {
      title: "Email Address",
      field: "email",
      filtering: false,
      validate: (rowData) =>
        rowData.email === ""
          ? { isValid: false, helperText: "Email cannot be empty" }
          : true,
    },
    {
      title: "Role ID",
      field: "roleid",
      editable: "never",
      lookup: { 1: "Pending", 2: "Client", 3: "Coach", 4: "Admin" },
    },
    {
      title: "Time of Creation",
      field: "created",
      editable: "never",
      filtering: false,
    },
  ];

  const getUsers = () => {
    fetch(url)
      .then((resp) => resp.json())
      .then((resp) => setData(resp));
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <div className="mactable-signup-text"></div>
      <div className="mactable-container">
        <br /> <br />
        <MaterialTable
          style={{
            fontSize: 20,
            textAlign: "center",
            backgroundColor: "white",
          }}
          title={
            <div className="mactable-signup-text">
              <h2>Account Management Table</h2>
            </div>
          }
          onRowClick={(evt, selectedRow) =>
            setSelectedRow(selectedRow.tableData.id)
          }
          options={{
            headerStyle: {
              backgroundColor: "orange",
              color: "#FFF",
              fontWeight: "bolder",
              fontSize: 15,
              fontStyle: "roboto",
            },
            rowStyle: (rowData) => ({
              fontSize: 17,
              backgroundColor:
                selectedRow === rowData.tableData.id ? "#484849" : "#ededef",
              color: selectedRow === rowData.tableData.id ? "#FFF" : "black",
            }),
            searchFieldStyle: {
              fontWeight: "bolder",
            },
            exportButton: {
              csv: true,
              pdf: false,
            },
            actionsColumnIndex: -1,
            addRowPosition: "first",
            filtering: true,
          }}
          localization={{
            toolbar: {
              exportCSVName: "Export Excel format",
            },
          }}
          columns={columns}
          data={data}
          editable={{
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                fetch(url + '?id=' + oldData.id, {
                  method: "PUT",
                  headers: {
                    "Content-type": "application/json",
                  },
                  body: JSON.stringify(newData),
                })
                  .then((resp) => resp.json())
                  .then((resp) => {
                    getUsers();
                    resolve();
                  });
              }),

            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                console.log(oldData.id);
                fetch(url + '?id=' + oldData.id, {
                  method: "DELETE",
                  headers: {
                    "Content-type": "application/json",
                  },
                })
                  .then((resp) => resp.json())
                  .then((resp) => {
                    getUsers();
                    resolve();
                  });
              }),
          }}
        />
      </div>
    </div>
  );
}

export default ManageAccountsPage;
