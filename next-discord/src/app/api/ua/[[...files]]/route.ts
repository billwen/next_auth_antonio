"use server";

/**
 * Reference: https://medium.com/@xhowais/next-js-file-upload-api-tutorial-local-directroy-7ec039efbd66
 *
 * How to upload files in Next.js
 * const fileInput = document.getElementById("fileInput"); // Replace with your HTML element ID
 * const file = fileInput.files[0];
 *
 * const formData = new FormData();
 * formData.append("file", file);
 *
 * fetch("/api/upload", {
 *   method: "POST",
 *   body: formData,
 * })
 *   .then(response => response.json())
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 *
 *   Send data
 *      var filePath = path.join(__dirname, 'myfile.mp3');
 *     var stat = fileSystem.statSync(filePath);
 *
 *     response.writeHead(200, {
 *         'Content-Type': 'audio/mpeg',
 *         'Content-Length': stat.size
 *     });
 *
 *     var readStream = fileSystem.createReadStream(filePath);
 *     // We replaced all the event handlers with a simple call to readStream.pipe()
 *     readStream.pipe(response);
 */

import {NextRequest, NextResponse} from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import * as Path from "path";

import {NextApiRequest, NextApiResponse} from "next";
import * as fs from "fs";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  console.log({file});
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename =  file.name.replaceAll(" ", "_");
  console.log(filename);
  try {
    await writeFile(
      path.join(process.cwd(), "uploaded/" + filename),
      buffer
    );
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occurred ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};

export const GET = async (req: NextApiRequest, { params}: {params: {files: string[]}}) => {

  const {files} = params;
  console.log({query: params});
  if (!files || !Array.isArray(files) || files.length === 0) {
    console.log(`Invalid url, ${files}`);
    return NextResponse.json({error: 'invalid url'}, {status: 401});
  }

  const uploadedFolder = Path.join(process.cwd(), "uploaded");
  const file = `${uploadedFolder}/${files[0]}`;
  const existing = fs.existsSync(file);
  if (!existing) {
    return NextResponse.json({error: 'file do not exit'}, {status: 402});
  }

  const stat = fs.statSync(file);
  const imgBuf = fs.readFileSync(file);
  try {
    const res = new NextResponse(imgBuf);
    res.headers.set('Content-Type', 'image/png');
    res.headers.set('Content-Length', `${stat.size}`);
    return res;
  } catch (e: any) {
    console.log(`Sending file ${file} failed: ${e.message}`);
    NextResponse.json({"error": true}, {status: 404});
  }

  return;
}
