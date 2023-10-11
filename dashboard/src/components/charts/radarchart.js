import React from "react";
import { ResponsiveContainer, RadarChart, Tooltip, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export default function RadarChartCustom({data}) {
    return (
        <ResponsiveContainer width="100%" height="100%" className="layoutItemContainer">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <Tooltip />
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Radar name="Total" dataKey="value" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
    );
}