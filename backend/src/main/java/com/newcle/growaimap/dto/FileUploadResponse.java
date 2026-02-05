package com.newcle.growaimap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 파일 업로드 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadResponse {

    private boolean success;
    private String fileId;
    private String fileName;
    private String originalFileName;
    private String fileUrl;
    private String contentType;
    private Long fileSize;
    private LocalDateTime uploadedAt;
    private String message;

    public static FileUploadResponse success(String fileId, String fileName, String originalFileName,
                                              String fileUrl, String contentType, Long fileSize) {
        return FileUploadResponse.builder()
                .success(true)
                .fileId(fileId)
                .fileName(fileName)
                .originalFileName(originalFileName)
                .fileUrl(fileUrl)
                .contentType(contentType)
                .fileSize(fileSize)
                .uploadedAt(LocalDateTime.now())
                .message("파일 업로드 성공")
                .build();
    }

    public static FileUploadResponse error(String message) {
        return FileUploadResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}
