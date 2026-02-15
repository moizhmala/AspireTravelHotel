import type { NextApiRequest, NextApiResponse } from "next";
import { getExportProgress } from "./exportProgressStore";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Cache-Control", "no-store");

  res.status(200).json({
    progress: getExportProgress(),
  });
}






// import type { NextApiRequest, NextApiResponse } from "next";

// /**
//  * Simple in-memory progress store
//  * (per server instance)
//  */
// let progress = 0;

// export function setExportProgress(value: number) {
//   progress = Math.min(100, Math.max(0, value));
// }

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   // 🚫 Disable ALL caching
//   res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//   res.setHeader("Pragma", "no-cache");
//   res.setHeader("Expires", "0");
//   res.setHeader("Surrogate-Control", "no-store");

//   res.status(200).json({ progress });
// }

