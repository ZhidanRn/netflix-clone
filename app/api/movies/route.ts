import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';

// API Route untuk fetch movies
export async function GET() {
    const movies = await prisma.movie.findMany({
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
        },
        take: 3,
        orderBy: {
            id: "asc",
        },
    });

    return NextResponse.json(movies);
}
