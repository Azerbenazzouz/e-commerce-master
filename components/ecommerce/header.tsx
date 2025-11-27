"use client"

import type React from "react"

import { Search, Menu, User as UserIcon, ChevronDown, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CartDrawer } from '@/components/ecommerce/cart-drawer';
import { signOut, authClient } from '@/lib/auth-client';
import { User } from "better-auth"
import { Role } from "@prisma/client"


const categories = [
  "Électronique",
  "Mode",
  "Maison & Jardin",
  "Sports & Loisirs",
  "Beauté & Santé",
  "Livres",
  "Jouets",
  "Alimentation",
]

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { useSession } = authClient
  const { data: session } = useSession()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q.length > 0) {
      router.push(`/produits?search=${encodeURIComponent(q)}`)
    } else {
      router.push(`/produits`)
    }
  }

  // minimal user shape
  const [user, setUser] = useState<User>()
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    if (!session) return setLoadingAuth(false)
    setUser(session.user)
    setLoadingAuth(false)
  }, [session])

  // Get user role
  const isAdmin = session?.user?.role as Role === Role.ADMIN

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch {
      // ignore
    }
    // clear local state and navigate to login
    setUser(undefined)
    router.push('/auth/login')
  }

  return (
    <div className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Logo + Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
                <span className="font-mono text-lg font-bold text-primary-foreground">K</span>
              </div>
              <span className="hidden sm:inline text-lg font-semibold tracking-tight">KiboShop</span>
            </Link>

            {/* Desktop: Primary Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:gap-1">
              <Link
                href="/produits"
                className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-md hover:bg-muted"
              >
                Produits
              </Link>

              {/* Categories Megamenu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 gap-1 px-3">
                    Catégories
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[520px] p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Link
                        key={category}
                        href={`/produits?category=${encodeURIComponent(category)}`}
                        className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          {/* Center: Search */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-xl items-center px-2 lg:px-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher des produits..."
                className="w-full pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Rechercher des produits"
              />
            </div>
          </form>

          {/* Right: User Actions */}
          <div className="flex items-center gap-2">
            {/* Account button: if user is authenticated show dropdown, otherwise redirect to login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Mon compte" disabled={loadingAuth}>
                    <UserIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5">
                      <span className="font-medium">Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <div className="my-1 border-t border-border"></div>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 text-red-600 font-semibold hover:text-red-700">
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <div className="my-1 border-t border-border"></div>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5">
                      <span className="font-medium">Mes commandes</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <button onClick={(e) => { e.preventDefault(); handleSignOut(); }} className="w-full text-left px-3 py-2.5">
                      Se déconnecter
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Mon compte" onClick={() => router.push('/auth/login')} disabled={loadingAuth}>
                <UserIcon className="h-5 w-5" />
              </Button>
            )}

            <CartDrawer />

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-0">
                {/* Header du menu mobile */}
                <div className="border-b border-border bg-muted/50 px-4 py-3">
                  <p className="text-sm font-semibold">Navigation</p>
                </div>

                {/* Navigation principale */}
                <div className="p-2">
                  <DropdownMenuItem asChild>
                    <Link href="/produits" className="flex items-center gap-3 px-3 py-2.5">
                      <span className="font-medium">Tous les produits</span>
                    </Link>
                  </DropdownMenuItem>
                </div>

                {/* Séparateur */}
                <div className="border-t border-border my-1"></div>

                {/* Catégories */}
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Catégories
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map((category) => (
                      <DropdownMenuItem key={category} asChild>
                        <Link
                          href={`/produits?category=${encodeURIComponent(category)}`}
                          className="px-3 py-2 text-sm"
                        >
                          {category}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </div>

                {/* Séparateur */}
                <div className="border-t border-border my-1"></div>

                {/* Compte utilisateur */}
                <div className="p-2">
                  {user ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5">
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Mon profil</span>
                        </Link>
                      </DropdownMenuItem>

                      {/* Admin Panel Mobile */}
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 text-red-600 font-semibold">
                            <span>🔧 Admin Panel</span>
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem asChild>
                        <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Mes commandes</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <button onClick={(e) => { e.preventDefault(); handleSignOut(); }} className="w-full text-left px-3 py-2.5">
                          Se déconnecter
                        </button>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login" className="flex items-center gap-3 px-3 py-2.5">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Se connecter</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
