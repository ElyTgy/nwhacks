"use client";

import { useState, useRef, useEffect } from "react";
import { logOut } from "../app/lib/supabase/auth";
import { Muse } from "../app/lib/Muse";
import TimeSeriesChart from "./TimeSeriesGraph"


export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [sessionData, setSessionData] = useState<null>(null);
    const [status, setStatus] = useState("Not connected");
    const [recordedData, setRecordedData] = useState<{ startTimestamp: number | null; endTimestamp: number; eegData: any[][] } | null>(null);
    const museRef = useRef<Muse | null>(null);

    const connectMuse = async () => {
        try {
            setStatus("Connecting...");
            if (!museRef.current) {
                museRef.current = new Muse();
            }
            await museRef.current.connect();
            setStatus("Connected");
        } catch (error) {
            setStatus("Connection failed");
            console.error("Error connecting to Muse:", error);
        }
    };

    const startRecording = () => {
        if (!museRef.current) {
            setStatus("Please connect to Muse first");
            return;
        }
        museRef.current.startRecording();
        setStatus("Recording started...");
        console.log("Recording started...");
    };

    const stopRecording = async () => {
        if (!museRef.current) {
            setStatus("No active Muse connection");
            return;
        }
        const data = museRef.current.stopRecording();
        setStatus("Recording stopped.");
        setRecordedData(data);
        console.log("Recording stopped.", data);
    };

    const getData = async () => {
        try {
            setLoading(true);
            const res = await fetch("../app/api/fetch_session/route.ts");
            const response = await res.json();
            if (response && response.legth > 0) {
                setSessionData(response[0]);
            }
            else {
                console.log("No data found");
            }
        } catch (error) {
            console.error("Error getting data:", error);
        } finally {
            setLoading(false);
        };
    }

    return (
        <div className="flex flex-col items-center absolute w-full h-dvh bg-gradient-to-b from-gray-100 via-green-50 to-green-50">
            <nav className="flex w-full justify-between items-center px-16 my-8">
                <div className="text-xl font-semibold hover:text-sage2 duration-200 cursor-pointer">Home</div>
                <div className="flex space-x-8">
                    <div className="text-xl font-semibold hover:text-sage2 duration-200 cursor-pointer">Songs</div>
                    <div className="text-xl font-semibold hover:text-sage2 duration-200 cursor-pointer">
                        Dashboard
                    </div>
                </div>
            </nav>

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
