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
 */

import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export const POST = async (req, res) => {
  const formData = await req.formData();

  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename =  file.name.replaceAll(" ", "_");
  console.log(filename);
  try {
    await writeFile(
      path.join(process.cwd(), "public/assets/" + filename),
      buffer
    );
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};

