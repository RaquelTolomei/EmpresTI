import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const EQUIPMENT_BUCKET = "imagem-equipamento";

export function getEquipmentImageUrl(
  imagePath: string | null | undefined,
): string | null {
  if (!imagePath) return null;

  const { data } = createSupabaseBrowserClient()
    .storage.from(EQUIPMENT_BUCKET)
    .getPublicUrl(imagePath);

  return data.publicUrl;
}
