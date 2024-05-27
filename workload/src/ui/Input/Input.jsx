// Input.js
import React, { useState } from "react";
import styles from "./Input.module.scss";

function Input({
  Textlabel,
  placeholder,
  handleInputChange,
  name,
  settextSearchTableData,
  value,
}) {
  const [textInput, settextInput] = useState("");

  const InputText = (e) => {
    settextInput(e.target.value);
    settextSearchTableData && settextSearchTableData(e.target.value);
    handleInputChange && handleInputChange(name, e.target.value);
  };

  return (
    <div className={styles.input}>
      <div>
        {Textlabel && (
          <div className={styles.label}>
            <label>{Textlabel}</label>
          </div>
        )}
        <input
          onChange={(e) => InputText(e)}
          placeholder={placeholder}
          value={value}
        />
      </div>
    </div>
  );
}

export default Input;
