"use client";

import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

export default function UserNav() {
  const pathName = usePathname();
  return (
    <div className="md:hidden">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Menu className="w-5 h-10 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 " />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" forceMount>
                <DropdownMenuLabel>
                    <ul className="flex flex-col gap-x-4 w-full">
                        {links.map((link, idx) => (
                            <div key={idx}>
                                {pathName === link.href ? (
                                    <li>
                                        <DropdownMenuItem>
                                        <Link href={link.href} className="text-white font-semibold underline text-sm">
                                            {link.name}
                                        </Link>

                                        </DropdownMenuItem>
                                    </li>
                                    ) : (
                                    <li>
                                        <DropdownMenuItem>
                                        <Link className="text-gray-300 font-normal text-sm" href={link.href}>{link.name}</Link>

                                        </DropdownMenuItem>
                                    </li>
                                )}
                            </div>
                        ))}
                    </ul>
                </DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}
