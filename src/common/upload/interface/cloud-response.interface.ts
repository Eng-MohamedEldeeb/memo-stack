export interface ICloud {
  public_id: string
  secure_url: string
}

export interface ICloudFiles {
  folderId?: string
  paths: ICloud[]
}
