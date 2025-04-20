import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

// Define colors for each category
const COLORS = ["#ff4d4f", "#faad14", "#1890ff"]; // Red, Yellow, Blue

export default function LogPieChart({ filtered_data }) {
    // Safeguard against undefined arrays
    const data = [
        { name: "Critical", value: filtered_data.critical?.length || 0 },
        { name: "Warning", value: filtered_data.warning?.length || 0 },
        { name: "Info", value: filtered_data.info?.length || 0 },
    ];

    return (
        <div className="d-flex justify-content-center border-2 w-[400px] h-[350px] mx-auto">
            <PieChart width={400} height={300}>
                <Pie
                    dataKey="value"
                    isAnimationActive={true}
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ backgroundColor: "#fff", borderColor: "#ccc" }}
                    formatter={(value, name) => [`${value}`, name]}
                    cursor={{ fill: "#f5f5f5" }}
                />
                <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                />
            </PieChart>
        </div>
    );
}