'use client'

import { useEffect, useState, useCallback, useMemo } from "react";
import dynamic from 'next/dynamic';

// Lazy load MovieButtons
const MovieButtons = dynamic(() => import("./MovieButtons"), { ssr: false });

export default function MovieVideo() {
    const [movies, setMovies] = useState<any>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch movies data
    useEffect(() => {
        async function fetchMovies() {
            const response = await fetch('api/movies');
            const data = await response.json();
            setMovies(data);
        }
        fetchMovies();
    }, []);

    // Update video index periodically
    useEffect(() => {
        if (movies.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [movies]);

    // Memoize current movie
    const currentMovie = useMemo(() => movies[currentIndex], [movies, currentIndex]);

    if (movies.length === 0) {
        return (
            <div className="h-[55vh] lg:h-[60vh] w-full flex justify-center items-center">
                <div className="w-16 h-16 border-t-4 border-red-500 border-solid rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="h-[55vh] lg:h-[60vh] w-full flex justify-start items-center">
            <video 
                autoPlay
                muted
                loop
                src={currentMovie?.videoSource}
                className="w-full absolute top-0 left-0 h-[60vh] object-cover -z-10 brightness-[60%]"
                onError={(e) => console.log('video error: ', e)}
            ></video>

            <div className="absolute w-[90%] lg:w-[40%] mx-auto">
                <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold">{currentMovie?.title}</h1>
                <p className="text-white text-lg my-5 line-clamp-3">{currentMovie?.overview}</p>
                <div className="flex gap-x-3 mt-4">
                    <MovieButtons 
                        age={currentMovie?.age as number} 
                        duration={currentMovie?.duration as number} 
                        id={currentMovie?.id as number} 
                        overview={currentMovie?.overview as string} 
                        releaseDate={currentMovie?.release as number} 
                        title={currentMovie?.title as string} 
                        youtubeUrl={currentMovie?.youtubeString as string}
                        key={currentMovie?.id}
                        useHomePrefix={false}
                    />
                </div>
            </div>
        </div>
    );
}
