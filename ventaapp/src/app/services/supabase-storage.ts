import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://hlmvpikigkqvkvsqudxz.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_lvmeMjNYnLmEHo9F_LdXZw_oEA16wEP';

@Injectable({
  providedIn: 'root',
})
export class SupabaseStorageService {
  private readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
      },
    });
  }

  async uploadProductImage(file: File): Promise<string> {
    if (!file) {
      throw new Error('Debes seleccionar una imagen.');
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error } = await this.supabase.storage
      .from('productos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = this.supabase.storage.from('productos').getPublicUrl(fileName);

    return data.publicUrl;
  }

  async deleteProductImage(publicUrl: string): Promise<void> {
    if (!publicUrl) {
      return;
    }

    const marker = '/storage/v1/object/public/productos/';
    const markerIndex = publicUrl.indexOf(marker);
    if (markerIndex === -1) {
      return;
    }

    const filePath = decodeURIComponent(publicUrl.slice(markerIndex + marker.length));
    if (!filePath) {
      return;
    }

    const { error } = await this.supabase.storage.from('productos').remove([filePath]);
    if (error) {
      throw error;
    }
  }
}
