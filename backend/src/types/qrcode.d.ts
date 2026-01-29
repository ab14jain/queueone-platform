declare module 'qrcode' {
  export function toBuffer(
    text: string,
    options?: {
      type?: string;
      errorCorrectionLevel?: string;
      margin?: number;
      width?: number;
    }
  ): Promise<Buffer>;
}
