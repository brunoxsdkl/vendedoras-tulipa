declare class jsPDF {
  constructor(options?: { orientation?: string; unit?: string; format?: string });
  setFillColor(r: number, g: number, b: number): void;
  rect(x: number, y: number, w: number, h: number, style?: string): void;
  setFont(fontName: string, fontStyle?: string): void;
  setFontSize(size: number): void;
  setTextColor(r: number, g: number, b: number): void;
  getTextWidth(text: string): number;
  text(text: string, x: number, y: number, options?: { align?: string }): void;
  addPage(): void;
  save(filename: string): void;
}
