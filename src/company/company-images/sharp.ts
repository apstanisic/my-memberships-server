import * as sharp from 'sharp';

/**
 * Compress and generate different sizes for saving to external services
 * @param image Image to be compressed, and generate different sizes
 */
export async function generateImages(image: Buffer): Promise<any> {
  const base = sharp(image);
  // .jpeg({ quality: 70 });
  const xs = base
    .clone()
    .resize(128, 128, { fit: 'cover' })
    .toBuffer();
  const sm = base
    .clone()
    .resize(320, 320, { fit: 'inside' })
    .toBuffer();
  const md = base
    .clone()
    .resize(640, 640, { fit: 'inside' })
    .toBuffer();
  const lg = base
    // .clone()
    .resize(1280, 1280, { fit: 'inside' })
    .toBuffer();

  // const xl = base.resize(sizes.xl.x, sizes.xl.y, { fit: 'inside' }).toBuffer();

  const buffers = await Promise.all([xs, sm, md, lg]);

  return {
    xs: buffers[0],
    sm: buffers[1],
    md: buffers[2],
    lg: buffers[3],
    // xl: buffers[4],
  };
}
