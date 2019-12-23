export const validImage = {
  limits: { fileSize: 1024 * 1024 * 0.5 }, // 0.5 mb
  fileFilter: (req: any, file: any, done: any): void => {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg') {
      done(null, false);
    } else {
      done(null, true);
    }
  },
};
