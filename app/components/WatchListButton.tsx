'use client'

import { FC } from 'react'
import { Heart } from 'lucide-react'
import { addTowatchList, deleteFromWatchList } from '../action'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'

interface WatchListButtonProps {
    movieId: number
    watchList: boolean
    watchListId: string
}

const WatchListButton: FC<WatchListButtonProps> = ({ movieId, watchList, watchListId }) => {

    const pathName = usePathname()

  return (
    <>
        {watchList ? (
            <form action={deleteFromWatchList}>
                <input type="hidden" name="watchListId" value={watchListId} />
                <input type="hidden" name="pathname" value={pathName} />
                <Button variant={"outline"} size={"icon"}>
                    <Heart className="w-4 h-4 text-red-500" />
                </Button>
            </form>
        ) : (
            <form action={addTowatchList}>
                <input type="hidden" name="movieId" value={movieId} />
                <input type="hidden" name="pathname" value={pathName} />
                <Button variant={"outline"} size={"icon"}>
                    <Heart className="w-4 h-4" />
                </Button>
            </form>
        )}
    </>
  )
}

export default WatchListButton