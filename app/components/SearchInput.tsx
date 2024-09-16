'use client';

import { Search } from 'lucide-react';
import { FC, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';

interface SearchInputProps {
    state: boolean;
    changeState: (open: boolean) => void;
}

const SearchInput: FC<SearchInputProps> = ({ state, changeState }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (query) {
            router.push(`/home/search/${(query)}`);
            changeState(false);
        }
    };

    return (
        <Dialog open={state} onOpenChange={() => changeState(!state)}>
            <div className={`${isFocused ? "backdrop-blur-sm bg-black/50" : ""} fixed inset-0`}>
                <DialogContent className="relative">
                    <DialogTitle>
                    <div className="flex flex-col fixed left-0 right-0 top-16 border items-center justify-center w-fit mx-auto">
                        <form 
                            onSubmit={handleSearch} 
                            className="relative flex gap-x-2 w-80"
                        >
                            <input
                                type="text"
                                placeholder="Search anything, e.g.: Joker"
                                className="w-full bg-transparent border p-1 pr-10 outline-none"
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <Search className="w-5 h-5 text-gray-300 cursor-pointer" />
                            </button>
                        </form>
                    </div>
                    </DialogTitle>
                </DialogContent>
            </div>
        </Dialog>
    );
};

export default SearchInput;
