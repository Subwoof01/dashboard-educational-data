import React from "react";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer } from "recharts";

export default function LineChartCustom({data}) {
    return (
        <ResponsiveContainer width="100%" height="100%" className="layoutItemContainer">
            <LineChart width={500} height={300}  data={data}  margin={{ top: 5,  right: 30, left: 20, bottom: 5  }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone"  dataKey="value"  stroke="#0088FE" />
            </LineChart>
        </ResponsiveContainer>
    );
}