import React, { useEffect, useState } from "react";
import styles from "./AdminMenu.module.scss";
import { GetAllUserss } from "../../api/services/ApiRequest";
import { tableHeader } from "./AdminData";
import Popup from "./Popup/Popup";

function AdminMenu() {
  const [tableData, setTableData] = useState([]);
  const [selectedTr, setSelectedTr] = useState("");
  const [contextShow, setContextShow] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [popup, setPopup] = useState(false);
  const closeClick = () => {
    setPopup(false);
  };

  //   apiAdminUpdata

  useEffect(() => {
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
    console.log(contextShow);
  };

  const editClick = () => {
    if (selectedTr !== "") {
      setPopup(true);
    }
    setContextShow(false);
  };

  return (
    <main className={styles.AdminMenu}>
      {contextShow && (
        <div
          className={styles.context}
          style={{
            top: position?.y,
            left: position?.x,
          }}
        >
          <p onClick={editClick}>Редактировать</p>
        </div>
      )}
      {popup && (
        <Popup
          data={tableData.find((el) => el.id === selectedTr)}
          closeClick={closeClick}
        />
      )}

      <div className={styles.scrollTable}>
        <table>
          <thead>
            <tr>
              {tableHeader.map((item, index) => (
                <th key={item.key + index}>{item.name}</th>
              ))}
            </tr>
          </thead>
          <tbody onContextMenu={(event) => lcmClick(event)}>
            {tableData.map((item) => (
              <tr
                key={item.id}
                onClick={() => trClick(item)}
                className={selectedTr === item.id ? styles.selectedTr : null}
              >
                {tableHeader.map((keys, index) => (
                  <td key={keys.key + index}>
                    {item[keys.key].length === 0 ? "__" : item[keys.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default AdminMenu;
