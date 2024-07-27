import React, { useEffect, useState } from "react";
import styles from "./AdminMenu.module.scss";
import { GetAllUserss } from "../../api/services/ApiRequest";
import Popup from "./Popup/Popup";
import DataContext from "../../context";
import ContextMenu from "./ContextMenu/ContextMenu";
import TableAdmin from "./Table/TableAdmin";
import Profile from "../../components/Profile/Profile";
import { useNavigate } from "react-router-dom";

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
          const data = req.data;
          let fixData = [];
          data.forEach((item) => {
            const fixedItem = {};
            if (item) {
              Object.keys(item).forEach((key) => {
                if (key === "educator" && item.educator) {
                  Object.keys(item.educator).forEach((k) => {
                    if (k === "id") {
                      fixedItem["educatorId"] = item.educator[k];
                    } else {
                      fixedItem[k] = item.educator[k];
                    }
                  });
                } else {
                  fixedItem[key] = item[key];
                }
              });
            }
            fixData.push(fixedItem);
          });
          console.log("fixData", fixData);
          setTableData(fixData);
        }
      });
    }
  };
  

  //! при клике на поле в контекстном меню
  const closeClick = () => {
    setPopup(false);
  };

  //   apiAdminUpdata
  useEffect(() => {
    updateAllUsers();
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

const [onenModalWind, setOpenModalWind] = useState(false);
const refProfile = React.useRef(null); // ссылка на модальное окно профиля
const navigate = useNavigate();
  return (
    <main className={styles.AdminMenu}>
      {appData.myProfile?.role === "GOD" && (
        <>
        <div className={styles.buttonBlock}>
          <button onClick={() => navigate("/HomePage")}>Назад</button>
          <Profile
            setOpenModalWind={setOpenModalWind}
            onenModalWind={onenModalWind}
            refProfile={refProfile}
          />
        </div>
        <div className={styles.block2}>
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

            <TableAdmin
              selectedTr={selectedTr}
              tableData={tableData}
              lcmClick={lcmClick}
              trClick={trClick}
            />
           </div>
        </>
      )}
    </main>
  );
}

export default AdminMenu;
