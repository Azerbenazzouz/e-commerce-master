"use client"

import React, { useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminPage() {
  const { data: session } = authClient.useSession()
  const router = useRouter()

  // Check if user is authenticated and is admin
  useEffect(() => {
    if (!session) return

    if (session.user?.role !== "ADMIN") {
      router.push("/profile")
    }
  }, [session, router])

  // Show loading while checking auth
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Vérification de l&#39;accès...</p>
        </div>
      </div>
    )
  }

  // Show access denied if not admin
  if (session.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-background to-muted/20">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold">Accès refusé</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Vous n&#39;avez pas les droits d&#39;administrateur pour accéder à cette page.
              </p>
              <Link href={{ pathname: "/profile" }} className="block mt-6">
                <Button className="w-full">Retour au profil</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/10 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🔧</div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Admin Panel</h1>
              <p className="text-muted-foreground mt-1">Gérez l&#39;application</p>
            </div>
          </div>
        </div>

        {/* Admin Info */}
        <Card className="mb-8 shadow-md border-red-200">
          <CardHeader className="bg-red-50/50">
            <CardTitle className="text-red-700">Accès Administrateur</CardTitle>
            <CardDescription>Vous êtes connecté avec les droits d&#39;administrateur</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nom</p>
                <p className="text-lg font-semibold">{session.user?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg font-semibold break-all">{session.user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rôle</p>
                <p className="text-lg font-semibold text-red-600">ADMIN</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">--</div>
              <p className="text-xs text-muted-foreground mt-1">À implémenter</p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">--</div>
              <p className="text-xs text-muted-foreground mt-1">À implémenter</p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Produits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">--</div>
              <p className="text-xs text-muted-foreground mt-1">À implémenter</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Features */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Modules Admin</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Users Management */}
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>👥</span> Utilisateurs
                </CardTitle>
                <CardDescription>Gérer les utilisateurs du système</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Voir la liste des utilisateurs, modifier les rôles, supprimer des comptes
                </p>
                <Button variant="outline" className="w-full" disabled>
                  À venir
                </Button>
              </CardContent>
            </Card>

            {/* Products Management */}
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>📦</span> Produits
                </CardTitle>
                <CardDescription>Gérer le catalogue de produits</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ajouter, modifier, ou supprimer des produits du catalogue
                </p>
                <Button variant="outline" className="w-full" onClick={() => router.push("/admin/products")}>
                  Gérer les produits
                </Button>
              </CardContent>
            </Card>

            {/* Orders Management */}
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>📋</span> Commandes
                </CardTitle>
                <CardDescription>Gérer les commandes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Voir les commandes, modifier les statuts, exporter les données
                </p>
                <Button variant="outline" className="w-full" disabled>
                  À venir
                </Button>
              </CardContent>
            </Card>

            {/* Categories Management */}
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>🏷️</span> Catégories
                </CardTitle>
                <CardDescription>Gérer les catégories de produits</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Créer, modifier, ou supprimer les catégories
                </p>
                <Button variant="outline" className="w-full" disabled>
                  À venir
                </Button>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>📊</span> Statistiques
                </CardTitle>
                <CardDescription>Consulter l&#39;analyse</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Voir les ventes, les visiteurs, les revenus, etc.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  À venir
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>⚙️</span> Paramètres
                </CardTitle>
                <CardDescription>Configurer l&#39;application</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Modifier les paramètres globaux de l&#39;application
                </p>
                <Button variant="outline" className="w-full" disabled>
                  À venir
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t">
          <Link href="/profile">
            <Button variant="outline">← Retour au profil</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
