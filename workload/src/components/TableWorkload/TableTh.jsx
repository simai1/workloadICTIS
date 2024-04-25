import React from "react";

function TableTh(props) {
  return <th key={props.item.key}>{props.item.label}</th>;
}

export default TableTh;
