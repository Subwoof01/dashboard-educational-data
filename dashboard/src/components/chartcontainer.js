import React from "react";
import BarChartCustom from "./charts/barchart";
import LineChartCustom from "./charts/linechart";
import AreaChartCustom from "./charts/areachart";
import RadarChartCustom from "./charts/radarchart";
import PieChartCustom from "./charts/piechart";

export default function ChartContainer({id, data, type, data_key}) {
    let newData = [];
    let other = { name: "Other", value: 0 };
    let otherData = [];

    let total = 0;

    data.forEach(d => {
        total += d["value"];
    });

    data.forEach(d => {
        let percent = d["value"] / total;
        if (percent > .05) { 
            newData.push(d);
        } else { 
            other["value"] += d["value"];
            otherData.push(d);
        }
    });

    if (other["value"] != 0) { newData.push(other); }

    return(
        <div id={id} style={{width: "100%", height: "100%"}}>
            <h3 align="center">{data_key}</h3>
            {(type === "bar") ? <BarChartCustom data={newData} otherData={otherData}/> : 
            (type === "line") ? <LineChartCustom data={newData} /> : 
            (type === "pie") ? <PieChartCustom data={newData} otherData={otherData}/> : 
            (type === "area") ? <AreaChartCustom data={newData} /> : 
            <RadarChartCustom data={newData} />}
        </div>
    );
}