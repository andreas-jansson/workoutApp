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


import "../../static/css/social-find-friends.css";

function SocialFindFriendsPage() {
  const [data, setData] = useState([]);
  const [email, setEmail] = useState('');
  const handleSubmit = () => console.log(email);

  const awooga = "/api/social-find-friends";
  const email_url = "/api/social-find-email-friends";
  const public_url = "/api/social-find-visible-friends";

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
      <div className="sff-container">
        <div>
          <br />
          <MaterialTable
            title={
              <div align="center">
                <h3>Public Profiles</h3>
              </div>
            }
            columns={columns}
            data={data}
            actions={[
              (data) => ({
                icon: "favorite",
                openIcon: "contact_page",
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

                  fetch(awooga, requestOptions).then((resp) => {
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
                searchTooltip: "Search for a friend through their mail",
                searchPlaceholder: "example@gmail.com",
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
              pageSizeOptions: false,
              searchAutoFocus: true,
              rowStyle: (data) => ({
                fontSize: 17,
                color: "black",
                fontWeight: "bolder",
                fontStyle: "Times New Roman",
              }),
              searchFieldStyle: {
                fontWeight: "bolder",
                fontStyle: "Times New Roman",
                backgroundColor: "#FFD5AA",
                color: "#290916",
                borderRadius: 20,
              },
              actionsColumnIndex: -1,
              showFirstLastPageButtons: false,
            }}
            detailPanel={[
              {
                icon: "email",
                openIcon: "drafts",
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
                          backgroundColor: "orange",
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
          <div className="sff-request-title" align="center">
            Send an email friend request to people you know.{" "}
          </div>
          <br />
          <form>
            <div align="center">
              <label>
                <input
                  type="email"
                  onChange={(event, newValue) => setEmail(newValue)}
                  //onChange={onTextChange}
                  value={email}
                  name="email"
                  placeholder="Email Address"
                ></input>
              </label>
              <button
              type= 'submit'
              className="sff-request-button"
                onClick={(e) => {
                  e.preventDefault()
                  console.log(e.target.value)
                  console.log(email)
                  
                  const requestOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      email,
                    }),
                  };

                  console.log(requestOptions.body);
                  console.log(data);

                  fetch(email_url, requestOptions).then((resp) => {
                    if (resp.ok) {
                      console.log("✅Friend Request Was Successful✅");
                    } else {
                      console.log("❌Friend Request Was NOT Successful❌");
                    }
                  });
                }}
              >
                Send Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SocialFindFriendsPage;