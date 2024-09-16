'use client'

import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/netflix_logo.svg"
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import UserNav from "@/app/components/UserNav";
import MenuNav from "@/app/components/MenuNav";
import { useState } from "react";
import dynamic from "next/dynamic";

interface linkProps {
    name: string;
    href: string;
}

const links: linkProps[] = [
    {name: 'Home', href: '/home'},
    {name: 'TV Shows', href: '/home/shows'},
    {name: 'Movies', href: '/home/movies'},
    {name: 'Recently Added', href: '/home/recently'},
    {name: 'My List', href: '/home/user/list'},
]

const SearchInput = dynamic(() => import ('@/app/components/SearchInput'), { ssr: false })

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const pathName = usePathname()

    const handleOpen = () => {
        setOpen(!open)
    }
    return (
        <>
        <div className="w-full max-w-7xl mx-auto items-center justify-between px-5 sm:px-6 py-5 lg:px-8 flex">
            <div className="flex items-center">
                <Link href="/home" className="w-32">
                    <Image src={Logo} alt="Netflix Logo" priority />
                </Link>
                <ul className="md:flex gap-x-4 ml-14 hidden">
                    {links.map((link, idx) => (
                        <div key={idx}>
                            {pathName === link.href ? (
                                <li>
                                    <Link href={link.href} className="text-white font-semibold underline text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ) : (
                                <li>
                                    <Link className="text-gray-300 font-normal text-sm" href={link.href}>{link.name}</Link>
                                </li>
                            )}
                        </div>
                    ))}
                </ul>
            </div>
            
            <div className="flex items-center gap-x-5 md:gap-x-8">
                <Search className="h-5 w-5 text-gray-300 cursor-pointer" onClick={handleOpen} />
                <Bell className="h-5 w-5 text-gray-300 cursor-pointer" />
                <UserNav />
                <MenuNav />
            </div>
        </div>
        {open && (
            <div className="fixed inset-0 z-20">
                <SearchInput state={open} changeState={handleOpen}  />
            </div>
        )}
        </>
    )
}