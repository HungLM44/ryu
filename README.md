
# Ryu

Ứng dụng demo liệt kê và upload blob lên Azure Blob Storage bằng NextJS (TypeScript).

## Yêu cầu
- `Node.js`

## Cài đặt nhanh (khi pull code xuống)

1. Clone dự án:

```bash
git clone --single-branch --branch azure-blob https://github.com/HungLM44/ryu.git
cd ryu
```

2. Cài dependencies:

```bash
npm install
```

3. Tạo file `.env` có nội dung giống với file `.env.example`

- Lấy `AZURE_BLOB_CONNECTION_STRING` từ `Azure Portal → Resource Group → <My Resource Group>  → <My storage account>  → Security and network  → Access key` để lấy `Connection string`. 
- Lấy `AZURE_BLOB_CONTAINER_NAME` từ `Azure Portal → Resource Group → <My Resource Group>  → <My storage account>  → Container` để lấy tên của container muốn kết nối.

4. Chạy ở chế độ phát triển:

```bash
npm run dev
```

Mở http://localhost:3000 và trang quản lý blob tại `/azure-blob`.

## Endpoint API chính
- `GET /api/azure-blob` — trả về danh sách tên blob (JSON).
- `POST /api/azure-blob` — upload blob mới. Body JSON request: `{ "name": "...", "content": "..." }`.
- `GET /api/health` — trạng thái server.

## File quan trọng
- Logic tương tác với Azure: [lib/blobService.ts](lib/blobService.ts)
- API Azure Blob: [app/api/azure-blob/route.ts](app/api/azure-blob/route.ts)
- Giao diện quản lý blob: [app/azure-blob/page.tsx](app/azure-blob/page.tsx)
- Dialog upload: [app/azure-blob/UploadBlobDialog.tsx](app/azure-blob/UploadBlob.tsx)

## Lỗi thường gặp
- Nếu ứng dụng ném lỗi: "Azure Blob connection string is not provided..." → kiểm tra `.env` và chạy lại

```bash
npm run dev
```
