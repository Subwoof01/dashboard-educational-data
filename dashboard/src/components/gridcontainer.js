import React from "react";
import ReactGridLayout from "react-grid-layout";
import ChartContainer from "./chartcontainer";

export default function GridContainer({layout, charts}) {
    function createCharts(asd) {
        return asd.map((obj, i) => {
            return (
                <ChartContainer data={obj.data} type={obj.type} />
            );
        });
    }

    return(
        <ReactGridLayout layout={layout} cols={3} rows={3} rowHeight={150} width={1500}>
            {charts.length ? createCharts(charts) : <div />}
        </ReactGridLayout>
    );
}