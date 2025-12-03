import { Role } from '@prisma/client'
import { LucideIcon, LayoutDashboard, Package, List, Tags, Users, Building2, Monitor, ShoppingCart, History, BarChart3, Banknote } from 'lucide-react'

export interface NavigationItem {
    title: string
    href?: string
    icon: LucideIcon
    children?: NavigationItem[]
    badge?: string | number,
    permittedRoles?: Role[]
    description?: string
    color?: string
    bgColor?: string
    borderColor?: string
}

export const navigationConfig: NavigationItem[] = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Orders",
        description: "Gestion des commandes",
        href: "/admin/orders",
        icon: ShoppingCart,
        permittedRoles: [Role.ADMIN],
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "hover:border-blue-500/50"
    },
    {
        title: "Produits",
        description: "Stock & catalogue produits",
        href: "/admin/products", // Changed from just icon to have a main link if needed, or handle in dashboard
        icon: Package,
        permittedRoles: [Role.ADMIN],
        color: "text-violet-500",
        bgColor: "bg-violet-500/10",
        borderColor: "hover:border-violet-500/50",
    },
    {
        title: "Categories",
        description: "Gestion des catégories",
        href: "/admin/categories",
        icon: Tags,
        permittedRoles: [Role.ADMIN],
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
        borderColor: "hover:border-cyan-500/50"
    },
    {
        title: "Clients",
        description: "Gestion de la base clients",
        href: "/admin/clients",
        icon: Users,
        permittedRoles: [Role.ADMIN],
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "hover:border-emerald-500/50"
    }
]