import { DataUsageSharp } from "@mui/icons-material";
import React from "react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
const colours = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink', '#619822', '#019bc3', '#dca1df', '#fb5198', '#e20818', '#fce5cd', '#fcbf49', '#f77f00', '#d62828', '#003049'];


const toPercent = (decimal) => `${(decimal * 100).toFixed(0)}%`;

const getPercent = (value, total) => {
  const ratio = total > 0 ? value / total : 0;

  return toPercent(ratio, 2);
};

const renderTooltipContent = (o) => {
  const { payload, label } = o;
  const total = payload.reduce((result, entry) => result + entry.value, 0);

  return (
    <div className="customized-tooltip-content">
      <p className="total">{`${label} (Total: ${total})`}</p>
      <ul className="list">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}(${getPercent(entry.value, total)})`}
          </li>
        ))}
      </ul>
    </div>
  );
};


export default function AreaChartCustom({data}) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
            width={500}
            height={400}
            data={data}
            stackOffset="expand"
            margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={toPercent} />
                <Area type="monotone" dataKey="male" stackId="1" stroke="#0088FE" fill="#0088FE" />
                <Area type="monotone" dataKey="female" stackId="1" stroke="#00C49F" fill="#00C49F" />
                <Area type="monotone" dataKey="unknown" stackId="1" stroke="#FFBB28" fill="#FFBB28" />
                <Area type="monotone" dataKey="other" stackId="1" stroke="#FF8042" fill="#FF8042" />
                <Tooltip content={renderTooltipContent} />
            </AreaChart>
        </ResponsiveContainer>
    );
}