import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';


    const movies = await prisma.movie.findMany({
        where: {
            title: {
                contains: query,
                mode: 'insensitive',
            },
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
        },
    });

    return NextResponse.json(movies);
}
