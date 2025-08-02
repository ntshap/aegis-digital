import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer (for future use with IPFS)
    const _buffer = Buffer.from(await file.arrayBuffer());
    
    // For now, return a mock IPFS hash
    // In production, you would integrate with IPFS/Pinata
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    return NextResponse.json({ 
      hash: mockHash,
      filename: file.name,
      size: file.size 
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
