"use client";

import React, { useState, useCallback, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { ProfileUpdateSchema } from "@/schema/profileSchema";
import z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { updateProfile, getProfile } from "@/actions/profileAction";

interface FormErrors {
  name?: string;
  phone?: string;
}

const ProfilePage = () => {
  const { data: session } = authClient.useSession();
  const { toast } = useToast();

  // UI State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileData, setProfileData] = useState<{
    name: string;
    phone: string | null;
  } | null>(null);

  // Load profile data from server
  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = await getProfile();

        if (result.success && result.result) {
          const userData = {
            name: result.result.name || "",
            phone: result.result.phone || "",
          };
          setProfileData(userData);
          setName(userData.name);
          setPhone(userData.phone);
        } else {
          toast({
            title: "Erreur",
            description: result.error || "Impossible de charger le profil.",
          });
        }
      } catch (err) {
        console.error("Erreur lors du chargement du profil:", err);
        toast({
          title: "Erreur",
          description: "Impossible de charger le profil.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [session?.user?.id, toast]);

  // Validate form inputs using Zod schema
  const validateForm = useCallback((): boolean => {
    try {
      ProfileUpdateSchema.parse({ name, phone });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FormErrors = {};
        error.issues.forEach((issue) => {
          const fieldName = issue.path[0] as string;
          if (fieldName === "name") fieldErrors.name = issue.message;
          if (fieldName === "phone") fieldErrors.phone = issue.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  }, [name, phone]);

  // Start editing mode with prefilled data
  const handleStartEdit = useCallback(() => {
    if (profileData) {
      setName(profileData.name ?? "");
      setPhone(profileData.phone ?? "");
      setErrors({});
      setIsEditing(true);
    }
  }, [profileData]);

  // Cancel editing and reset form
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    if (profileData) {
      setName(profileData.name);
      setPhone(profileData.phone || "");
    }
    setErrors({});
  }, [profileData]);

  // Save profile changes
  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSaving(true);

      try {
        const result = await updateProfile({ name, phone });
        
        if (!result.success) {
          toast({
            title: "Erreur",
            description: result.error || "Impossible de mettre à jour le profil.",
          });
          return;
        }

        // Update local profile data with the result
        if (result.result) {
          setProfileData({
            name: result.result.name || "",
            phone: result.result.phone || "",
          });
        }

        setIsEditing(false);

        toast({
          title: "Succès",
          description: "Votre profil a été mis à jour avec succès.",
        });
      } catch (error) {
        console.error("Error saving profile:", error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le profil. Veuillez réessayer.",
        });
      } finally {
        setIsSaving(false);
      }
    },
    [validateForm, toast, name, phone]
  );

  // Sign out handler
  const handleSignOut = useCallback(async () => {
    try {
      await authClient.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter. Veuillez réessayer.",
      });
    }
  }, [toast]);

  // Not authenticated state
  if (!session && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-background to-muted/20">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Accès non autorisé</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Veuillez vous connecter pour accéder à votre profil.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/auth/login" className="block">
                <Button className="w-full" size="lg">
                  Se connecter
                </Button>
              </Link>
              <Link href="/auth/register" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Créer un compte
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sessionUser = session?.user;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/10 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 animate-pulse">
            <div className="h-10 bg-muted rounded-lg w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded-lg w-1/2"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-1">
              <Card className="shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-muted rounded-full mb-4"></div>
                    <div className="h-6 bg-muted rounded-lg w-32 mb-2"></div>
                    <div className="h-4 bg-muted rounded-lg w-40"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card className="shadow-md">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-20 bg-muted rounded-lg"></div>
                  <div className="h-20 bg-muted rounded-lg"></div>
                  <div className="h-20 bg-muted rounded-lg"></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/10 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Mon profil
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos informations personnelles et préférences de compte.
          </p>
        </div>

        {/* Main Grid: Mobile (1 col) -> Tablet (1 col) -> Desktop (3 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Sidebar: Profile Card */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-6 shadow-md">
              <CardContent className="pt-6">
                {/* Avatar Section - Larger and more prominent */}
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="w-24 h-24 mb-4 border-4 border-primary/20">
                    {sessionUser?.image ? (
                      <AvatarImage
                        src={sessionUser?.image}
                        alt={sessionUser?.name ?? "User avatar"}
                      />
                    ) : (
                      <AvatarFallback className="text-2xl font-bold">
                        {(sessionUser?.name || "?").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <h2 className="text-xl font-semibold text-center">
                    {sessionUser?.name || "Utilisateur"}
                  </h2>
                  <p className="text-sm text-muted-foreground text-center break-all">
                    {sessionUser?.email}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 border-t pt-6">
                  <Button
                    onClick={
                      isEditing ? handleCancel : handleStartEdit
                    }
                    className="w-full"
                    variant={isEditing ? "outline" : "default"}
                    size="sm"
                  >
                    {isEditing ? "Annuler l'édition" : "Éditer le profil"}
                  </Button>

                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    Se déconnecter
                  </Button>

                  <Link href="/produits" className="block">
                    <Button
                      variant="ghost"
                      className="w-full"
                      size="sm"
                    >
                      Mes commandes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content: Profile Info */}
          <main className="lg:col-span-2">
            {/* View Mode - Display Info */}
            {!isEditing && (
              <Card className="shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Voici les informations associées à votre compte.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-6">
                    {/* Name Display */}
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Nom complet
                      </Label>
                      <p className="mt-2 text-lg font-medium">
                        {sessionUser?.name || "Non renseigné"}
                      </p>
                    </div>

                    {/* Email Display */}
                    <div className="pb-6 border-b">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Adresse email
                      </Label>
                      <p className="mt-2 text-lg font-medium break-all">
                        {sessionUser?.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        L&apos;email est lié à votre authentification et ne peut pas être modifié depuis votre profil.
                      </p>
                    </div>

                    {/* Phone Display */}
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Téléphone
                      </Label>
                      <p className="mt-2 text-lg font-medium">
                        {profileData?.phone || "Non renseigné"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Edit Mode - Form */}
            {isEditing && (
              <Card className="shadow-md border-primary/20">
                <CardHeader className="bg-primary/5 pb-4">
                  <CardTitle>Modifier mon profil</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations personnelles.
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleSave}>
                  <CardContent className="pt-6">
                    <div className="space-y-5">
                      {/* Name Field */}
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">
                          Nom complet *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex: Jean Dupont"
                          className={`mt-2 ${
                            errors.name ? "border-destructive" : ""
                          }`}
                          disabled={isSaving}
                          autoFocus
                          required
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email Display (disabled in edit mode) */}
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          Adresse email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={sessionUser?.email ?? ""}
                          disabled
                          className="mt-2 bg-muted"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          L&apos;email ne peut pas être modifié depuis votre profil.
                        </p>
                      </div>

                      {/* Phone Field */}
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Téléphone
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="(+216) 56 793 609"
                          className={`mt-2 ${
                            errors.phone ? "border-destructive" : ""
                          }`}
                          disabled={isSaving}
                        />
                        {errors.phone && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.phone}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Format: (+216) 56 793 609 (optionnel)
                        </p>
                      </div>
                    </div>
                  </CardContent>

                  {/* Form Actions */}
                  <CardFooter className="bg-muted/50 border-t gap-3 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1"
                    >
                      {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
