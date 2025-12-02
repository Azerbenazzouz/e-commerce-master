"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CategorySchema } from '@/schema/categorySchema'
import { createCategory, updateCategory } from '@/actions/categoriesAction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { Category } from '@prisma/client'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CategoryFormProps {
    initialData?: Category | null
    isEditing?: boolean
    onSuccess?: (category: unknown) => void
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, isEditing = false, onSuccess }) => {
    const { toast } = useToast()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            id: initialData?.id,
            name: initialData?.name || '',
        },
    })

    const onSubmit = async (data: Record<string, unknown>) => {
        setIsLoading(true)
        try {
            let result
            if (isEditing && initialData?.id) {
                result = await updateCategory(initialData.id, data as unknown as Parameters<typeof updateCategory>[1])
            } else {
                result = await createCategory(data as unknown as Parameters<typeof createCategory>[0])
            }

            if (result.success) {
                toast({
                    title: isEditing ? 'Catégorie mise à jour' : 'Catégorie créée',
                    description: result.message || 'Opération réussie.',
                    variant: 'default',
                })
                onSuccess?.(result.result)
                if (!isEditing) {
                    form.reset()
                } else {
                    router.push('/admin/categories')
                }
            } else {
                toast({
                    title: 'Erreur',
                    description: result.error || 'Une erreur est survenue.',
                    variant: 'destructive',
                })
            }
        } catch {
            toast({
                title: 'Erreur',
                description: 'Une erreur inattendue est survenue.',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        type="button"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Retour</span>
                    </Button>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        {isEditing ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
                    </h1>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Button variant="outline" size="sm" type="button" onClick={() => router.back()}>
                            Annuler
                        </Button>
                        <Button size="sm" type="submit" disabled={isLoading}>
                            {isLoading && <Spinner className="mr-2 h-4 w-4" />}
                            {isEditing ? 'Enregistrer les modifications' : 'Créer la catégorie'}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Détails de la catégorie</CardTitle>
                            <CardDescription>
                                Informations principales sur votre catégorie
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom de la catégorie</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Électronique" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex items-center justify-end gap-2 md:hidden">
                    <Button variant="outline" size="sm" type="button" onClick={() => router.back()}>
                        Annuler
                    </Button>
                    <Button size="sm" type="submit" disabled={isLoading}>
                        {isLoading && <Spinner className="mr-2 h-4 w-4" />}
                        {isEditing ? 'Enregistrer' : 'Créer'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CategoryForm
