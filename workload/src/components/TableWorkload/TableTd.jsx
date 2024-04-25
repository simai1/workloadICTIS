import React from "react";

function TableTd(props) {
  return (
    <td key={props.itemKey.key}>
      {props.itemKey.key !== "id"
        ? props.item[props.itemKey.key]
        : props.index + 1}
    </td>
  );
}

export default TableTd;
