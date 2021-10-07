import React, { Component, useState, useEffect } from "react";
import MaterialTable from "material-table";
import "../../static/css/manage-account-table.css";

function ManageAccountsPage() {
  const url = "api/get-user";
  const [data, setData] = useState([]);
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    fetch(url)
      .then((resp) => resp.json())
      .then((resp) => setData(resp));
  };
  
  const columns = [
    {
      title: "User ID",
      field: "id",
    },
    {
      title: "First name",
      field: "fname",
    },
    {
      title: "Last name",
      field: "lname",
    },
    {
      title: "Email Address",
      field: "email",
    },
    {
      title: "Role ID",
      field: "roleid",
    }
  ];
  return (
    <div> 
      <div className='mactable-signup-text'>
        <h1 align='center'>Account Management</h1>
      </div>

      <div className="mactable-container">
      <br/>    <br/>
        <MaterialTable 
         style='StyledTableCell'
          title="User Details"
          columns={columns}
          data={data}
          options={{ actionsColumnIndex: -1, addRowPosition: "first" }}
          editable={{
            onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              //Backend call
              fetch(url, {
                method: "POST",
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
            onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              //Backend call
              fetch(url + "/" + oldData.id, {
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
              //Backend call
              fetch(url + "/" + oldData.id, {
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
