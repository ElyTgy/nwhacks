import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { BluetoothSearching } from 'lucide-react';

interface MuseModalProps {
    connectMuse: () => Promise<void>;
    startRecording: () => void;
    setOpen: (open: boolean) => void;
    open: boolean;
    status: string;
}

export default function MuseModal({ connectMuse, startRecording, setOpen, open, status }: MuseModalProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-sage2 text-white px-6 py-2.5 rounded-lg hover:bg-sage1 hover:scale-105 duration-300">
                    <span className="mt-[2px]"><BluetoothSearching /></span> Connect Muse
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Muse Controller</DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Control your Muse device recording session
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-6">
                    <div className="flex gap-4 justify-center">
                        <button 
                            className="bg-sage2 text-white px-5 py-2.5 rounded-lg hover:bg-sage1 hover:scale-105 duration-300"
                            onClick={connectMuse}
                        >
                            Connect to Muse
                        </button>
                        <button 
                            className="bg-accent3 text-white px-5 py-2.5 rounded-lg hover:bg-accent4 hover:scale-105 duration-300"
                            onClick={() => {
                                startRecording();
                                setOpen(false);
                            }}
                        >
                            Start Recording
                        </button>
                    </div>
                    <p className="text-left text-lg text-gray-600 pl-4">Status: {status}</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}