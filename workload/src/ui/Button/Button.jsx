import React from "react";
import styles from "./Button.module.scss";

function Button(props) {
  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    }
    if(props.handleClicks){
      props.handleClicks();
    }

  };

  return (
    <button
      className={styles.Button}
      onClick={handleClick}
      style={{ backgroundColor: props.Bg, color: props.textColot }}
    >
      {props.text}
    </button>
  );
}

export default Button;
