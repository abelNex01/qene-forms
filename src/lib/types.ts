export interface SignatureData {
  id: string;
  type: "font" | "image";
  data: string;
  name: string;
  timestamp: string;
  hash: string;
  style?: {
    fontFamily: string;
    fontSize: number;
    color: string;
  };
}
