import { useEffect, useState } from "react";

const useFetch = (endpoint, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const {
    asArray = false,
    hasDataKey = "auto", // 'auto' | true | false
  } = options;

 useEffect(() => {
  if (!endpoint) return;

  const token = localStorage.getItem("accessToken"); // hoặc nơi bạn lưu JWT

  setLoading(true);
  fetch(`${baseUrl}/${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
    .then((res) => res.json())
    .then((json) => {
      let result;

      if (hasDataKey === true) {
        result = json.data;
      } else if (hasDataKey === false) {
        result = json;
      } else {
        // auto mode
        result = json?.data !== undefined ? json.data : json;
      }

      if (asArray) {
        setData(Array.isArray(result) ? result : [result]);
      } else {
        setData(result);
      }

      setError(null);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setError(err);
      setData(asArray ? [] : null);
    })
    .finally(() => setLoading(false));
}, [endpoint, baseUrl, asArray, hasDataKey]);


  return { data, loading, error };
};

export default useFetch;
