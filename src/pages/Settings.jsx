import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSupabaseAuth } from "../integrations/supabase/auth.jsx";
import { useProfile, useUpdateProfile } from "../integrations/supabase/index.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function Settings() {
  const { session } = useSupabaseAuth();
  const { data: profile, isLoading } = useProfile(session?.user?.id);
  const updateProfile = useUpdateProfile();
  const { register, handleSubmit, reset } = useForm();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (profile) {
      reset(profile);
    }
  }, [profile, reset]);

  const onSubmit = async (data) => {
    await updateProfile.mutateAsync({ ...data, id: session.user.id });
  setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" {...register("username")} />
              </div>
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" {...register("full_name")} />
              </div>
              <div>
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input id="avatar_url" {...register("avatar_url")} />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" {...register("website")} />
              </div>
              <Button type="submit">Save</Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Username</Label>
                <p>{profile.username}</p>
              </div>
              <div>
                <Label>Full Name</Label>
                <p>{profile.full_name}</p>
              </div>
              <div>
                <Label>Avatar URL</Label>
                <p>{profile.avatar_url}</p>
              </div>
              <div>
                <Label>Website</Label>
                <p>{profile.website}</p>
              </div>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default Settings;