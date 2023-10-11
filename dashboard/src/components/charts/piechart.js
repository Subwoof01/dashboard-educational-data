import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Tooltip,
  Legend,
  Pie,
  Cell,
} from "recharts";
import { Colours } from "../colours";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function PieChartCustom(data) {
  let od = data.otherData;

  const getData = (label, payload) => {
    if (label === "Other" && od.length > 0) {
      return (
        od.map((d) => 
          <p className="label">{`${d["name"]}: ${d["value"]}`}</p>
      ));
    }
  
    return (
      <p className="label">{`${label}: ${payload[0].value}`}</p>
    );
  }
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                {getData(payload[0]["name"], payload)}
            </div>
        );
    }

    return null;
  };  

  return (
    <ResponsiveContainer
      width="100%"
      height="80%"
      className="layoutItemContainer"
    >
      <PieChart>
        <Tooltip content={<CustomTooltip/>}/>
        <Legend />
        <Pie
          data={data.data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius="80%"
          fill="#8884d8"
          dataKey="value"
        >
          {data.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={Colours[index % Colours.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
