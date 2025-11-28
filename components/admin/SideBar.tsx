"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigationConfig, NavigationItem } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight } from 'lucide-react'

const SidebarItem = ({ item, level = 0 }: { item: NavigationItem, level?: number }) => {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    // Check if this item or any of its children are active
    const isActive = item.href ? pathname === item.href : false
    const isChildActive = item.children ? item.children.some(child => pathname === child.href) : false

    // Auto-open if child is active
    useEffect(() => {
        if (isChildActive) {
            setIsOpen(true)
        }
    }, [isChildActive])

    const Icon = item.icon

    if (item.children) {
        return (
            <div className="w-full">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium",
                        (isActive || isChildActive) && "bg-gray-100 text-gray-900",
                        !isActive && !isChildActive && "text-gray-600",
                        level > 0 && "pl-8"
                    )}
                >
                    <Icon className={cn("w-5 h-5 mr-3", item.color)} />
                    <span className="flex-1 text-left">{item.title}</span>
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {isOpen && (
                    <div className="mt-1 space-y-1">
                        {item.children.map((child) => (
                            <SidebarItem key={child.title} item={child} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <Link
            href={item.href || '#'}
            className={cn(
                "flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium",
                isActive && "bg-gray-100 text-gray-900",
                !isActive && "text-gray-600",
                level > 0 && "pl-8"
            )}
        >
            <Icon className={cn("w-5 h-5 mr-3", item.color)} />
            <span>{item.title}</span>
            {item.badge && (
                <span className="ml-auto bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs">
                    {item.badge}
                </span>
            )}
        </Link>
    )
}

const SideBar = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] gap-8">
            <aside className="w-full md:w-64 shrink-0">
                <div className="sticky top-8">
                    <div className="mb-6 px-2">
                        <h2 className="text-lg font-bold tracking-tight">Admin Panel</h2>
                        <p className="text-sm text-muted-foreground">Manage your store</p>
                    </div>
                    <nav className="space-y-1">
                        {navigationConfig.map((item) => (
                            <SidebarItem key={item.title} item={item} />
                        ))}
                    </nav>
                </div>
            </aside>
            <main className="flex-1 min-w-0">
                {children}
            </main>
        </div>
    )
}

export default SideBar