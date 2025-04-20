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
// import axios from "axios";
import useFilterByStatusCode from "../Hooks/useFilterByStatusCode";
// import useCategorizeAnomaly from "../Hooks/useCategorizeAnomaly";
import AnomalyTable from "./AnomalyTable";
import Piechart from "./Piechart";


// You can also import Recharts components if you want to display charts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function LogDashboard() {
  const { data: filtered_data, loading: loading, error: error } = useFilterByStatusCode();
  // const { data: data_categorized, loading: load, error: err } = useCategorizeAnomaly();

  const sampleChartData = [
    { time: '2025-04-18 00:00', count: 3 },
    { time: '2025-04-18 01:00', count: 5 },
    { time: '2025-04-18 02:00', count: 12 },
    { time: '2025-04-18 03:00', count: 7 },
    // ...
  ];

  // Display loading and error states.
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4">Log Analytics Dashboard</h2>

      
      {/* <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={sampleChartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" angle={-45} textAnchor="end" interval={0}>
            <Label value="Time (hourly)" position="bottom" offset={30} />
          </XAxis>
          <YAxis>
            <Label
              value="Anomaly Count"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line type="monotone" dataKey="count" stroke="#ff4d4f" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div> */}

    {/* Line Chart */}
    {/* <div style={{ width: "100%", height: 400 }} className="mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleChartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" angle={-45} textAnchor="end" interval={0}>
              <Label value="Time (hourly)" position="bottom" offset={30} />
            </XAxis>
            <YAxis>
              <Label value="Anomaly Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
            </YAxis>
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="count" stroke="#ff4d4f" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div> */}
     

      {/* <p className="mb-4">Number of anomalies detected: {data.count}</p> */}

      {/* <h3 className="text-xl mb-4">Anomalies categorized:</h3>
      {data_categorized && Object.entries(data_categorized).map(([category, entries]) => (
        // console.log(category, entries)
        <div key={category} className="mb-6">
          <h4 className="text-lg font-semibold capitalize text-amber-500">{category}:</h4>
          <ul className="list-disc ml-6 mt-2">
            {entries && entries.map((entry, index) => (
              <li key={index}>
                <span className="font-medium">IP:</span> {entry.ip},
                <span className="font-medium"> Status:</span> {entry.status},
                <span className="font-medium"> Time:</span> {entry.datetime}
              </li>
            ))}
          </ul>
        </div>
      ))} */}

      <Piechart filtered_data={filtered_data}/>

      <AnomalyTable tableTitle={'Critical Issues'} filtered_data={filtered_data.critical}/>
      <AnomalyTable tableTitle={'Warnings'} filtered_data={filtered_data.warning}/>
      <AnomalyTable tableTitle={'Info'} filtered_data={filtered_data.info}/>


    </div>
  );
}

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