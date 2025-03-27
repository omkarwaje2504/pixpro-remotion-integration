import { NextResponse } from 'next/server';
import { mkdirSync, existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // Convert File to Buffer and generate path
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const inputName = `${timestamp}-${file.name}`;
    const inputPath = `/tmp/${inputName}`;
    const outputName = `${timestamp}.mp3`;
    const outputDir = path.join(process.cwd(), 'public/uploads/audio');
    const outputPath = path.join(outputDir, outputName);

    // Ensure the directory exists
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Write the original uploaded file to disk
    await fs.writeFile(inputPath, buffer);

    // Run FFmpeg to convert audio to .mp3
    const command = `ffmpeg -y -i "${inputPath}" -vn -ar 44100 -ac 2 -b:a 192k "${outputPath}"`;
    await execAsync(command);

    const publicUrl = `/uploads/audio/${outputName}`;

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('[Audio Upload Error]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
