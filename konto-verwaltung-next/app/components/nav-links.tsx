'use client'

import Link from "next/link"
import {DynamicLink, StaticLink } from "./navigation"
import { usePathname } from "next/navigation"

export default function NavLinks({ staticLinks, links } : {
    staticLinks: StaticLink[],
    links: DynamicLink[]
}) {
    const shadow = 'shadow-[4px_4px_8px_#dddddd,-4px_-4px_6px_#ffffff]'
    const hover = 'hover:shadow-none hover:inset-shadow-[-4px_4px_8px_#dddddd,4px_-4px_6px_#ffffff]'
    const linkClass = `flex items-center justify-center w-full h-9 px-2 py-1 rounded-md bg-white/15 backdrop-blur-md ${shadow} ${hover}`
    const activeClass = `shadow-none inset-shadow-[-4px_4px_8px_#cccccc,4px_-4px_6px_#ffffff]`
    const pathname = usePathname()
    const isActive = (link: string) => link === '' ? pathname === '/' : pathname.includes(link)
    return (
        <>
            {staticLinks.map(link => (
                <Link className={`${linkClass} ${isActive(link.href) ? activeClass : ''}`}
                      key={link.href}
                      href={`/${link.href}`}>
                    {link.icon}
                </Link>
            ))}
            {links.map(link => (
                <Link className={`${linkClass} ${isActive(link.href) ? activeClass : ''}`}
                      key={link.href}
                      href={`/${link.href}`}>
                    {link.label}
                </Link>
            ))}
        </>
    )
}
