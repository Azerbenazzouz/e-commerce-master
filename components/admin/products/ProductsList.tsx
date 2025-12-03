'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { deleteProduct, getAllProducts } from '@/actions/productsAction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from '@/components/ui/pagination'
import { ProductsLoadingSkeleton } from './ProductsLoadingSkeleton'
import { Pencil, Trash2, Eye, Search } from 'lucide-react'
import { Category } from '@prisma/client'
import { FullProduct } from '@/model/ProductModel'
import { toast } from 'sonner';


interface ProductsListProps {
  categories: Category[]
}

const DEFAULT_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="32" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E'

export default function ProductsList({ categories = [] }: ProductsListProps) {
  const router = useRouter()

  const [products, setProducts] = useState<FullProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [pageCount, setPageCount] = useState(1)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [sortBy, setSortBy] = useState<'newest' | 'priceAsc' | 'priceDesc'>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await getAllProducts({
        searchTerm: searchTerm || undefined,
        categoryName: categoryFilter || undefined,
        sortBy,
        pageNumber: currentPage,
        pageSize
      })

      if (res.success && res.result) {
        setProducts(res.result)
        setTotalCount(res.totalCount || 0)
        setPageCount(res.pageCount || 1)
      } else {

        toast.error(res.error || 'Impossible de charger les produits')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, categoryFilter, sortBy, currentPage, pageSize])
  // Initial fetch
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Handle delete
  const handleDelete = async () => {
    if (!selectedProductId) return

    setIsDeleting(true)
    try {
      const response = await deleteProduct(selectedProductId)

      if (response.success) {
        toast.success(response.message || 'Produit supprimé avec succès')
        setDeleteDialogOpen(false)
        setSelectedProductId(null)
        await fetchProducts()
      } else {
        toast.error(response.error || 'Impossible de supprimer le produit')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Une erreur est survenue')
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle search with debounce
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }, [])

  // Handle filter changes
  const handleCategoryChange = useCallback((value: string) => {
    setCategoryFilter(value === 'all' ? '' : value)
    setCurrentPage(1)
  }, [])

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value as 'newest' | 'priceAsc' | 'priceDesc')
    setCurrentPage(1)
  }, [])

  // Pagination helpers
  const paginationPages = useMemo(() => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (pageCount <= maxVisible) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(pageCount - 1, currentPage + 1)

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== pageCount) {
          pages.push(i)
        }
      }

      if (currentPage < pageCount - 2) {
        pages.push('...')
      }

      pages.push(pageCount)
    }

    return pages
  }, [pageCount, currentPage])

  const getImageUrl = (product: FullProduct) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url
    }
    return DEFAULT_IMAGE
  }

  if (isLoading && products.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 mb-6">
          <div className="flex-1" />
        </div>
        <ProductsLoadingSkeleton rows={pageSize} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="space-y-4 bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search Bar */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom ou description..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Sort */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Plus récents</SelectItem>
              <SelectItem value="priceAsc">Prix: Croissant</SelectItem>
              <SelectItem value="priceDesc">Prix: Décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-slate-400 mb-2">
              <Search className="h-12 w-12 mx-auto opacity-20" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Aucun produit trouvé
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-12 text-center">Image</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="text-right">Prix</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-center">Note</TableHead>
                    <TableHead className="w-32 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    >
                      {/* Image */}
                      <TableCell className="text-center py-3">
                        <div className="relative h-10 w-10 mx-auto overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                          <Image
                            src={getImageUrl(product)}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      </TableCell>

                      {/* Name */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-medium text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                              {product.name}
                            </p>
                            {product.isNew && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                Nouveau
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {product.category?.name || 'N/A'}
                        </Badge>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="text-right font-semibold text-slate-900 dark:text-slate-100">
                        {product.price.toFixed(2)} TND
                      </TableCell>

                      {/* Stock */}
                      <TableCell className="text-right">
                        <Badge
                          variant={product.stock > 0 ? 'default' : 'destructive'}
                          className="font-normal"
                        >
                          {product.stock} unités
                        </Badge>
                      </TableCell>

                      {/* Rating */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-sm font-medium">
                            {product.rating.toFixed(1)}
                          </span>
                          <span className="text-yellow-400">★</span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/products/${product.id}`)
                            }
                            title="Voir les détails"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/products/edit/${product.id}`)
                            }
                            title="Modifier"
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProductId(product.id)
                              setDeleteDialogOpen(true)
                            }}
                            title="Supprimer"
                            className="h-8 w-8 p-0 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/50">
                <Pagination>
                  <PaginationContent className="flex-wrap gap-1">
                    {/* Previous */}
                    <PaginationItem>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 gap-1 px-2.5 ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                          }`}
                      >
                        <span>«</span>
                        <span className="hidden sm:inline">Précédent</span>
                      </button>
                    </PaginationItem>

                    {/* Page Numbers */}
                    {paginationPages.map((page, index) => (
                      <PaginationItem key={index}>
                        {page === '...' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => setCurrentPage(Number(page))}
                            isActive={page === currentPage}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    {/* Next */}
                    <PaginationItem>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, pageCount))
                        }
                        disabled={currentPage === pageCount}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 gap-1 px-2.5 ${currentPage === pageCount ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                          }`}
                      >
                        <span className="hidden sm:inline">Suivant</span>
                        <span>»</span>
                      </button>
                    </PaginationItem>

                    {/* Info */}
                    <div className="ml-auto text-sm text-slate-600 dark:text-slate-400 flex items-center">
                      Affichage {(currentPage - 1) * pageSize + 1} à{' '}
                      {Math.min(currentPage * pageSize, totalCount)} sur {totalCount}
                    </div>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel disabled={isDeleting}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
