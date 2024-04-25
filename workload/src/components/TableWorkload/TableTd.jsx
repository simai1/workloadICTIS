import React from "react";

function TableTd(props) {
  console.log(props.itemKey);
  console.log(props.item);
  return <td key={props.itemKey.key}>{props.item[props.itemKey.key]}</td>;
}

export default TableTd;
