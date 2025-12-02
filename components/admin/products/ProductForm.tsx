"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProductSchema } from '@/schema/productSchema'
import { createProduct, updateProduct } from '@/actions/productsAction'
import { getAllCategories } from '@/actions/categoriesAction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { Prisma } from '@prisma/client'
import { ChevronLeft, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProductFormProps {
  initialData?: Prisma.ProductGetPayload<{ include: { category: true } }> | null
  isEditing?: boolean
  onSuccess?: (product: unknown) => void
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, isEditing = false, onSuccess }) => {
  const { toast } = useToast()
  const router = useRouter()
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [specifications, setSpecifications] = useState<Array<{ label: string; value: string }>>(
    initialData?.specifications && Array.isArray(initialData.specifications)
      ? (initialData.specifications as Array<{ label: string; value: string }>)
      : initialData?.specifications
        ? Object.entries(initialData.specifications as Record<string, unknown>).map(([key, value]) => ({
          label: key,
          value: String(value),
        }))
        : []
  )

  const form = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name || '',
      price: initialData?.price || 0,
      originalPrice: initialData?.originalPrice || undefined,
      description: initialData?.description || '',
      categoryId: initialData?.categoryId || '',
      stock: initialData?.stock || 0,
      rating: initialData?.rating || 0,
      popularity: initialData?.popularity || 0,
      isNew: initialData?.isNew !== undefined ? initialData.isNew : true,
      specifications: specifications,
    },
  })

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories()
        if (response.success && response.result) {
          setCategories(response.result as Array<{ id: string; name: string }>)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const onSubmit = async (data: Record<string, unknown>) => {
    setIsLoading(true)
    try {
      const formData = {
        ...data,
        specifications: specifications,
      }

      let result
      if (isEditing && initialData?.id) {
        result = await updateProduct(initialData.id, formData as unknown as Parameters<typeof updateProduct>[1])
      } else {
        result = await createProduct(formData as unknown as Parameters<typeof createProduct>[0])
      }

      if (result.success) {
        toast({
          title: isEditing ? 'Produit mis à jour' : 'Produit créé',
          description: result.message || 'Opération réussie.',
          variant: 'default',
        })
        onSuccess?.(result.result)
        if (!isEditing) {
          form.reset()
          setSpecifications([])
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

  const addSpecification = () => {
    setSpecifications([...specifications, { label: '', value: '' }])
  }

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index))
  }

  const updateSpecification = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...specifications]
    updated[index][field] = value
    setSpecifications(updated)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            {isEditing ? 'Modifier le produit' : 'Ajouter un produit'}
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" size="sm" type="button" onClick={() => router.back()}>
              Annuler
            </Button>
            <Button size="sm" type="submit" disabled={isLoading}>
              {isLoading && <Spinner className="mr-2 h-4 w-4" />}
              {isEditing ? 'Enregistrer les modifications' : 'Enregistrer le produit'}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            {/* General Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Détails du produit</CardTitle>
                <CardDescription>
                  Informations principales sur votre produit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du produit</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: iPhone 15 Pro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description détaillée du produit..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Specifications Card */}
            <Card>
              <CardHeader>
                <CardTitle>Spécifications techniques</CardTitle>
                <CardDescription>
                  Ajoutez des caractéristiques techniques pour ce produit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="grid gap-1 flex-1">
                        <Input
                          placeholder="Label (ex: Couleur)"
                          value={spec.label}
                          onChange={(e) => updateSpecification(index, 'label', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1 flex-1">
                        <Input
                          placeholder="Valeur (ex: Noir)"
                          value={spec.value}
                          onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSpecification(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSpecification}
                    className="mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une spécification
                  </Button>
                  {specifications.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucune spécification ajoutée.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Statut du produit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="isNew"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Nouveau</FormLabel>
                          <FormDescription>
                            Marquer comme nouveauté
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <CardTitle>Prix & Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix (TND)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={field.value as string | number}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix Original (Optionnel)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={(field.value as string | number) || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={field.value as string | number}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Metrics Card */}
            <Card>
              <CardHeader>
                <CardTitle>Métriques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note (0-5)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={field.value as string | number}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="popularity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Popularité</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            value={field.value as string | number}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
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

export default ProductForm
