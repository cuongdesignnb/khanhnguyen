/**
 * @deprecated Dùng `lib/media/upload-media-file.ts` cho toàn bộ upload Media mới.
 * Wrapper này chỉ giữ tương thích cho mã cũ trong thời gian chuyển đổi.
 */
export { uploadMediaFile as handleUpload } from './media/upload-media-file'
export type { StoredMediaFile as UploadResult } from './media/upload-media-file'
