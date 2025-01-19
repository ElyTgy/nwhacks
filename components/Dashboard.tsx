"use client";

import { useState, useRef, useEffect } from "react";
import { logOut } from "../app/lib/supabase/auth";
import { Muse } from "../app/lib/Muse";
import TimeSeriesChart from "./TimeSeriesGraph";
import MuseModal from "./MuseModal";
import Link from "next/link";
import Image from 'next/image';
import { useToast } from "./hooks/use-toast"
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";


export default function Dashboard(props: {token: any}) {
    interface SessionData {
        id: any;
        session_ts: any;
        focus_ts: any;
        bandpassed: any;
        spectrogram: any;
        bandpowers: any;
        concentration_score: any;
        Songs: Songs[];
    }

    interface Songs {
        id: any;
        image: any;
        song_name: any;
        spotify_url: any;
        artist_name: any;
        song_ts: any;
        focused: any;
    }
    
    const [loading, setLoading] = useState(false);    
    const [sessionData, setSessionData] = useState<SessionData>({id: null, session_ts: null, focus_ts: null, bandpassed: null, spectrogram: null, bandpowers: null, concentration_score: null, Songs: []});
    const [status, setStatus] = useState("Not connected");
    const [isRecording, setIsRecording] = useState(false);
    const [recordedData, setRecordedData] = useState<{ startTimestamp: number | null; endTimestamp: number; eegData: any[][] } | null>(null);
    const [sessionId, setSessionId] = useState<null>(null);
    const [ts, setTs] = useState<null>(null);
    const museRef = useRef<Muse | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { toast } = useToast();

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
        setIsRecording(true);
        console.log("Recording started...");
        toast({
            title: "Recording Started!",
            description: "Your session is now recording data.",
        });
    };

    const stopRecording = async () => {
        if (!museRef.current) {
            setStatus("No active Muse connection");
            return;
        }
        const data = museRef.current.stopRecording();
        setStatus("Recording stopped.");
        setRecordedData(data);
        setIsRecording(false);
        console.log("Recording stopped.", data);
        toast({
            title: "Recording Stopped!",
            description: "Your session is complete.",
        });
        return data;
    };

    const getSessionData = async (id: any) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/fetch_session?id=${id}`);
            const response = await res.json();
            if (response && response.length > 0) {
                console.log(response);
                setSessionData(response[0]);
            }
            else {
                console.log("No data found");
            }
        } catch (error) {
            console.error("Error getting data:", error);
        } finally {
            console.log("sessionData:", sessionData);
            setLoading(false);
        };
    }

    //called after stop recording
    const handleCreateSession = async (values: any) => {
        try {
          setLoading(true);
          const res = await fetch(`/api/create_session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values), // recordedData 
          });
          
          
            
            const response = await res.json();
            console.log('Session created:', response);
            setSessionId(response.id);
            
        } catch (e) {
            console.error('Error creating session:', e);
            toast({
                title: "Error",
                description: "Failed to save session data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    const handleStopRecording = async () => {
        const data = await stopRecording();
        const updatedData = {
            ...data,
            provider_token: props.token,
        };
        handleCreateSession(updatedData);
    }

    useEffect(() => {
        getSessionData(sessionId);
    }, [sessionId]);

    return (
        <div className="flex flex-col items-center absolute w-full h-dvh bg-gradient-to-b from-gray-100 via-green-50 to-green-50">
            <nav className="flex w-full justify-between items-center px-16 my-8">
                <Link href="/" className="text-xl font-semibold hover:text-sage2 duration-200">
                    Home
                </Link>
                <div className="flex space-x-8">
                    <Link href="/songs" className="text-xl font-semibold hover:text-sage2 duration-200">
                        Songs
                    </Link>
                    <button 
                        onClick={() => logOut()}
                        className="text-xl font-semibold hover:text-sage2 duration-200"
                    >
                        Logout
                    </button>
                </div>
            </nav>
            {!sessionData.bandpassed && !loading ? (
                <div className="flex flex-col items-center">
                    <h1 className="text-6xl font-semibold text-center my-8">
                        Let's get started.
                    </h1>
                    <p className="text-xl text-gray-600 mb-2 max-w-2xl text-center">
                        Connect your Muse device to start recording your brain activity.
                    </p>
                    <div className="flex flex-row mt-4 space-x-8">
                        <MuseModal 
                            connectMuse={connectMuse}
                            startRecording={startRecording}
                            status={status}
                            open={dialogOpen}
                            setOpen={setDialogOpen}
                        />
                        {isRecording && (
                            <button 
                                className="bg-red-500 text-white px-5 py-2.5 rounded-lg hover:bg-red-600 hover:scale-105 duration-300"
                                onClick={handleStopRecording}
                            >
                                Stop Recording
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <h1 className="text-5xl font-semibold text-center my-8">
                    Let's review your session.
                </h1>
            )}
            {loading ? (
                <div className="flex flex-col space-y-3 mt-8">
                    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="h-[10px] w-[250px]" />
                        <Skeleton className="h-[10px] w-[200px]" />
                    </div>
                </div>
            ): (
                <></>
            )}
            {sessionData.bandpassed && !loading ? (
            <div className="flex flex-col h-full justify-center items-center py-16">
                <h1 className="text-2xl font-semibold text-center my-8">
                    This is your brain activity based on the music you listened to.
                </h1>
                <div className="pr-16">
                    <TimeSeriesChart data={sessionData.bandpassed} ts={ts} fs={256}/> 
                </div>
                <Alert variant="default" className="mt-8">
                    <div className="relative w-16 h-16">
                        <Image
                            src={sessionData.Songs[0].image}
                            alt="Album Art"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <AlertTitle>
                        {sessionData.Songs[0].song_name}
                    </AlertTitle>
                    <AlertDescription>
                        {sessionData.Songs[0].artist_name.join(", ")}
                    </AlertDescription>
                </Alert>
            </div>
            ) : (
                <></>
            )}
        </div>
    );
}
