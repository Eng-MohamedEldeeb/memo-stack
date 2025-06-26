enum Files {
  'image/jpeg' = 'image/jpeg',
  'image/jpg' = 'image/jpg',
  'image/png' = 'image/png',
}

export type AcceptedFiles = keyof typeof Files
