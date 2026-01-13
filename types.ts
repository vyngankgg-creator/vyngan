
export interface GenerationState {
  pedestalImage: string | null;
  productImage: string | null;
  resultImage: string | null;
  isGenerating: boolean;
  error: string | null;
  theme: string;
  addFlowers: boolean;
  includePerson: boolean;
}

export enum AppTheme {
  TV_SHELF_SIDE = "Bên cạnh Kệ Tivi",
  SOFA_SIDE = "Cạnh Bàn Sofa",
  ROOM_CORNER = "Góc Phòng Khách",
  ENTRANCE_HALL = "Sảnh Đón Khách",
  OFFICE_CORNER = "Góc Phòng Làm Việc",
  WINDOW_SIDE = "Cạnh Cửa Sổ Lớn"
}

export interface ImageData {
  data: string;
  mimeType: string;
}
