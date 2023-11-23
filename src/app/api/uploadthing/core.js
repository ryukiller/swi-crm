import { createUploadthing } from "uploadthing/next";
import { verifyAccessToken } from '../../../lib/apiauth';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB" } })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            // This code runs on your server before upload

            // const unauthorizedResponse = await verifyAccessToken(req);
            // if (unauthorizedResponse) {
            //     throw new Error("Unauthorized")
            // }
            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: "team" };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code runs on your server after upload
            console.log("Upload complete for userId:", metadata.userId);

            console.log("file url", file.url);

            // Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId, fileUrl: file.url };
        }),
};

export default ourFileRouter;
