import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ensureCacheDir, isAudioCached } from '@/lib/audio-cache';

const AUDIO_CACHE_DIR = path.join(process.cwd(), 'public', 'audio-cache');

export async function GET(request: NextRequest) {
  try {
    ensureCacheDir();
    
    const files = fs.readdirSync(AUDIO_CACHE_DIR).filter(file => file.endsWith('.mp3'));
    const cacheInfo = files.map(file => {
      const filePath = path.join(AUDIO_CACHE_DIR, file);
      const stats = fs.statSync(filePath);
      return {
        filename: file,
        size: stats.size,
        created: stats.birthtime,
        url: `/audio-cache/${file}`
      };
    });

    return NextResponse.json({
      totalFiles: files.length,
      totalSize: cacheInfo.reduce((sum, file) => sum + file.size, 0),
      files: cacheInfo
    });
  } catch (error) {
    console.error('Cache status error:', error);
    return NextResponse.json({ error: 'Failed to get cache status' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    ensureCacheDir();
    
    const files = fs.readdirSync(AUDIO_CACHE_DIR).filter(file => file.endsWith('.mp3'));
    let deletedCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(AUDIO_CACHE_DIR, file);
      fs.unlinkSync(filePath);
      deletedCount++;
    });

    return NextResponse.json({
      message: 'Cache cleared successfully',
      deletedFiles: deletedCount
    });
  } catch (error) {
    console.error('Cache clear error:', error);
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 });
  }
}
