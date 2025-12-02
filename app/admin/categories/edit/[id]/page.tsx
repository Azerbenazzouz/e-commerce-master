"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter, notFound } from 'next/navigation'
import { getCategoryById } from '@/actions/categoriesAction'
import CategoryForm from '@/components/admin/categories/CategoryForm'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'
import { Category } from '@prisma/client'

const EditCategoryPage = () => {
    const params = useParams()
    const router = useRouter()
    const categoryId = params.id as string

    const [category, setCategory] = useState<Category | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const result = await getCategoryById(categoryId)
                if (result.success && result.result) {
                    setCategory(result.result as Category)
                } else {
                    setError(result.error || 'Catégorie non trouvée')
                    notFound()
                }
            } catch {
                setError('Erreur lors du chargement de la catégorie')
                notFound()
            } finally {
                setIsLoading(false)
            }
        }

        if (categoryId) {
            fetchCategory()
        }
    }, [categoryId])

    const handleSuccess = () => {
        router.push('/admin/categories')
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner className="h-8 w-8" />
            </div>
        )
    }

    if (error || !category) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/categories">
                        <Button variant="outline" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Retour
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Erreur
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            {error || 'Catégorie non trouvée'}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Form */}
            <CategoryForm
                initialData={category}
                isEditing={true}
                onSuccess={handleSuccess}
            />
        </div>
    )
}

export default EditCategoryPage
