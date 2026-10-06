import sharp from 'sharp';

export const compressAvatar = img => {
  return sharp(img)
    .resize(100, 100, { withoutEnlargement: true })
    .toFormat('webp', { quality: 85, effort: 4, smartSubsample: true })
    .toBuffer({ resolveWithObject: true });
};

export const compressImg = img => {
  return sharp(img)
    .resize(1080, 1080, { fit: 'inside', withoutEnlargement: true })
    .toFormat('webp', { quality: 85, effort: 4, smartSubsample: true })
    .toBuffer({ resolveWithObject: true });
};
