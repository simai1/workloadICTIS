import React from "react";
import styles from "./TextArea.module.scss";

function TextArea(props) {
  return (
    <div className={styles.TextArea}>
      <textarea
        defaultValue={props.defaultValue}
        value={props.value}
        onChange={props.onChange}
        type="text"
        maxLength="990"
        // style={Number(textareaTd) > 2000 ? { border: "3px solid red" } : null}
      ></textarea>
    </div>
  );
}

export default TextArea;
