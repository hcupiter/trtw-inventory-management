import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Dropbox } from "dropbox";
import { errorWriter } from "@/utils/errorWriter";

export async function POST() {
  try {
    const cookie = await cookies();
    const sessionToken = cookie.get("session")?.value;

    if (!sessionToken)
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 500 }
      );

    // Define the path to your SQLite database (adjust if needed)
    const dbPath = path.join(process.cwd(), "database.sqlite");

    // Check if the database file exists
    if (!fs.existsSync(dbPath))
      return NextResponse.json(
        { error: "Database tidak ditemukan" },
        { status: 404 }
      );

    // Read the database file into a Buffer
    const fileBuffer = fs.readFileSync(dbPath);

    const accessToken = process.env.DROPBOX_ACCESS_TOKEN;
    if (!accessToken)
      return NextResponse.json({ error: "No Access Token" }, { status: 404 });

    // Initialize Dropbox client
    const dbx = new Dropbox({
      accessToken: accessToken,
      fetch: fetch,
    });

    // Define the Dropbox path for the backup
    const dropboxPath = "/trtw-inventory-management/database_backup.sqlite";

    // Upload the file to Dropbox, overwriting if it exists
    const response = await dbx.filesUpload({
      path: dropboxPath,
      contents: fileBuffer,
      mode: { ".tag": "overwrite" },
    });

    if (response.status < 200 || response.status >= 300)
      return NextResponse.json({ error: "Failed to backup" }, { status: 500 });

    return NextResponse.json({ message: `Backup sukses` }, { status: 200 });
  } catch (error) {
    console.log("Error at api/backup: ", error);
    return NextResponse.json({ error: errorWriter(error) }, { status: 500 });
  }
}
