import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");

for (const line of env.split(/\r?\n/)) {
  const i = line.indexOf("=");

  if (i > 0) {
    process.env[line.slice(0, i)] = line
      .slice(i + 1)
      .replace(/^"(.*)"$/, "$1");
  }
}

const { list } = await import("@vercel/blob");

const result = await list({
  prefix: "interviews/",
});

console.log(
  JSON.stringify(
    result.blobs.map((blob) => ({
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
      contentType: blob.contentType,
    })),
    null,
    2
  )
);