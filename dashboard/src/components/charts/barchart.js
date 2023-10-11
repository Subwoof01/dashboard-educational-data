import React from "react";
import { ResponsiveContainer, BarChart, Cell, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from "recharts";
// import { CustomTooltip } from "../chartcontainer";
import { Colours } from "../colours";

export default function BarChartCustom(data) {
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
      let i = 0;
      if (active && payload && payload.length) {
          return (
              <div id={i++} className="custom-tooltip">
                  {getData(label, payload)}
              </div>
          );
      }

      return null;
    };  

    return (
        <ResponsiveContainer width="100%" height="100%" className="layoutItemContainer">
          <BarChart
            width={500}
            height={300}
            data={data.data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 70,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* <Legend /> */}
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip/>}/>
            <Bar dataKey="value" fill="#777777">    
              {data.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={Colours[index % Colours.length]} />
              ))}
            </Bar> 
          </BarChart>
        </ResponsiveContainer>
    );
}