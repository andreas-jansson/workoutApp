import React, { Component, useState, useEffect } from "react";
import MaterialTable from "material-table";
import SocialFindFriendsEmail from "./SocialFindFriendsEmail";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";


import "../../static/css/social-find-friends.css";

function SocialFindFriendsPage() {
  const [data, setData] = useState([]);
  const [email, setEmail] = useState('');
  const handleSubmit = () => console.log(email);

  const public_url = "/api/social-find-friends";
  const email_url = "/api/social-find-email-friends";

  const columns = [
    {
      title: "🏋🏻‍♂️Find a gym partner🏋🏿",
      field: "email",
    },
  ];

  const getPublicUsers = () => {
    fetch(public_url)
      .then((resp) => resp.json())
      .then((resp) => setData(resp));
  };

  useEffect(() => {
    getPublicUsers();
  }, []);

  
  return (
    <div>
      <br/>
      <SocialFindFriendsEmail/>
      <div className="sff-container">
        <div>
          <br />
          <MaterialTable
          style={{
            background: '#292727',
            color:'white'
          }}
            title={
              <div align="center">
                <h3>Public Profiles</h3>
              </div>
            }
            columns={columns}
            data={data}
            actions={[
              (data) => ({
                icon:'🧡',
                tooltip: "Send Friend Request!",
                onClick: () => {
                  const requestOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      data,
                    }),
                  };
                  console.log(requestOptions.body);
                  console.log(data);

                  fetch(public_url, requestOptions).then((resp) => {
                    if (resp.ok) {
                      console.log("✅Friend Request Was Successful✅");
                    } else {
                      console.log("❌Friend Request Was NOT Successful❌");
                    }
                  });
                },
                //hidden: data.isVisible < 1,
                disabled: data.isVisible < 1,
              }),
            ]}
            localization={{
              header: {
                actions: "\u00A0 Add",
                textAlign: "left",
              },
              toolbar: {
                searchTooltip: "Search for a friend",
                searchPlaceholder: "example@gmail.com",
              },
            }}
            options={{
              headerStyle: {
                backgroundColor: "rgb(230,106,4)",
                color: "#FFF",
                fontSize: 19,
                fontStyle: "roboto",
                height: 5,
              },
              pageSizeOptions: false,
              searchAutoFocus: true,
              rowStyle: (data) => ({
                fontSize: 17,
                color: "white",
                fontStyle: "Times New Roman",
              }),
              searchFieldStyle: {
                color: "white",
                borderRadius: 20,
              },
              actionsColumnIndex: -1,
              showFirstLastPageButtons: false,
            }}
            detailPanel={[
              {
                icon: "📧",
                openIcon: "📨",
                tooltip: "User Info",
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
                          backgroundColor: "rgb(240, 128, 37)",
                        }}
                      >
                        {data.fname} {data.lname}
                      </div>
                    );
                  } else {
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
                },
              },
            ]}
          />
          <br /> <br />
        </div>
      </div>
    </div>
  );
}

export default SocialFindFriendsPage;