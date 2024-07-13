import React from "react";
import styles from "./TableSchedule.module.scss";
import UniversalTable from "../UniversalTable/UniversalTable";

function TableSchedule() {
  return (
    <div className={styles.TableSchedule}>
      <UniversalTable searchTerm={""} />
    </div>
  );
}

export default TableSchedule;
