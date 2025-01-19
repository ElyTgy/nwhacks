import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// The `LineChart` component
export default function TimeSeriesChart(props: { data: any, ts: any, fs: any, yax_label: any }) {
    // Preprocess the data
    function preprocessData(data: any, ts: any, fs: any) {
        const numChannels = data.length;
        const numSamples = data[0].length;
      
        // Create an array of objects for each sample
        const result = Array.from({ length: numSamples }, (_, sampleIdx) => {
          const entry: { [key: string]: any } = { timestep: ts + sampleIdx / fs }; // Adjust timestep to match sampling rate
          for (let channelIdx = 0; channelIdx < numChannels; channelIdx++) {
            entry[`channel${channelIdx + 1}`] = data[channelIdx][sampleIdx];
          }
          return entry;
        });
      
        return result;
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
          value: "Voltage", 
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