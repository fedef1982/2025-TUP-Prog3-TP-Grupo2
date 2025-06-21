import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const userId = formData.get('userId') as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const savedPaths: string[] = [];

    for (const file of files) {
      // Crear estructura de carpetas: public/images/[userId]
      const userDir = path.join(process.cwd(), 'public', 'images', userId);
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }

      // Generar nombre de archivo con fecha y hora
      const now = new Date();
      const dateString = now.toISOString().replace(/[:.]/, '-');
      const extension = file.name.split('.').pop();
      const fileName = `${dateString}.${extension}`;
      const relativePath = path.join(userId, fileName);
      const fullPath = path.join(userDir, fileName);

      // Guardar archivo
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(fullPath, buffer);
      savedPaths.push(relativePath);
    }

    return NextResponse.json({ savedPaths });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}