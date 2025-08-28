import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const CLIPS_DIR = join(process.cwd(), 'public', 'workout-clips');

export async function GET() {
  try {
    if (!existsSync(CLIPS_DIR)) {
      return NextResponse.json({ clips: [] });
    }

    const files = await readdir(CLIPS_DIR);
    const clips = await Promise.all(
      files
        .filter(file => file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.avi'))
        .map(async (file) => {
          const filePath = join(CLIPS_DIR, file);
          const stats = await stat(filePath);
          return {
            name: file,
            path: `/workout-clips/${file}`,
            size: stats.size,
            uploaded: stats.mtime.toISOString(),
          };
        })
    );

    return NextResponse.json({ 
      clips: clips.sort((a, b) => b.uploaded.localeCompare(a.uploaded))
    });
  } catch (error) {
    console.error('Error reading clips:', error);
    return NextResponse.json(
      { error: 'Failed to read clips' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const video = formData.get('video') as File;
    
    if (!video) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    const bytes = await video.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Sanitize filename
    const fileName = video.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = join(CLIPS_DIR, fileName);
    
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true,
      file: {
        name: fileName,
        path: `/workout-clips/${fileName}`,
        size: buffer.length
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('name');
    
    if (!fileName) {
      return NextResponse.json(
        { error: 'No file name provided' },
        { status: 400 }
      );
    }

    const filePath = join(CLIPS_DIR, fileName);
    
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    await unlink(filePath);

    return NextResponse.json({ 
      success: true,
      message: `Deleted ${fileName}`
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}