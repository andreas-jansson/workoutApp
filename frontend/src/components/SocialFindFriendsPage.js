import React, { Component, useState, useEffect } from "react";
import MaterialTable from "material-table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import MTableToolbar from "material-table";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
//import '../../static/css/social-find-friends.css';

import "../../static/css/social-find-friends.css";

function SocialFindFriendsPage() {
  const [data, setData] = useState([]);

  const visability_any_url = "/api/social-find-email-friends";
  const visability_one_url = "/api/social-find-visible-friends";

  const columns = [
    {
      title: "Email Address",
      field: "email",
    },
  ];

  const getPublicUsers = () => {
    fetch(visability_any_url)
      .then((resp) => resp.json())
      .then((resp) => setData(resp));
  };

  useEffect(() => {
    getPublicUsers();
  }, []);

  return (
    <div>
      <div className="sff-container">
      <div>
        <br /> <br />
        <MaterialTable
          title={<div className = 'sff-title' align="center">🏋🏻‍♂️Find a gym partner🏋🏿</div>}
          columns={columns}
          data={data}
          actions={[
            
            data => ({
              icon: "favorite",
              openIcon: "contact_page",
              tooltip: "Send Friend Request!",
              onClick: (event, data) =>
              alert("Friend request sent to" + data.fname + data.lname),
              //hidden: data.isVisible < 1,
              disabled: data.isVisible < 1,
            }),
          ]}
          localization={{
            header: {
              actions: "\u00A0 +",
              textAlign: "left",
            },
            toolbar: {
              searchTooltip: "Search for a friend through their mail",
              searchPlaceholder: "model@gmail.com",
            },
          }}
          options={{
            headerStyle: {
              backgroundColor: "#ff8b00",
              color: "#FFF",
              fontWeight: "bolder",
              fontSize: 19,
              fontStyle: "roboto",
              height: 5,
            },
            searchAutoFocus: true,
            rowStyle: (data) => ({
              fontSize: 17,
              color: "black",
              fontWeight: "bolder",
              fontStyle: "Times New Roman",
            }),
            searchFieldStyle: {
              fontWeight: "bolder",
              backgroundColor: "#FFD5AA",
              fontStyle: "Times New Roman",
              borderRadius: 20,
            },
            actionsColumnIndex: -1,
          }}
          detailPanel={[
            {
              icon: "email",
              openIcon: "contact_page",
              tooltip: "Show User Info",
              render: (data) => {
                if (data.isVisible) {
                return (
                  <div
                    style={{
                      fontSize: 20,
                      marginLeft: 20,
                      width: 300,
                      textAlign: "center",
                      color: "white",
                      backgroundColor: "orange",
                    }}
                    >
                    {data.fname} {data.lname}
                  </div>
                );
              }
              else
              {
                return (
                  <div
                    style={{
                      fontSize: 20,
                      marginLeft: 20,
                      width: 300,
                      textAlign: "center",
                      color: "white",
                      backgroundColor: "red",
                    }}
                    >
                    PRIVATE PROFILE: CANNOT ADD!
                  </div>
                );
              }
            }
            },
          ]}
        />
      </div>
      </div>
    </div>
  );
}

export default SocialFindFriendsPage;
