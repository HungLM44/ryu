"use client";

import React, { useState } from "react";
import { UPLOAD_BLOB_ENDPOINT } from "../api/azure-blob/route";

type Props = {
    open: boolean;
    onClose: () => void;
};

const UploadBlobDialog: React.FC<Props> = ({ open, onClose }) => {
    if (!open) return null;

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData) => {
        const name = formData.get("name") as string;
        const content = formData.get("content") as string;

        if (!name.trim()) {
            setError("Tên blob là bắt buộc.");
            return;
        }

        try {
            const res = await fetch(UPLOAD_BLOB_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, content }),
            });
        } catch (err) {
            console.error("Upload dialog error:", err);
            setError("Không thể upload blob.");
        }

        window.location.reload();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" role="dialog" aria-modal="true">
            <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded shadow-lg w-full max-w-2xl mx-4 p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4">Upload Blob</h2>

                {error && <div className="mb-3 text-red-600 dark:text-red-400">{error}</div>}

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                            Name
                            <input
                                name="name"
                                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                            Content
                            <textarea
                                name="content"
                                rows={8}
                                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                        </label>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-300"
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadBlobDialog;
