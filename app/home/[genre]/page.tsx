import { MovieCard } from "@/app/components/MovieCard"
import { authOptions } from "@/app/utils/auth"
import prisma from "@/app/utils/db"
import { getServerSession } from "next-auth"
import Image from "next/image"

async function getData(category: string, userId: string | undefined) {
    const categoryMap = {
        shows: "show",
        movies: "movie",
        recently: "recent",
    }

    const categoryValue = categoryMap[category as keyof typeof categoryMap]

    if (!categoryValue) {
        throw new Error("Category not found")
    }

    const data = await prisma.movie.findMany({
        where: {
            category: categoryValue,
        },
        select: {
            age: true,
            duration: true,
            id: true,
            imageString: true,
            overview: true,
            release: true,
            title: true,
            youtubeString: true,
            WatchLists: {
                where: {
                    userId: userId || "",
                }
            }
        }
    })

    return data;
}

export default async function CategoryPage({params}: {params: {genre: string}}) {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.email

    if (!userId) {
        return <div>Error: user not authenticated</div>
    }

    try {
        const data = await getData(params.genre, userId)

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-5 sm:px-0 mt-10 gap-6">
                {data.map((movie) => (
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
                                    watchListId={movie.WatchLists[0]?.id}
                                    watchList={movie.WatchLists.length > 0 ? true : false}
                                    year={movie.release}
                                    youtubeUrl={movie.youtubeString}
                                    useHomePrefix={false}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        )
    } catch (error) {
        console.error("Error fetching data:", error);
        return <div>Error loading data</div>;
    }
}