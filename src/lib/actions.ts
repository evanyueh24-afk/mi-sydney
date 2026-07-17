"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export interface ActionResult {
  ok: boolean;
  error?: string;
  favorited?: boolean;
}

export async function toggleFavorite(spotId: string): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  const { data: existing } = await supabase
    .from("favorites")
    .select("spot_id")
    .eq("user_id", user.id)
    .eq("spot_id", spotId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("spot_id", spotId);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/saved");
    revalidatePath(`/spot/${spotId}`);
    return { ok: true, favorited: false };
  }

  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: user.id, spot_id: spotId });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/saved");
  revalidatePath(`/spot/${spotId}`);
  return { ok: true, favorited: true };
}

export async function submitReview(input: {
  spotId: string;
  rating: number;
  text: string;
  photoUrl?: string | null;
}): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_authenticated" };
  if (input.rating < 1 || input.rating > 5)
    return { ok: false, error: "invalid_rating" };

  // Upsert: one review per user per spot (matches the unique constraint).
  const { error } = await supabase.from("reviews").upsert(
    {
      spot_id: input.spotId,
      user_id: user.id,
      rating: input.rating,
      text: input.text?.trim() || null,
      photo_url: input.photoUrl || null,
    },
    { onConflict: "spot_id,user_id" },
  );
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/spot/${input.spotId}`);
  revalidatePath("/");
  return { ok: true };
}

export async function updateProfile(input: {
  displayName?: string;
  languagePref?: "en" | "zh";
}): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  const patch: Record<string, unknown> = {};
  if (typeof input.displayName === "string")
    patch.display_name = input.displayName.trim();
  if (input.languagePref) patch.language_pref = input.languagePref;

  const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/profile");
  return { ok: true };
}
