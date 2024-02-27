import React, { useEffect, useState } from "react";
import axios from "axios";

// export function ApiGetData() {
//   const [educator, setEducator] = useState(null);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("https://workload.sfedu.ru/educator");
//         setEducator(response.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchData();
//   }, []);

//   return educator;
// }

export const ApiGetData = async () => {
  try {
    const response = await axios.get("https://workload.sfedu.ru/educator");
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
