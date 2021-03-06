import React, { useState, useEffect} from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import {
  Grid,
  Divider,
} from "@material-ui/core";

import SocialFindFriendsEmail from "./SocialFindFriendsEmail";

import "../../static/css/social-find-friends.css";

function SocialFindFriendsPage() {
  const [data, setData] = useState([]);
  const public_url = "/api/social-find-friends";
  
  const [preferDarkMode, setPreferDarkMode] = useState(() => {
    const mode = localStorage.getItem("_tableDarkMode");
    return mode === "true" || false;
  });

  const columns = [
    {
      title: "Find a gym partner",
      field: "email",
      sorting: false,
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
      <br />
      <SocialFindFriendsEmail />
        <div className="sff-container">
          <div>
            <br />
            <MaterialTable
              style={{
                backgroundColor: "#433f3f ",
                color: "white",
              }}
              title={
                <div align="center">
                  <b>Public Profiles</b>
                </div>
              }
              columns={columns}
              data={data}
              actions={[
                (data) => ({
                  icon: "🧡",
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
                        alert('Friend Request Sent to\u00A0\u00A0' + data.fname + '\u00A0' +data.lname)
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
                  searchTooltip: "Search for an Email",
                  searchPlaceholder: "example@mail.com",
                },
              }}
              options={{
                headerStyle: {
                  backgroundColor: "rgb(230,106,4)",
                  color: "#FFF",
                  fontSize: 19,
                  fontStyle: "roboto",
                },
                rowStyle: (data) => ({
                  fontSize: 17,
                  color: "white",
                  fontStyle: "Times New Roman",
                }),
                search: false,
                searchFieldStyle: {
                  color: "white",
                  borderRadius: 20,
                },
                pageSizeOptions: false,
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
