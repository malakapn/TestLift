import * as XLSX from "xlsx";
import mammoth from "mammoth";

export async function extractFileText(file: File) {
  const fileName = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (fileName.endsWith(".csv")) {
    return buffer.toString("utf-8");
  }

  if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return "";
    const firstSheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_csv(firstSheet);
  }

  if (fileName.endsWith(".docx")) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }

  throw new Error("Unsupported file type. Use .xlsx, .csv, or .docx");
}
