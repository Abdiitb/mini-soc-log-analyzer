import React, { useEffect, useState } from "react";
import axios from "axios";

export default function useFilterByStatusCode() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Use useEffect to fetch data from the backend when this component mounts.
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/filter-logs-by-status")
            .then((response) => {
                console.log("API Response:", response.data);
                setData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
                setError("Error fetching data. Please try again later.");
                setLoading(false);
            });
    }, []);

    return {data, loading, error}
}