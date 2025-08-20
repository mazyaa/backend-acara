import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

export function single(fieldName: string) {
  return upload.single(fieldName);
}

export function multiple(fieldName: string) {
  return upload.array(fieldName);
}
