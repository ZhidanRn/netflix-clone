import { checkIfInWatchList } from "@/app/action";
import CommentSection from "@/app/components/CommentSection";
import ShareButton from "@/app/components/ShareButton";
import WatchListButton from "@/app/components/WatchListButton";
import { authOptions } from "@/app/utils/auth";
import prisma from "@/app/utils/db";
import { getServerSession } from "next-auth";

async function getData(id: number) {
    const data = await prisma.movie.findUnique({
        where: {
            id: id
        },
        select: {
            title: true,
            overview: true,
            imageString: true,
            videoSource: true,
            release: true,
            duration: true,
            id: true,
            age: true,
            youtubeString: true,
        }
    })
    return data;
}

export default async function Watch({ params }: { params: { id: number } }) {
  const movieId = parseInt(params.id.toString());
  const data = await getData(movieId);
  
  const session = await getServerSession(authOptions);
  const userId = session?.user?.email || '';

  if (!data) {
    return <div>No Data</div>;
  }

  const isInWatchList = await checkIfInWatchList(movieId);

    return (
        <div className="flex flex-col">
            <div className="w-full mx-auto p-4">
                <div className="relative w-full pb-[56.25%] overflow-hidden rounded-lg">
                    <iframe
                        src={data?.youtubeString}
                        title="YouTube video"
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>

            <div className="mx-4">
                <h1 className="text-xl font-bold">{data?.title}</h1>
                <ul className="flex gap-x-2 mt-4">
                    <li>{data?.release} | </li>
                    <li>{data?.age}+ | </li>
                    <li>{data?.duration}h </li>
                </ul>
                <p className="mt-4">{data?.overview}</p>

                <hr className="my-4" />

                <div className="flex gap-x-2">
                    <WatchListButton movieId={movieId} watchListId={data?.id.toString()} watchList={isInWatchList} />
                    <ShareButton title={data?.title} text={data?.overview} />
                </div>
                <CommentSection movieId={movieId} userId={userId} />
            </div>
        </div>
    )
}