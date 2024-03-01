import axios from "axios";

export const Educator = async () => {
  try {
    const response = await axios.get("https://workload.sfedu.ru/educator");
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const Positions = async () => {
  try {
    const response = await axios.get(
      "https://workload.sfedu.ru/educator/get/positions"
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const TypeOfEmployments = async () => {
  try {
    const response = await axios.get(
      "https://workload.sfedu.ru/educator/get/typeOfEmployments"
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const Workload = async () => {
  try {
    const response = await axios.get("https://workload.sfedu.ru/workload");
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

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
