// Free-licence photos from Unsplash (https://unsplash.com/license), used for service categories and
// marketing sections only — never as photos of real Wease professionals.
const SERVICE_PHOTOS = {
  ELECTRICIAN: "photo-1621905251189-08b45d6a269e",
  PLUMBER: "photo-1749532125405-70950966b0e5",
  CARPENTER: "photo-1561297331-a9c00b9c2c44",
  PAINTER: "photo-1562259949-e8e7689d7828",
  CLEANER: "photo-1758273238415-01ec03d9ef27",
  MASON: "photo-1761986757577-140af8859587",
  LABOURER: "photo-1587582423116-ec07293f0395",
  // AC_TECHNICIAN: no suitable photo yet; the icon illustration is used instead.
};

export const MARKETING_PHOTOS = {
  painting: "photo-1717281234297-3def5ae3eee1",
  electrician: SERVICE_PHOTOS.ELECTRICIAN,
  cleaning: SERVICE_PHOTOS.CLEANER,
  carpentry: SERVICE_PHOTOS.CARPENTER,
};

export function unsplashUrl(photoId, width = 800) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=70`;
}

// Returns a sized photo URL for a service, or null when there is no photo for it.
export function serviceImage(profession, width = 800) {
  const id = SERVICE_PHOTOS[profession];
  return id ? unsplashUrl(id, width) : null;
}
