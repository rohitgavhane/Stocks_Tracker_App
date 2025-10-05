"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import { Nav_Items } from "@/lib/constants"

export const UserDropdown = () => {
    const router = useRouter();

    const handleSignOut = () => {
        router.push("/sign-in")
    }

    const user = { name: "john", email: "john@gmail.com" }

    // FIX 1: Changed focus:bg-transparent to focus:bg-gray-800
    // This class is applied to all items for a consistent dark grey hover effect.
    const itemClasses = "focus:bg-gray-800 focus:text-gray-100 cursor-pointer transition-colors";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {/* Corrected typo from text-gray-4 to text-gray-400 */}
                <Button variant="ghost" className="relative flex items-center gap-3 p-0 h-auto text-gray-400 hover:text-yellow-500 focus-visible:ring-0 focus-visible:ring-offset-0">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://avatars.githubusercontent.com/u/153423955?s=280&v=4" />
                        <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                            {user.name[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                        <span className='text-base font-medium text-gray-400 capitalize'>
                            {user.name}
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-gray-400" align="end">
                <DropdownMenuLabel>
                    <div className="flex relative items-center gap-3 py-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="https://avatars.githubusercontent.com/u/153423955?s=280&v=4" />
                            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                                {user.name[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className='text-base font-medium text-gray-400 capitalize'>
                                {user.name}
                            </span>
                            <span className="text-sm text-gray-500">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-600" />

                {/* Mobile navigation items now use the new itemClasses */}
                <div className="sm:hidden">
                    {Nav_Items.map((item) => (
                        <DropdownMenuItem key={item.href} asChild className={itemClasses}>
                            <Link href={item.href}>{item.label}</Link>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="bg-gray-600"/>
                </div>
                
                {/* FIX 2: Applied the same dark grey hover effect to the logout button */}
                <DropdownMenuItem onClick={handleSignOut} className={`${itemClasses} text-md font-medium text-red-500 focus:text-red-400`}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}