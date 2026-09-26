import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function uploadAudio(fileName) {
    const filePath = path.join('../PDF', fileName);
    if (!fs.existsSync(filePath)) return null;
    const fileBuffer = fs.readFileSync(filePath);
    const storagePath = `cambridge-1/${fileName}`;
    const { error } = await supabase.storage.from('listening-audio').upload(storagePath, fileBuffer, { upsert: true, contentType: 'audio/mpeg' });
    if (error) {
        console.error('Error uploading', fileName, error);
        return null;
    }
    const { data: publicUrlData } = supabase.storage.from('listening-audio').getPublicUrl(storagePath);
    console.log(`Uploaded ${fileName}: ${publicUrlData.publicUrl}`);
    return publicUrlData.publicUrl;
}

async function run() {
    const tests = [2, 3, 4];
    const sections = [1, 2, 3, 4];
    for (const t of tests) {
        for (const s of sections) {
            await uploadAudio(`Test ${t} - Section ${s}.mp3`);
        }
    }
}
run();
