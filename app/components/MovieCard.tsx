'use client'

import { Button } from "@/components/ui/button";
import { Heart, PlayCircle } from "lucide-react";
import PlayVideoModal from "./PlayVideoModal";
import { useState } from "react";
import { addTowatchList, deleteFromWatchList } from "../action";
import { usePathname } from "next/navigation";
import WatchListButton from "./WatchListButton";

interface iAppProps {
    title: string,
    overview: string,
    movieId: number,
    watchList: boolean,
    watchListId: string,
    youtubeUrl: string,
    year: number,
    age: number,
    time: number,
    useHomePrefix: boolean;
}

export function MovieCard({ title, overview, movieId, watchList, watchListId, youtubeUrl, year, age, time, useHomePrefix }: iAppProps) {
    const [open, setOpen] = useState(false)
    
    return (
        <>
            <button onClick={() => setOpen(true)} className="-mt-14">
                <PlayCircle className="h-20 w-20" />
            </button>

            <div className="right-5 top-5 absolute z-10">
                <WatchListButton movieId={movieId} watchListId={watchListId} watchList={watchList} />
            </div>

            <div className="p-5 absolute bottom-0 left-0">
                <h1 className="font-bold text-lg line-clamp-1">{title}</h1>
                <div className="flex gap-x-2 items-center">
                    <p className="font-normal text-sm">{year}</p>
                    <p className="font-normal border py-0.5 px-1 border-gray-200 rounded text-sm">{age}+</p>
                    <p className="font-normal text-sm">{time}h</p>
                </div>
                <p className="line-clamp-1 text-sm text-gray-200 font-light">{overview}</p>
            </div>

            <PlayVideoModal 
                youtubeUrl={youtubeUrl} 
                key={movieId} 
                id={movieId}
                title={title} 
                overview={overview} 
                state={open} 
                changeState={setOpen} 
                release={year}
                age={age}
                duration={time} 
                useHomePrefix={useHomePrefix}
            />
        </>
    )
}