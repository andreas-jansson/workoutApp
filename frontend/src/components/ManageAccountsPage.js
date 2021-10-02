import React, { Component, useState, useEffect } from "react";
import MaterialTable from "material-table";

export default function ManageAccountsPage() {
  // Table
  const [data, setData] = useState([]);

  const columns = [
    { title: "roleid", field: "roleid" },
    { title: "id", field: "id" },
    { title: "fname", field: "fname" },
    { title: "lname", field: "lname" },
    { title: "email", field: "email" },
  ];

  useEffect(() => {
    fetch("/api/get-user")
      .then((resp) => resp.json())
      .then((resp) => {
        setData(resp);
      });
  }, []);

  const handleRowUpdate = (newData, oldData, resolve) => {
        patch("/api/update-user" + newData.id, newData)
        .then((resp) => {
          const dataUpdate = [...data];
          const index = oldData.tableData.id;
          dataUpdate[index] = newData;
          setData([...dataUpdate]);
          resolve();
        })
  };


  const handleRowDelete = (oldData, resolve) => {
    patch(`/api/delete-user/${oldData.id}`).then((resp) => {
      const dataDelete = [...data];
      const index = oldData.tableData.id;
      dataDelete.splice(index, 1);
      setData([...dataDelete]);
      resolve();
    });
  };

  return (
    <div>
      <div style={{ maxWidth: "50%" }} align="right" className="container.db">
        <h1 align="center">User Management</h1>

        <MaterialTable
          title="Users"
          data={data}
          columns={columns}
          editable={{
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve) => {
                handleRowUpdate(newData, oldData, resolve);
              }),
              onRowDelete: (oldData) =>
              new Promise((resolve) => {
                handleRowDelete(oldData, resolve)
              }),
          
          }}
          options={{
            actionsColumnIndex: -1,
            addRowPosition: "first",
          }}
        />
      </div>
    </div>
  );
}
