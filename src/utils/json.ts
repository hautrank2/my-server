export const parseJson = <T>(v: unknown): T | undefined => {
  if (typeof v !== 'string') return v as T;
  try {
    return JSON.parse(v) as T;
  } catch {
    return v as T;
  }
};

export const parseToArray = <T = any>(v: unknown): T[] | undefined => {
  // Đã là array
  if (Array.isArray(v)) return v as T[];

  // Không phải string => trả về như cũ (có thể undefined/null)
  if (typeof v !== 'string') return v as any;

  // Thử JSON parse
  try {
    const j = JSON.parse(v);
    if (Array.isArray(j)) return j as T[];
    if (j != null) return [j as T];
  } catch {
    // Không phải JSON, rơi xuống CSV
  }

  // CSV: "a,b,c" -> ["a","b","c"]
  if (v.includes(',')) {
    return v
      .split(',')
      .map(s => s.trim())
      .filter(Boolean) as any;
  }

  // Chuỗi đơn lẻ -> [v]
  return v ? [v as any] : undefined;
};
