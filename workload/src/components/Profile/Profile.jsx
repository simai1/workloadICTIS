import React, { useState } from "react";
import styles from "./Profile.module.scss";
import svgExit from "./../../img/exit.svg";
import DataContext from "../../context";
function Profile(props) {
  const { appData } = React.useContext(DataContext);

  const clickModalWind = () => {
    props.setOpenModalWind(!props.onenModalWind);
  };
  return (
    <div ref={props.refProfile} className={styles.Profile}>
      <div className={styles.container} onClick={clickModalWind}>
        {appData.myProfile.name}
      </div>
      {props.onenModalWind && (
        <div className={styles.modal_window}>
          <div className={styles.triangle}></div>
          <span className={styles.title}>{appData.myProfile.position}</span>
          <span className={styles.inner}>{appData.myProfile.mail}</span>
          <div className={styles.exid}>
            <span>Выйти</span>
            <img src={svgExit} alt="->"></img>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
