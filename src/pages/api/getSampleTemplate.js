import stream from 'stream';
import { promisify } from 'util';
import fetch from 'node-fetch';
//import path from 'path';
//import { cwd } from 'process';

const pipeline = promisify(stream.pipeline);
//const url = path.join(process.cwd(), '/template/pickitem_list.csv');
//const absolutePath = document.URL(url).href;
//const url = new URL(`https://aspirelifestylesglobal-my.sharepoint.com/:x:/r/personal/moiz_mala_aspirelifestyles_com/Documents/pickitem_list.csv?d=wfaa1714a745d47879c4eb0ba1f341fcb&csf=1&web=1&e=U0nIVO`).href;

const url = 'https://drive.google.com/uc?export=download&id=1bKoCm8LJbycy2W7Hm3Ft4roNEhwqOefw';

console.log(`url: ${url}`);

const handler = async (_req, res) => {
  const response = await fetch(url, {mode: 'no-cors'});
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);

  res.setHeader('Content-Type', 'application/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=SampleTemplate_list.csv');
  await pipeline(response.body, res);
};

export default handler;
