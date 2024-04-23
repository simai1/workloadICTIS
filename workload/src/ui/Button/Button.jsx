import React from "react";
import styles from "./Button.module.scss";

function Button(props) {
  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <button
      className={styles.Button}
      onClick={handleClick}
      style={{ backgroundColor: props.Bg, color: props.textColot, border: props.border}}
    >
      {props.text}
    </button>
  );
}

export default Button;
