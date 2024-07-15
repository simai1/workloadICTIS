import React, { useEffect, useState } from "react";
import styles from "./AdminMenu.module.scss";
import { GetAllUserss } from "../../api/services/ApiRequest";
import Popup from "./Popup/Popup";
import DataContext from "../../context";
import ContextMenu from "./ContextMenu/ContextMenu";
import Table from "./Table/Table";

function AdminMenu() {
  const { appData } = React.useContext(DataContext);
  const [tableData, setTableData] = useState([]);
  const [selectedTr, setSelectedTr] = useState("");
  const [contextShow, setContextShow] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [popup, setPopup] = useState(false);

  const updateAllUsers = () => {
    if (appData.myProfile?.role === "GOD") {
      GetAllUserss().then((req) => {
        if (req?.status === 200) {
          // console.log(req.data);
          const data = req.data;
          let fixData = [];
          data.forEach((item) => {
            const fixedItem = {};
            Object.keys(item).map((key) => {
              if (key === "educator") {
                Object.keys(item.educator).forEach((k) => {
                  fixedItem[k] = item.educator[k];
                });
              } else {
                fixedItem[key] = item[key];
              }
            });
            fixData.push(fixedItem);
          });
          console.log("fixData", fixData);
          setTableData(fixData);
        }
      });
    }
  }

  //! при клике на поле в контекстном меню
  const closeClick = () => {
    setPopup(false);
  };

  //   apiAdminUpdata
  useEffect(() => {
    updateAllUsers()
  }, []);

  //! При клике на строку
  const trClick = (row) => {
    if (selectedTr === row.id) {
      setSelectedTr("");
    } else {
      setSelectedTr(row.id);
    }
  };

  const lcmClick = (event) => {
    event.preventDefault();
    setContextShow(!contextShow);
    setPosition({ x: event.clientX, y: event.clientY });
  };

  const editClick = () => {
    if (selectedTr !== "") {
      setPopup(true);
    }
    setContextShow(false);
  };

  return (
    <main className={styles.AdminMenu}>
      {appData.myProfile?.role === "GOD" && (
        <>
          {contextShow && (
            <ContextMenu position={position} editClick={editClick} />
          )}
          {popup && (
            <Popup
              data={tableData.find((el) => el.id === selectedTr)}
              closeClick={closeClick}
              updateAllUsers={updateAllUsers}
            />
          )}

          <Table
            selectedTr={selectedTr}
            tableData={tableData}
            lcmClick={lcmClick}
            trClick={trClick}
          />
        </>
      )}
    </main>
  );
}

export default AdminMenu;
