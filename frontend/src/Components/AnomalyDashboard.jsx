// // src/components/AnomalyDashboard.jsx
// import { useState } from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// const sampleData = [
//   { date: "2024-04-01", anomalies: 3 },
//   { date: "2024-04-02", anomalies: 5 },
//   { date: "2024-04-03", anomalies: 2 },
//   { date: "2024-04-04", anomalies: 6 },
//   { date: "2024-04-05", anomalies: 1 },
// ];

// const logData = [
//   { timestamp: "2024-04-01 12:30", severity: "High", message: "Login attempt failed" },
//   { timestamp: "2024-04-01 12:40", severity: "Medium", message: "Multiple login attempts" },
//   { timestamp: "2024-04-02 10:00", severity: "Low", message: "System health OK" },
// ];

// export default function AnomalyDashboard() {
//   const [filter, setFilter] = useState("All");

//   return (
//     <div className="p-6 font-sans">
//       <h2 className="text-2xl font-bold mb-4">Anomaly Dashboard</h2>

//       {/* Filter */}
//       <div className="mb-4">
//         <label className="mr-2 font-semibold">Filter by Severity:</label>
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="border px-2 py-1"
//         >
//           <option value="All">All</option>
//           <option value="High">High</option>
//           <option value="Medium">Medium</option>
//           <option value="Low">Low</option>
//         </select>
//       </div>

//       {/* Line Chart */}
//       <div className="h-72 mb-6">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={sampleData}>
//             <CartesianGrid stroke="#ccc" />
//             <XAxis dataKey="date" />
//             <YAxis allowDecimals={false} />
//             <Tooltip />
//             <Line type="monotone" dataKey="anomalies" stroke="#ef4444" strokeWidth={3} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Log Table */}
//       <table className="w-full border-collapse border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border px-4 py-2">Timestamp</th>
//             <th className="border px-4 py-2">Severity</th>
//             <th className="border px-4 py-2">Message</th>
//           </tr>
//         </thead>
//         <tbody>
//           {logData
//             .filter((log) => filter === "All" || log.severity === filter)
//             .map((log, i) => (
//               <tr key={i} className="text-sm">
//                 <td className="border px-4 py-2">{log.timestamp}</td>
//                 <td className={`border px-4 py-2 font-bold ${log.severity === "High" ? "text-red-600" : log.severity === "Medium" ? "text-yellow-600" : "text-green-600"}`}>
//                   {log.severity}
//                 </td>
//                 <td className="border px-4 py-2">{log.message}</td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// src/components/LogDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
// You can also import Recharts components if you want to display charts
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function LogDashboard() {
  // States to handle the fetched data, loading status, and errors.
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Use useEffect to fetch data from the backend when this component mounts.
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/detect-anomalies/")
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

  // Display loading and error states.
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4">Log Analytics Dashboard</h2>
      <p className="mb-4">Number of anomalies detected: {data.count}</p>

      <h3 className="text-xl mb-2">Suspicious Entries:</h3>
      <ul className="list-disc ml-6">
        {data.suspicious_entries && data.suspicious_entries.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>

      {/* If you plan to add a chart later, you can include Recharts components here.
          For example, a simple line chart using dummy data could be included.
          Uncomment and adjust the code below if needed. */}
      {/*
      <div className="h-72 mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleChartData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="anomalies" stroke="#ef4444" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      */}
    </div>
  );
}
