import { collection, getDocs, query, where } from 'firebase/firestore';
import {
  HUAYOPATA_REEL_PHOTOS,
  PROPERTIES,
  VALLEY_ZONES,
  type FilmReelPhoto,
  type PropertyItem,
  type ValleyZone,
} from '../data/valleyData';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface HydratedCatalogData {
  reelPhotos: FilmReelPhoto[];
  properties: PropertyItem[];
  zones: ValleyZone[];
  fromFirestore: boolean;
}

const preloadedUrls = new Set<string>();

export function preloadImageUrl(url: string | undefined): void {
  if (!url || typeof window === 'undefined' || preloadedUrls.has(url)) return;
  preloadedUrls.add(url);
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
}

function resolveBaseUrlPath(rawPath: string): string {
  if (!rawPath) return rawPath;
  if (/^https?:\/\//i.test(rawPath) || rawPath.startsWith('data:')) {
    return rawPath;
  }
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = rawPath.replace(/^\/+/, '');
  if (cleanPath.startsWith(normalizedBase.replace(/^\/+/, ''))) {
    return `/${cleanPath}`;
  }
  return `${normalizedBase}${cleanPath}`;
}

export async function fetchVisualCatalogFromFirestore(): Promise<HydratedCatalogData> {
  const fallback: HydratedCatalogData = {
    reelPhotos: HUAYOPATA_REEL_PHOTOS,
    properties: PROPERTIES,
    zones: VALLEY_ZONES,
    fromFirestore: false,
  };

  try {
    const [mediaSnap, propSnap, zoneSnap] = await Promise.all([
      getDocs(query(collection(db, 'media_assets'), where('published', '==', true))).catch((err) => {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('Missing or insufficient permissions')) {
          handleFirestoreError(err, OperationType.LIST, 'media_assets');
        }
        return null;
      }),
      getDocs(query(collection(db, 'properties'), where('published', '==', true))).catch((err) => {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('Missing or insufficient permissions')) {
          handleFirestoreError(err, OperationType.LIST, 'properties');
        }
        return null;
      }),
      getDocs(query(collection(db, 'zones'), where('published', '==', true))).catch((err) => {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('Missing or insufficient permissions')) {
          handleFirestoreError(err, OperationType.LIST, 'zones');
        }
        return null;
      }),
    ]);

    let hasFirestoreDocs = false;

    let reelPhotos = HUAYOPATA_REEL_PHOTOS;
    if (mediaSnap && !mediaSnap.empty) {
      const reelDocs = mediaSnap.docs
        .map((d) => ({
          id: d.id,
          data: d.data() as Record<string, unknown>,
        }))
        .filter((item) => item.data['section'] === 'reel')
        .sort((a, b) => Number(a.data['sortOrder'] ?? 0) - Number(b.data['sortOrder'] ?? 0));

      if (reelDocs.length > 0) {
        hasFirestoreDocs = true;
        reelPhotos = reelDocs.map(({ id, data }) => ({
          id,
          src: resolveBaseUrlPath(String(data['fullUrl'] ?? '')),
          thumb: resolveBaseUrlPath(String(data['thumbUrl'] ?? data['fullUrl'] ?? '')),
          title: String(data['titleEs'] ?? ''),
          caption: String(data['captionEs'] ?? ''),
        }));
      }
    }

    let properties = PROPERTIES;
    if (propSnap && !propSnap.empty) {
      hasFirestoreDocs = true;
      const byId = new Map<string, PropertyItem>(PROPERTIES.map((p) => [p.id, p]));
      const merged: PropertyItem[] = [];

      const sortedDocs = [...propSnap.docs].sort(
        (a, b) => Number(a.data().displayOrder ?? 99) - Number(b.data().displayOrder ?? 99),
      );

      for (const docSnap of sortedDocs) {
        const data = docSnap.data() as Record<string, unknown>;
        const base = byId.get(docSnap.id);
        const images = Array.isArray(data.images)
          ? data.images.map((u) => resolveBaseUrlPath(String(u)))
          : base?.images ?? [];
        const thumbUrl = data.thumbUrl
          ? resolveBaseUrlPath(String(data.thumbUrl))
          : base?.thumbImages?.[0];

        if (base) {
          merged.push({
            ...base,
            title: typeof data.title === 'string' ? data.title : base.title,
            priceUsd: typeof data.priceUsd === 'number' ? data.priceUsd : base.priceUsd,
            altitude: typeof data.altitude === 'string' ? data.altitude : base.altitude,
            sunarpStatus:
              typeof data.sunarpStatus === 'string' ? data.sunarpStatus : base.sunarpStatus,
            summary: typeof data.summary === 'string' ? data.summary : base.summary,
            description:
              typeof data.description === 'string' ? data.description : base.description,
            images: images.length > 0 ? images : base.images,
            thumbImages: thumbUrl
              ? [thumbUrl, ...(base.thumbImages?.slice(1) ?? [])]
              : base.thumbImages,
          });
        }
      }

      if (merged.length > 0) {
        properties = merged;
      }
    }

    let zones = VALLEY_ZONES;
    if (zoneSnap && !zoneSnap.empty) {
      hasFirestoreDocs = true;
      const docMap = new Map(zoneSnap.docs.map((d) => [d.id, d.data() as Record<string, unknown>]));
      zones = VALLEY_ZONES.map((z) => {
        const remote = docMap.get(z.id);
        if (!remote) return z;
        return {
          ...z,
          image: typeof remote.imageUrl === 'string' ? resolveBaseUrlPath(remote.imageUrl) : z.image,
          thumb: typeof remote.thumbUrl === 'string' ? resolveBaseUrlPath(remote.thumbUrl) : z.thumb,
          video: typeof remote.videoUrl === 'string' ? resolveBaseUrlPath(remote.videoUrl) : z.video,
          poster:
            typeof remote.posterUrl === 'string' ? resolveBaseUrlPath(remote.posterUrl) : z.poster,
        };
      });
    }

    return {
      reelPhotos,
      properties,
      zones,
      fromFirestore: hasFirestoreDocs,
    };
  } catch {
    return fallback;
  }
}
