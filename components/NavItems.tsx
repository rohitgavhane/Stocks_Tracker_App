"use client"

import { Nav_Items } from "@/lib/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavItems = () => {
    const pathname = usePathname()

    const isActive = (path: string) => {
        // Strict check for the homepage
        if (path === '/') return pathname === '/';
        // Check if the current path starts with the link's path for other pages
        return pathname.startsWith(path);
    }

    return (
        <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
            {/* Destructure the object here */}
            {Nav_Items.map(({ label, href }) => (
                <li key={href}> {/* Use a unique value like href for the key */}
                    <Link href={href} className={`hover:text-yellow-500 transition-colors ${
                        isActive(href) ? 'text-gray-100' : 'text-gray-400' // Added a default color
                    }`}>
                        {label}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default NavItems