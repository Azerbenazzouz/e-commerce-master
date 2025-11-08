"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { LoginSchema, LoginSchemaType } from "@/schema/authSchema"
import { toast } from "sonner"
import { signIn } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginSchemaType) => {
    const result = LoginSchema.safeParse(values)
    if (result.success) {
      await signIn.email(
        result.data,
        {
          onRequest: () => {
            setIsLoading(true)
          },
          onResponse: () => {
            setIsLoading(false)
          },
          onError: (ctx) => {
            toast.error("Erreur lors de la connexion.")
            console.log(ctx.error.message)
          },
          onSuccess: () => {
            toast.success("Connexion réussie !")
            router.push('/')
          }
        },
      )
    } else {
      toast.error("Erreur lors de la connexion.")
      console.log("Erreurs de validation :", result.error)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Se connecter</h1>
          <p className="text-sm text-muted-foreground">
            Remplissez le formulaire pour vous connecter
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="exemple@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Chargement..." : "Se connecter"}
            </Button>
          </form>
        </Form>

        <div className="text-sm text-muted-foreground">
          Vous n&#39;avez pas encore de compte ?{" "}
          <Link href="/auth/register" className="text-blue-500 hover:underline">
            Créez-en un
          </Link>
        </div>
      </div>
    </div>
  )
}