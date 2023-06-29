import fs from "fs";
import path from "path";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

import { verifyJwt } from "../../../lib/jwt.js";

export async function verifyAccessToken(request) {
  const accessToken = request.headers["authorization"].split(" ")[1];
  if (!accessToken || !verifyJwt(accessToken)) {
    return new Response(
      JSON.stringify({
        error: "unauthorized",
      }),
      {
        status: 401,
      }
    );
  }
  return null;
}

export default async function handler(req, res) {
  const unauthorizedResponse = await verifyAccessToken(req);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: "Error parsing the uploaded file." });
      return;
    }

    if (!files.files) {
      res.status(400).json({ error: "No file was uploaded." });
      return;
    }

    // If multiple files are uploaded, files.files will be an array
    // If a single file is uploaded, it will be an object
    // So, ensure we're always working with an array for consistency
    const fileList = Array.isArray(files.files) ? files.files : [files.files];
    let imgPaths = [];

    // Loop over all uploaded files
    fileList.forEach((file) => {
      const date = new Date();
      const stamp = date.getTime();

      const fileName =
        stamp + "-" + file.originalFilename.replace(/\s+/g, "-").toLowerCase();

      const filePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        fields.directory[0],
        fileName
      );
      imgPaths.push(path.join("/uploads", fields.directory[0], fileName));

      fs.copyFile(file.filepath, filePath, (err) => {
        if (err) {
          res.status(500).json({ error: "Error copying the file." });
          return;
        }
        //res.status(200).json({ success: true, images: filePath });
      });
    });

    res.status(200).json({ success: true, images: imgPaths });
  });
}
