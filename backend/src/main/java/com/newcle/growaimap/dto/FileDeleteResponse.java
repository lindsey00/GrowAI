package com.newcle.growaimap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 파일 삭제 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileDeleteResponse {

    private boolean success;
    private String fileId;
    private String message;

    public static FileDeleteResponse success(String fileId) {
        return FileDeleteResponse.builder()
                .success(true)
                .fileId(fileId)
                .message("파일 삭제 성공")
                .build();
    }

    public static FileDeleteResponse error(String message) {
        return FileDeleteResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}
