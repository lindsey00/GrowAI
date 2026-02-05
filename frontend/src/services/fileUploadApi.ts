import axios, { AxiosProgressEvent } from 'axios';

const API_BASE_URL = '/api';

/**
 * 업로드 진행 콜백
 */
export interface UploadProgressCallback {
  (progress: number): void;
}

/**
 * 파일 업로드 응답 (백엔드 API 응답 형식)
 */
export interface FileUploadResponse {
  success: boolean;
  fileId?: string;
  fileName?: string;
  originalFileName?: string;
  fileUrl?: string;
  contentType?: string;
  fileSize?: number;
  uploadedAt?: string;
  message?: string;
}

/**
 * 파일 목록 응답
 */
export interface FileListResponse {
  success: boolean;
  files?: FileItem[];
  totalCount?: number;
  message?: string;
}

/**
 * 파일 아이템
 */
export interface FileItem {
  fileId: string;
  fileName: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
}

/**
 * 파일 삭제 응답
 */
export interface FileDeleteResponse {
  success: boolean;
  fileId?: string;
  message?: string;
}

/**
 * 파일 업로드 옵션
 */
export interface FileUploadOptions {
  onProgress?: UploadProgressCallback;
  additionalData?: Record<string, string>;
}

/**
 * 단일 파일 업로드
 */
export async function uploadFile(
  file: File,
  options?: FileUploadOptions
): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  if (options?.additionalData) {
    Object.entries(options.additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  try {
    const response = await axios.post<FileUploadResponse>(
      `${API_BASE_URL}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total && options?.onProgress) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            options.onProgress(progress);
          }
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || '파일 업로드에 실패했습니다.',
      };
    }
    return {
      success: false,
      message: '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 다중 파일 업로드
 */
export async function uploadMultipleFiles(
  files: File[],
  options?: FileUploadOptions
): Promise<FileUploadResponse[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await axios.post<FileUploadResponse[]>(
      `${API_BASE_URL}/upload/multiple`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total && options?.onProgress) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            options.onProgress(progress);
          }
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return files.map(() => ({
        success: false,
        message: error.response?.data?.message || '파일 업로드에 실패했습니다.',
      }));
    }
    return files.map(() => ({
      success: false,
      message: '알 수 없는 오류가 발생했습니다.',
    }));
  }
}

/**
 * 파일 목록 조회
 */
export async function getFileList(): Promise<FileListResponse> {
  try {
    const response = await axios.get<FileListResponse>(`${API_BASE_URL}/files`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || '파일 목록을 가져오는데 실패했습니다.',
      };
    }
    return {
      success: false,
      message: '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 파일 다운로드 URL 생성
 */
export function getFileDownloadUrl(fileId: string): string {
  return `${API_BASE_URL}/files/${fileId}`;
}

/**
 * 파일 삭제
 */
export async function deleteFile(fileId: string): Promise<FileDeleteResponse> {
  try {
    const response = await axios.delete<FileDeleteResponse>(
      `${API_BASE_URL}/files/${fileId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || '파일 삭제에 실패했습니다.',
      };
    }
    return {
      success: false,
      message: '알 수 없는 오류가 발생했습니다.',
    };
  }
}
