import { Suspense } from 'react'
import CategoriesList from '@/components/admin/categories/CategoriesList'
import { CategoriesLoadingSkeleton } from '@/components/admin/categories/CategoriesLoadingSkeleton'
import { getAllCategories } from '@/actions/categoriesAction'

async function getCategories() {
    try {
        const res = await getAllCategories()
        if (res.success && res.result) {
            return res.result
        }
        return []
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

export default async function CategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Gestion des Catégories
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Gérez les catégories de vos produits
                    </p>
                </div>
            </div>

            {/* Categories List */}
            <Suspense fallback={<CategoriesLoadingSkeleton rows={5} />}>
                <CategoriesList categories={categories} />
            </Suspense>
        </div>
    )
}