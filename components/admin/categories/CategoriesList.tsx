'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCategory } from '@/actions/categoriesAction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from '@/components/ui/pagination'
import { Pencil, Trash2, Search, Plus } from 'lucide-react'
import { Category } from '@prisma/client'
import { toast } from 'sonner'
import Link from 'next/link'

interface CategoriesListProps {
    categories: Category[]
}

export default function CategoriesList({ categories = [] }: CategoriesListProps) {
    const router = useRouter()

    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Filter categories client-side
    const filteredCategories = useMemo(() => {
        return categories.filter(cat =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [categories, searchTerm])

    // Pagination logic
    const totalCount = filteredCategories.length
    const pageCount = Math.ceil(totalCount / pageSize)

    const paginatedCategories = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return filteredCategories.slice(startIndex, startIndex + pageSize)
    }, [filteredCategories, currentPage, pageSize])

    // Handle delete
    const handleDelete = async () => {
        if (!selectedCategoryId) return

        setIsDeleting(true)
        try {
            const response = await deleteCategory(selectedCategoryId)

            if (response.success) {
                toast.success(response.message || 'Catégorie supprimée avec succès')
                setDeleteDialogOpen(false)
                setSelectedCategoryId(null)
                router.refresh() // Refresh server component to get updated list
            } else {
                toast.error(response.error || 'Impossible de supprimer la catégorie')
            }
        } catch (error) {
            console.error('Error deleting category:', error)
            toast.error('Une erreur est survenue')
        } finally {
            setIsDeleting(false)
        }
    }

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
            if (currentPage > 3) pages.push('...')
            const startPage = Math.max(2, currentPage - 1)
            const endPage = Math.min(pageCount - 1, currentPage + 1)
            for (let i = startPage; i <= endPage; i++) {
                if (i !== 1 && i !== pageCount) pages.push(i)
            }
            if (currentPage < pageCount - 2) pages.push('...')
            pages.push(pageCount)
        }
        return pages
    }, [pageCount, currentPage])

    return (
        <div className="space-y-6">
            {/* Filters Section */}
            <div className="space-y-4 bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            placeholder="Rechercher une catégorie..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="pl-10"
                        />
                    </div>

                    <Link href="/admin/categories/add">
                        <Button className="gap-2 w-full sm:w-auto">
                            <Plus className="h-4 w-4" />
                            Ajouter une catégorie
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                {paginatedCategories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-slate-400 mb-2">
                            <Search className="h-12 w-12 mx-auto opacity-20" />
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                            Aucune catégorie trouvée
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead>Nom</TableHead>
                                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedCategories.map((category) => (
                                        <TableRow
                                            key={category.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                                        >
                                            <TableCell className="font-medium">
                                                {category.name}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            router.push(`/admin/categories/edit/${category.id}`)
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
                                                            setSelectedCategoryId(category.id)
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
                                        <PaginationItem>
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 gap-1 px-2.5 ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                                                    }`}
                                            >
                                                <span>«</span>
                                            </button>
                                        </PaginationItem>

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

                                        <PaginationItem>
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
                                                disabled={currentPage === pageCount}
                                                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 gap-1 px-2.5 ${currentPage === pageCount ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                                                    }`}
                                            >
                                                <span>»</span>
                                            </button>
                                        </PaginationItem>
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
                        <AlertDialogTitle>Supprimer la catégorie ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. La catégorie sera définitivement supprimée.
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
