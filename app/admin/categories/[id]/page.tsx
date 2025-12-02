import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Edit, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCategoryById } from '@/actions/categoriesAction'

interface CategoryDetailsPageProps {
    params: {
        id: string
    }
}

export default async function CategoryDetailsPage({ params }: CategoryDetailsPageProps) {
    const { id } = params
    const { result: category } = await getCategoryById(id)

    if (!category) {
        notFound()
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/categories">
                        <Button variant="outline" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Retour
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        {category.name}
                    </h1>
                </div>

                <Link href={`/admin/categories/edit/${category.id}`}>
                    <Button className="gap-2">
                        <Edit className="h-4 w-4" />
                        Modifier
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-1">
                            <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                Nom
                            </div>
                            <div className="text-lg">{category.name}</div>
                        </div>
                        <div className="grid gap-1">
                            <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                ID
                            </div>
                            <div className="text-sm font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded w-fit">
                                {category.id}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
