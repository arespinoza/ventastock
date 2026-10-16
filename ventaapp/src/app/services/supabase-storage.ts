import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const MAX_IMAGE_WIDTH = 360;
const MAX_IMAGE_HEIGHT = 480;
const JPEG_QUALITY = 0.82;
const PRODUCT_IMAGES_BUCKET = 'ventasbucket';

//export const SUPABASE_URL = 'https://hlmvpikigkqvkvsqudxz.supabase.co';
//export const SUPABASE_ANON_KEY = 'sb_publishable_lvmeMjNYnLmEHo9F_LdXZw_oEA16wEP';

export const SUPABASE_URL = 'https://ddavqgnppoxgypkjdbfs.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_cXo-ziQoAKjlCvhzuNXLKw_uLNWZEg3';

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

    const imagenOptimizada = await this.optimizarImagen(file);
    const fileName = `${Date.now()}-${imagenOptimizada.name.replace(/\s+/g, '-')}`;
    const { error } = await this.supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(fileName, imagenOptimizada, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = this.supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(fileName);

    return data.publicUrl;
  }

  private async optimizarImagen(file: File): Promise<File> {
    const url = URL.createObjectURL(file);

    try {
      const imagen = await new Promise<HTMLImageElement>((resolve, reject) => {
        const elemento = new Image();
        elemento.onload = () => resolve(elemento);
        elemento.onerror = () => reject(new Error('No se pudo leer la imagen seleccionada.'));
        elemento.src = url;
      });

      const escala = Math.min(
        MAX_IMAGE_WIDTH / imagen.naturalWidth,
        MAX_IMAGE_HEIGHT / imagen.naturalHeight,
        1
      );
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(imagen.naturalWidth * escala));
      canvas.height = Math.max(1, Math.round(imagen.naturalHeight * escala));

      const contexto = canvas.getContext('2d');
      if (!contexto) {
        throw new Error('No se pudo preparar la imagen para subirla.');
      }

      contexto.fillStyle = '#fff';
      contexto.fillRect(0, 0, canvas.width, canvas.height);
      contexto.drawImage(imagen, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          resultado => resultado
            ? resolve(resultado)
            : reject(new Error('No se pudo comprimir la imagen seleccionada.')),
          'image/jpeg',
          JPEG_QUALITY
        );
      });
      const nombre = file.name.replace(/\.[^.]+$/, '') || 'producto';

      return new File([blob], `${nombre}.jpg`, {
        type: 'image/jpeg',
        lastModified: file.lastModified,
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async deleteProductImage(publicUrl: string): Promise<void> {
    if (!publicUrl) {
      return;
    }

    const marker = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`;
    const markerIndex = publicUrl.indexOf(marker);
    if (markerIndex === -1) {
      return;
    }

    const filePath = decodeURIComponent(publicUrl.slice(markerIndex + marker.length));
    if (!filePath) {
      return;
    }

    const { error } = await this.supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([filePath]);
    if (error) {
      throw error;
    }
  }
}
