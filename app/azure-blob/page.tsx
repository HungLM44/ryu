"use client";

import type { BlobNames } from "@/lib/blobService";
import React, { useEffect, useState } from "react";
import { GET_BLOB_NAMES_ENDPOINT, UPLOAD_BLOB_ENDPOINT } from "../api/azure-blob/route";

import UploadBlobDialog from "./UploadBlobDialog";

const AzureBlobPage = () => {
    const [blobNames, setBlobNames] = useState<BlobNames>([]);
    const [error, setError] = useState<string | null>(null);
    const [isUploadBlobOpen, setIsUploadBlobOpen] = useState(false);

    const fetchBlobs = async () => {
        try {
            const res = await fetch(GET_BLOB_NAMES_ENDPOINT);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = (await res.json()) as { blobNames: BlobNames };
            setBlobNames(data.blobNames);
        } catch (err) {
            console.error("/azure-blob page fetch error:", err);
            setError("Không thể tải danh sách blobs.");
        }
    };

    useEffect(() => {
        fetchBlobs();
    }, []);

    return (
        <main className="p-6">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setIsUploadBlobOpen(true)}>
                Upload Blob
            </button>
            <h1 className="text-2xl font-semibold mb-4">Danh sách blobs</h1>

            {error && <div className="mb-4 text-red-600">{error}</div>}

            {blobNames.length === 0 ? (
                <div className="text-gray-500">Không có blob nào.</div>
            ) : (
                <ul className="list-disc pl-5 space-y-1">
                    {blobNames.map((name) => (
                        <li key={name} className="break-words">
                            {name}
                        </li>
                    ))}
                </ul>
            )}

            <UploadBlobDialog
                open={isUploadBlobOpen}
                onClose={() => setIsUploadBlobOpen(false)}
            />
        </main>
    );
}

export default AzureBlobPage;
