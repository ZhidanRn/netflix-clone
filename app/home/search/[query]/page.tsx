'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MovieCard } from '@/app/components/MovieCard';

interface Movie {
    id: number;
    title: string;
    imageString: string;
    overview: string;
    release: number;
    duration: number;
    age: number;
    youtubeString: string;
    useHomePrefix: boolean;
    watchList: any;
    watchListId: string;
    movieId: number;
}

export default function SearchPage({ params }: { params: { query: string } }) {
    const query = params.query;
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (query) {
            setIsLoading(true);
            fetch(`/api/search?query=${(query)}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setMovies(data);
                    }
                    setIsLoading(false);
                })
                .catch((err) => {
                    setError("Failed to fetch data");
                    setIsLoading(false);
                });
        }
    }, [query]);

    return (
        <div className="px-5 sm:px-0 mt-10">
            <h1 className="text-3xl mb-4">Search Results for: {query}</h1>
            {isLoading ? (
                <div className="h-[55vh] lg:h-[60vh] w-full flex justify-center items-center">
                    <div className="w-16 h-16 border-t-4 border-red-500 border-solid rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <p>{error}</p>
            ) : movies.length === 0 ? (
                <p>No results found</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {movies.map((movie) => (
                        <div key={movie.id} className="relative h-60">
                            <Image
                                src={movie.imageString}
                                alt={movie.title}
                                width={500}
                                height={400}
                                className="rounded-sm absolute w-full h-full object-cover"
                            />
                            <div className="h-60 relative z-10 w-full transform transition duration-500 hover:scale-125 opacity-0 hover:opacity-100">
                                <div className="bg-gradient-to-b from-transparent via-black/50 to-black z-10 w-full h-full rounded-lg flex items-center justify-center">
                                    <Image
                                        src={movie.imageString}
                                        alt={movie.title}
                                        width={800}
                                        height={800}
                                        className="absolute w-full h-full -z-10 rounded-lg object-cover"
                                    />
                                    <MovieCard
                                        key={movie.id}
                                        age={movie.age}
                                        movieId={movie.id}
                                        time={movie.duration}
                                        overview={movie.overview}
                                        title={movie.title}
                                        watchListId={movie.watchListId}
                                        watchList={movie.watchList}
                                        year={movie.release}
                                        youtubeUrl={movie.youtubeString}
                                        useHomePrefix={false}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
