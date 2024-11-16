import React, { useState } from "react";
// import AccountList from "C:/Users/nqhuy24/work/fe/demo/demohrms/src/Request/Account/List.jsx";
// import RequestList from "C:/Users/nqhuy24/work/fe/demo/demohrms/src/Request/Request/List.jsx";
import "./UserList.css";

const UserList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"account" | "request">("account"); // Default to Account Management

  return (
    <div className="switch-list">
      <div style={{ display: "flex" }}>
        <div
          className="account-title"
          onClick={() => setActiveTab("account")}
          style={{
            cursor: "pointer",
            borderBottom: activeTab === "request" ? "none" : "2px solid white",
            backgroundColor: activeTab === "request" ? "#f0f0f0" : "white",
          }}
        >
          Quản lý tài khoản
        </div>
        <div
          className="request-title"
          onClick={() => setActiveTab("request")}
          style={{
            cursor: "pointer",
            borderBottom: activeTab === "account" ? "none" : "2px solid white",
            backgroundColor: activeTab === "account" ? "#f0f0f0" : "white",
          }}
        >
          Quản lý yêu cầu
        </div>
      </div>
      {/* {activeTab === "account" && <AccountList />}
      {activeTab === "request" && <RequestList />} */}
    </div>
  );
};

export default UserList;

export {};