import { Blob, getBlobNames, uploadBlob } from "@/lib/blobService";

/**
 * GET /api/azure-blob
 * Trả về danh sách tên blob dưới dạng JSON `{ blobs: string[] }`.
 */
export const GET_BLOB_NAMES_ENDPOINT = "/api/azure-blob";
export const GET = async () => {
    try {
        const blobNames = await getBlobNames();
        return Response.json({ blobNames });
    } catch (err) {
        console.error("/api/azure-blob error:", err);
        return Response.error();
    }
};

/**
 * POST /api/azure-blob
 * Upload blob mới. Yêu cầu body JSON `{ name: string, content: string }`.
 **/
export const UPLOAD_BLOB_ENDPOINT = "/api/azure-blob";
export const POST = async (req: Request) => {
    try {
        const blob = (await req.json()) as Blob;
        await uploadBlob(blob);
        return Response.json({ message: "Blob uploaded successfully." });
    } catch (err) {
        console.error("/api/azure-blob error:", err);
        return Response.error();
    }
};

export default GET;
