import QRCode from "qrcode";

export const generateQrPngBuffer = async (url: string): Promise<Buffer> => {
  return QRCode.toBuffer(url, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 2,
    width: 512,
  });
};
