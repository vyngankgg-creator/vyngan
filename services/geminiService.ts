
import { GoogleGenAI } from "@google/genai";
import { ImageData, AppTheme } from "../types";

export const generateScene = async (
  pedestal: ImageData,
  product: ImageData,
  theme: AppTheme,
  addFlowers: boolean,
  includePerson: boolean
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const flowerInstruction = addFlowers 
    ? "- CẮM HOA NGHỆ THUẬT: Nếu sản phẩm là bình hoặc lọ, hãy cắm thêm một bó hoa nghệ thuật có kích thước tương xứng. Hoa không được quá cao làm mất trọng tâm của ảnh."
    : "";

  const personInstruction = includePerson
    ? "- XUẤT HIỆN CON NGƯỜI: Có thêm người ở hậu cảnh hoặc bên cạnh để tạo cảm giác về quy mô không gian (scale). Người phải có kích thước thực tế so với đồ nội thất."
    : "- KHÔNG CÓ NGƯỜI: Tập trung hoàn toàn vào tĩnh vật.";

  const prompt = `
    Bạn là một chuyên gia dàn dựng Studio nội thất chuyên nghiệp. 
    Nhiệm vụ: Phối cảnh sản phẩm lên đôn gỗ trong không gian nhà ở thực tế, khung hình vuông (1:1).

    DỮ LIỆU ĐẦU VÀO:
    1. Ảnh đôn gỗ (pedestal).
    2. Ảnh sản phẩm decor (vật thể chính).

    YÊU CẦU VỀ TỶ LỆ VÀ KÍCH THƯỚC (CỰC KỲ QUAN TRỌNG):
    - TỶ LỆ CÂN XỨNG VẬT LÝ: Bạn phải phân tích diện tích mặt trên của đôn gỗ. Điều chỉnh sản phẩm sao cho ĐƯỜNG KÍNH ĐÁY của sản phẩm không vượt quá 80% chiều rộng mặt đôn. 
    - SẢN PHẨM KHÔNG ĐƯỢC QUÁ TO: Tuyệt đối không để sản phẩm tràn ra ngoài mép đôn hoặc trông khổng lồ so với đôn.
    - SẢN PHẨM KHÔNG ĐƯỢC QUÁ NHỎ: Sản phẩm phải là điểm nhấn trung tâm, không được lọt thỏm quá mức.
    - ĐỘNG LỰC HỌC & TRỌNG LỰC: Sản phẩm phải được đặt "lún" nhẹ vào bóng đổ trên mặt đôn để tạo cảm giác có khối lượng thật, không được trông như ảnh cắt dán.

    YÊU CẦU KỸ THUẬT:
    - CĂN CHỈNH ĐÔN 90 ĐỘ: Chỉnh góc đứng của đôn gỗ vuông góc hoàn hảo với mặt sàn.
    - XÓA ĐẾ CŨ: Loại bỏ hoàn toàn phần đế/nền cũ của sản phẩm, chỉ giữ lại phần thân và đặt lên đôn.
    - GIỮ NGUYÊN CHI TIẾT: Bảo toàn 100% vân gỗ của đôn và các chi tiết chạm trổ của sản phẩm.
    ${flowerInstruction}
    ${personInstruction}

    ÁNH SÁNG & KHÔNG GIAN:
    - KHÔNG GIAN: ${theme}.
    - ÁNH SÁNG TỔNG THỂ: Tạo luồng sáng đồng nhất từ một phía (key light) chiếu vào cả đôn và sản phẩm.
    - BÓNG ĐỔ (SHADOWS): Phải có bóng đổ mềm (soft shadows) từ sản phẩm xuống mặt đôn và từ đôn xuống sàn nhà theo đúng hướng sáng.
    - CHẤT LƯỢNG: Ảnh vuông 1:1, chất lượng như ảnh chụp catalogue nội thất cao cấp.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: pedestal.data, mimeType: pedestal.mimeType } },
          { inlineData: { data: product.data, mimeType: product.mimeType } },
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    let resultBase64 = '';
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          resultBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!resultBase64) {
      throw new Error("Không tìm thấy dữ liệu ảnh trong phản hồi.");
    }

    return resultBase64;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
