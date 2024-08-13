'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AvatarImage } from "@radix-ui/react-avatar";
import { signOut } from "next-auth/react";

export default function UserNav() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant={"ghost"} className="relative h-10 w-10 rounded-sm">
                    <Avatar className="h-10 w-10 rounded-sm">
                        <AvatarImage src="https://gdmphhcksqxbatreyfel.supabase.co/storage/v1/object/public/user%20image/avatar.png?t=2024-08-12T05%3A53%3A19.057Z"/>
                        <AvatarFallback className="rounded-sm">Zhidan</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Zhidan</p>
                    <p className="text-xs leading-none text-muted-foreground">zhidanir@gmail.com</p>
                </div>
                </DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}