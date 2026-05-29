import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

/**
 * Trả về singleton `BlobServiceClient`.
 * Sử dụng `process.env.AZURE_BLOB_CONNECTION_STRING`.
 */
let blobServiceClient: BlobServiceClient | null = null;
export const getBlobServiceClient = (): BlobServiceClient => {
  if (blobServiceClient) return blobServiceClient;

  const connStr = process.env.AZURE_BLOB_CONNECTION_STRING;
  if (!connStr) {
    throw new Error(
      "Azure Blob connection string is not provided. Set AZURE_BLOB_CONNECTION_STRING."
    );
  }

  blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
  return blobServiceClient;
};

/**
 * Trả về singleton `BlobContainerClient`.
 * Sử dụng `process.env.AZURE_BLOB_CONTAINER_NAME`.
 */
let blobContainerClient: ContainerClient | null = null;
export const getBlobContainerClient = (): ContainerClient => {
  if (blobContainerClient) return blobContainerClient;

  const containerName = process.env.AZURE_BLOB_CONTAINER_NAME;
  if (!containerName) {
    throw new Error(
      "Azure Blob container name is not provided. Set AZURE_BLOB_CONTAINER_NAME."
    );
  }

  blobContainerClient = getBlobServiceClient().getContainerClient(containerName);
  return blobContainerClient;
};


/**
 * Lấy danh sách tên blob trong Blob Container.
 */
export type BlobNames = string[];
export const getBlobNames = async (): Promise<BlobNames> => {
  const containerClient = getBlobContainerClient();

  const names: BlobNames = [];
  for await (const blob of containerClient.listBlobsFlat()) {
    if (blob.name) names.push(blob.name);
  }
  return names;
};

/**
 * Upload blob mới.
 */
export type Blob = { name: string; content: string };
export const uploadBlob = async (blob: Blob) => {
  const containerClient = getBlobContainerClient();
  const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
  await blockBlobClient.upload(blob.content, blob.content.length);
};
