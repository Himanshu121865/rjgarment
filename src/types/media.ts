export interface MediaFile {
  name: string;
  url: string;
  type: "image" | "video" | "other";
  size: number;
  createdAt: string;
  displayName: string;
  price: number;
  category: string;
}
