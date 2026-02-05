package com.newcle.growaimap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 파일 목록 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileListResponse {

    private boolean success;
    private List<FileItem> files;
    private int totalCount;
    private String message;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FileItem {
        private String fileId;
        private String fileName;
        private String originalFileName;
        private String contentType;
        private Long fileSize;
        private String fileUrl;
        private LocalDateTime uploadedAt;
    }

    public static FileListResponse success(List<FileItem> files) {
        return FileListResponse.builder()
                .success(true)
                .files(files)
                .totalCount(files.size())
                .message("파일 목록 조회 성공")
                .build();
    }

    public static FileListResponse error(String message) {
        return FileListResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}
