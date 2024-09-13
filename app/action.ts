'use server'

import prisma from "./utils/db"
import { revalidatePath } from 'next/cache'
import { authOptions } from "./utils/auth"
import { getServerSession } from "next-auth"

export async function addTowatchList(formData: FormData) {

    const movieId = formData.get('movieId')
    const pathname = formData.get('pathname') as string
    const session = await getServerSession(authOptions)

    const data = await prisma.watchList.create({
        data: {
            userId: session?.user?.email as string,
            movieId: Number(movieId),
        }
    })

    revalidatePath(pathname)

    return data
}

export async function deleteFromWatchList(formData: FormData) {

    const watchListId = formData.get('watchListId') as string
    const pathname = formData.get('pathname') as string

    const data = await prisma.watchList.delete({
        where: {
            id: watchListId,
        }
    })

    revalidatePath(pathname)

    return data
}

export async function checkIfInWatchList(movieId: number): Promise<boolean> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return false;

    const count = await prisma.watchList.count({
        where: {
            movieId: movieId,
            userId: session.user.email as string,  // atau userId, tergantung cara Anda menyimpan user
        },
    });

    return count > 0;
}