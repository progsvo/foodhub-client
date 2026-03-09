import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileEditForm } from "@/components/modules/profile/ProfileEditForm";
import { ProviderProfileForm } from "@/components/modules/profile/ProviderProfileForm";
import { getProfile } from "@/services/user.service.server";

export default async function ProfilePage() {
  const res = await getProfile();

  if (!res.success || !res.data) {
    if (res.message === "Unauthorized") {
      redirect("/login?redirect=/profile");
    }
    redirect("/login?redirect=/profile");
  }

  const profile = res.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/">← Back to home</Link>
        </Button>
      </div>

      <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account info</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.image && (
              <div className="relative h-24 w-24 overflow-hidden rounded-full">
                <Image
                  src={profile.image}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{profile.name}</p>
            </div>
            {profile.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{profile.phone}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium">{profile.role ?? "CUSTOMER"}</p>
            </div>
          </CardContent>
        </Card>

        <ProfileEditForm profile={profile} />
      </div>

      {profile.role === "PROVIDER" && (
        <div className="mt-8">
          {!profile.providerProfile ? (
            <ProviderProfileForm mode="create" />
          ) : (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Provider profile</CardTitle>
                  <CardDescription>Your business information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.providerProfile.image && (
                    <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                      <Image
                        src={profile.providerProfile.image}
                        alt={profile.providerProfile.businessName}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Business name
                    </p>
                    <p className="font-medium">
                      {profile.providerProfile.businessName}
                    </p>
                  </div>
                  {profile.providerProfile.description && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Description
                      </p>
                      <p className="font-medium">
                        {profile.providerProfile.description}
                      </p>
                    </div>
                  )}
                  {profile.providerProfile.address && (
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">
                        {profile.providerProfile.address}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <ProviderProfileForm
                mode="edit"
                providerProfile={profile.providerProfile}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
