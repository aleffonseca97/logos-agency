import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";
import toIco from "to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const brandingDir = join(publicDir, "branding");

const sourcePath =
  process.argv[2] ??
  join(
    root,
    "../.cursor/projects/c-Users-alef-Desktop-Projetos-logos-agency/assets/c__Users_alef__AppData_Roaming_Cursor_User_workspaceStorage_273b11af8ba6412552cb5cd7bb21ad9a_images_Icone-2fd00378-eaac-4973-a45e-8b584c851d73.png",
  );

async function prepareSquareSource() {
  const trimmed = await sharp(sourcePath).trim({ threshold: 15 }).png().toBuffer();
  const { width = 0, height = 0 } = await sharp(trimmed).metadata();
  const size = Math.max(width, height);

  return sharp(trimmed)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function writePng(source, size, outputPath) {
  await sharp(source)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outputPath);
}

async function main() {
  await mkdir(brandingDir, { recursive: true });

  const squareSource = await prepareSquareSource();
  const logoIconPath = join(brandingDir, "logo-icon.png");

  await sharp(squareSource)
    .resize(1024, 1024, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(logoIconPath);

  const outputs = [
    { size: 16, path: join(publicDir, "favicon-16x16.png") },
    { size: 32, path: join(publicDir, "favicon-32x32.png") },
    { size: 180, path: join(publicDir, "apple-touch-icon.png") },
    { size: 192, path: join(publicDir, "android-chrome-192x192.png") },
    { size: 512, path: join(publicDir, "android-chrome-512x512.png") },
  ];

  for (const { size, path } of outputs) {
    await writePng(squareSource, size, path);
  }

  const favicon16 = await sharp(squareSource)
    .resize(16, 16, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const favicon32 = await sharp(squareSource)
    .resize(32, 32, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const ico = await toIco([favicon16, favicon32]);
  await writeFile(join(publicDir, "favicon.ico"), ico);

  console.log("Icons generated successfully.");
  console.log(`Source: ${sourcePath}`);
  console.log(`Master: ${logoIconPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
