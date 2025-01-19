import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea } from "recharts";

// The `LineChart` component
export default function TimeSeriesChart(props: { data: any, ts: any, fs: any, yax_label: any, focus_bars: any, session_ts: any }) {
    // Preprocess the data
    function preprocessData(data: any, ts: any, fs: any) {
        // Check if the data is 1D or 2D
        const is1D = !Array.isArray(data[0]);

        if (is1D) {
            // Process 1D data
            const numSamples = data.length;
            return Array.from({ length: numSamples }, (_, sampleIdx) => {
                return { timestep: ts + sampleIdx / fs, channel1: data[sampleIdx] };
            });
        } else {
            // Process 2D data
            const numChannels = data.length;
            const numSamples = data[0].length;
            return Array.from({ length: numSamples }, (_, sampleIdx) => {
                const entry: { [key: string]: any } = { timestep: ts + sampleIdx / fs };
                for (let channelIdx = 0; channelIdx < numChannels; channelIdx++) {
                    entry[`channel${channelIdx + 1}`] = data[channelIdx][sampleIdx];
                }
                return entry;
            });
        }
    }

    const processedData = preprocessData(props.data, props.ts, props.fs);

    return (
        <LineChart
            width={700}
            height={350}
            data={processedData}
            margin={{ top: 0, right: 0, left: 20, bottom: 30 }}
        >
            <XAxis 
                dataKey="timestep" 
                label={{ 
                    value: "Time (s)", 
                    position: "insideBottom", 
                    offset: -20,
                    fill: "#72B68A"  // sage1
                }}
                tick={{ fill: "black" }}
            />
            <YAxis
                label={{ 
                    value: props.yax_label, 
                    angle: -90, 
                    position: "insideLeft",
                    fill: "#72B68A",  // sage1
                    dy: 30,  // Center vertically
                    offset: -10
                }}
                tick={{ fill: "black" }}
            />
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: "#fff",
                    borderColor: "black"  // sage2
                }}
                labelStyle={{ color: "black" }}  // sage1
            />

            {/* Add focus bars */}
            {props.focus_bars.map(([start, end]: [number, number], index: number) => (
                <ReferenceArea
                    key={index}
                    x1={(start - props.session_ts[0]) / 1000}
                    x2={(end - props.session_ts[0]) / 1000}
                    strokeOpacity={0.3}
                    fill="#72B68A"
                />
            ))}

            {Object.keys(processedData[0])
                .filter(key => key !== "timestep")
                .map((channel) => (
                    <Line
                        key={channel}
                        type="monotone"
                        dataKey={channel}
                        stroke="#72B68A"  // sage2
                        dot={false}
                        strokeWidth={2}
                    />
                ))}
        </LineChart>
    );
}