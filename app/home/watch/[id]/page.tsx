import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/auth";
import prisma from "@/app/utils/db";
import VideoStream from "@/app/components/VideoStream";

async function getData(id: number) {
    try {
        const data = await prisma.movie.findUnique({
            where: {
                id: id,
            },
            select: {
                title: true,
                overview: true,
                imageString: true,
                videoSource: true,
                videoSource360p: true,
                videoSource480p: true,
                videoSource720p: true,
                videoSource1080p: true,
                release: true,
                duration: true,
                id: true,
                age: true,
                youtubeString: true,
            },
        });
        return data;
    } catch (error) {
        console.error("Error fetching movie data:", error);
        return null; // or handle error as needed
    }
}

export default async function Watch({ params }: { params: { id: number } }) {
    const movieId = parseInt(params.id.toString());
    const data = await getData(movieId);

    if (!data) {
        return <div>No Data</div>;
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || '';

    return (
        <VideoStream
            movieId={movieId}
            data={data as any}
            userId={userId}
        />
    );
}
