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
        title: "Caisse",
        description: "Nouvelle vente & encaissement",
        href: "/admin/caisse",
        icon: ShoppingCart,
        permittedRoles: [Role.ADMIN],
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "hover:border-blue-500/50"
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
        children: [
            {
                title: "Liste des produits",
                href: "/admin/products",
                icon: List,
            },
            {
                title: "Liste des catégories",
                href: "/admin/categories",
                icon: Tags,
            },
            {
                title: "Fournisseurs",
                href: "/admin/furnishers",
                icon: Building2,
            }
        ]
    },
    {
        title: "Traites",
        description: "Gestion des traites & chèques",
        href: "/admin/traite",
        icon: Banknote,
        permittedRoles: [Role.ADMIN],
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
        borderColor: "hover:border-cyan-500/50"
    },
    {
        title: "Entrepôts",
        description: "Gestion des dépôts & stocks",
        href: "/admin/warehouses",
        icon: Building2,
        permittedRoles: [Role.ADMIN],
        color: "text-fuchsia-500",
        bgColor: "bg-fuchsia-500/10",
        borderColor: "hover:border-fuchsia-500/50"
    },
    {
        title: "Employés",
        description: "Gestion du personnel",
        href: "/admin/staff",
        icon: Users,
        permittedRoles: [Role.ADMIN],
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "hover:border-orange-500/50"
    },
    {
        title: "Historique",
        description: "Commandes & mouvements",
        href: "/admin/historique",
        icon: History,
        permittedRoles: [Role.ADMIN],
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        borderColor: "hover:border-amber-500/50"
    },
    {
        title: "Statistiques",
        description: "Analyses & performances",
        href: "/admin/statistiques",
        icon: BarChart3,
        permittedRoles: [Role.ADMIN],
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
        borderColor: "hover:border-rose-500/50"
    },
    {
        title: "Vitrine",
        href: "/admin/vitrine",
        icon: Monitor,
        permittedRoles: [Role.ADMIN]
    }
]