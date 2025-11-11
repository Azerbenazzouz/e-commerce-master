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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { Prisma } from '@prisma/client'

interface ProductFormProps {
  initialData?: Prisma.ProductGetPayload<{ include: { category: true } }> | null
  isEditing?: boolean
  onSuccess?: (product: unknown) => void
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, isEditing = false, onSuccess }) => {
  const { toast } = useToast()
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
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
              <CardDescription>Entrez les informations principales du produit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                        placeholder="Décrivez le produit en détail..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Minimum 10 caractères, maximum 2000</FormDescription>
                    <FormMessage />
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
                          <SelectValue placeholder="Sélectionnez une catégorie" />
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
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Tarification</CardTitle>
              <CardDescription>Définissez le prix et les réductions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                      <FormLabel>Prix original (TND) - Optionnel</FormLabel>
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
                      <FormDescription>Utilisez ceci pour afficher les réductions</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Inventory & Ratings */}
          <Card>
            <CardHeader>
              <CardTitle>Inventaire & Évaluations</CardTitle>
              <CardDescription>Gérez le stock et les évaluations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                          placeholder="0"
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

              <FormField
                control={form.control}
                name="isNew"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Nouveau produit</FormLabel>
                      <FormDescription>Marquez ce produit comme nouveau</FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Spécifications</CardTitle>
                <CardDescription>Ajoutez des caractéristiques détaillées</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSpecification}
              >
                + Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {specifications.length === 0 ? (
                <p className="text-sm text-slate-500">Aucune spécification ajoutée</p>
              ) : (
                <div className="space-y-3">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Label (ex: Couleur)"
                        value={spec.label}
                        onChange={(e) => updateSpecification(index, 'label', e.target.value)}
                      />
                      <Input
                        placeholder="Valeur (ex: Noir)"
                        value={spec.value}
                        onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeSpecification(index)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Spinner className="mr-2 h-4 w-4" />}
              {isEditing ? 'Mettre à jour le produit' : 'Créer le produit'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ProductForm
