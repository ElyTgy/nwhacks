"use client";

import { useState } from "react";
import { logOut } from "../app/lib/supabase/auth";
import { Muse } from "../app/lib/Muse";


export default function Dashboard() {
    const [status, setStatus] = useState("Not connected");
    const [recordedData, setRecordedData] = useState(null);
    let muse = new Muse();

    const connectMuse = async () => {
        try {
            setStatus("Connecting...");
            await muse.connect();
            setStatus("Connected");
        } catch (error) {
            setStatus("Connection failed");
            console.error("Error connecting to Muse:", error);
        }
    };

    const startRecording = () => {
        muse.startRecording();
        setStatus("Recording started...");
        console.log("Recording started...");
    };

    const stopRecording = async () => {
        const data = muse.stopRecording();
        setStatus("Recording stopped.");
        setRecordedData(data);
        console.log("Recording stopped.", data);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl">HELLO</h1>
            <div className="flex gap-4 mt-4">
                <button 
                    className="bg-blue-500 text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 hover:scale-105 duration-300"
                    onClick={connectMuse}
                >
                    Connect to Muse
                </button>
                <button 
                    className="bg-green-500 text-white px-5 py-2.5 rounded-lg hover:bg-green-600 hover:scale-105 duration-300"
                    onClick={startRecording}
                >
                    Start Recording
                </button>
                <button 
                    className="bg-red-500 text-white px-5 py-2.5 rounded-lg hover:bg-red-600 hover:scale-105 duration-300"
                    onClick={stopRecording}
                >
                    Stop Recording
                </button>
            </div>
            <button 
                className="mt-4 bg-gray-500 text-white px-5 py-2.5 rounded-lg hover:bg-gray-600 hover:scale-105 duration-300"
                onClick={() => logOut()}
            >
                Log Out
            </button>
            <p className="mt-4 text-lg">Status: {status}</p>
            {recordedData && (
                <pre className="mt-4 bg-gray-100 p-4 rounded-lg text-sm max-w-2xl overflow-auto">
                    {JSON.stringify(recordedData, null, 2)}
                </pre>
            )}
        </div>
    );
}
