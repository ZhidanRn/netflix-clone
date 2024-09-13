import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlayCircle } from "lucide-react";
import Link from "next/link";

interface iAppProps {
    id: number;
    title: string;
    overview: string;
    youtubeUrl: string;
    state: boolean;
    changeState: any;
    release: number;
    age: number;
    duration: number;
    useHomePrefix: boolean;
}

export default function PlayVideoModal({ id, title, overview, youtubeUrl, state, changeState, release, age, duration, useHomePrefix = false }: iAppProps) {

    const url = useHomePrefix ? `/watch/${id}` : `/home/watch/${id}`;
    return (
        <Dialog open={state} onOpenChange={() => changeState(!state)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex justify-between items-center mr-5">
                        <DialogTitle>{title}</DialogTitle>
                        <Link href={url} className="text-md flex items-center bg-white text-black py-1 px-2 rounded-md hover:bg-slate-200">
                            <PlayCircle className="mr-2 h-6 w-6" />
                            <p>Play</p>
                        </Link>
                    </div>
                    <DialogDescription className="line-clamp-3">{overview}</DialogDescription>
                    <div className="flex gap-x-2 items-center">
                        <p>{release}</p>
                        <p className="border py-0.5 border-gray-200 rounded">{age}+</p>
                        <p>{duration}h</p>
                    </div>
                </DialogHeader>
                <p>Trailer</p>
                <iframe src={youtubeUrl} className="w-full" />
            </DialogContent>
        </Dialog>
    )
}