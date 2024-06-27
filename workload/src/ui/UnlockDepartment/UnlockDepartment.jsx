import React from "react";

import styles from "./UnlockDepartment.module.scss";
import DataContext from "../../context";
const UnlockDepartment = (props) => {
  const { appData } = React.useContext(DataContext);

  return (
    <div className={styles.UnlockDepartment}>
      
    </div>
  );
};

export default UnlockDepartment;
