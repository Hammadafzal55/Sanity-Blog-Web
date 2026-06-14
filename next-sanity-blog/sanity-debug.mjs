import fs from "fs";
import path from "path";
const envPath = path.resolve("./.env.local");
const envRaw = fs.readFileSync(envPath, "utf8");
for (const line of envRaw.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  let key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();
  if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
  process.env[key] = value;
}
import { createClient } from "next-sanity";
const baseConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-02-28",
  token: process.env.SANITY_API_READ_TOKEN,
};
for (const useCdn of [true, false]) {
  const client = createClient({ ...baseConfig, useCdn });
  try {
    const result = await client.fetch("*[_type == 'post'][0]{_id, title}");
    console.log('fetch ok', { useCdn, result });
  } catch (err) {
    console.error('fetch err', { useCdn, message: err.message, status: err.response?.statusCode, body: err.responseBody });
  }
}
