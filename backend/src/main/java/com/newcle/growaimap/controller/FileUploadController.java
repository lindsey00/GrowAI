package com.newcle.growaimap.controller;

import com.newcle.growaimap.domain.FileInfo;
import com.newcle.growaimap.dto.FileDeleteResponse;
import com.newcle.growaimap.dto.FileListResponse;
import com.newcle.growaimap.dto.FileUploadResponse;
import com.newcle.growaimap.service.FileUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * 파일 업로드 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "File Upload", description = "파일 업로드 API")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    /**
     * 단일 파일 업로드
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "파일 업로드", description = "단일 파일을 업로드합니다")
    public ResponseEntity<FileUploadResponse> uploadFile(
            @Parameter(description = "업로드할 파일")
            @RequestParam("file") MultipartFile file) {

        log.info("POST /api/upload - 파일 업로드 요청: {}", file.getOriginalFilename());

        FileUploadResponse response = fileUploadService.uploadFile(file);

        if (response.isSuccess()) {
            log.info("파일 업로드 성공: fileId={}", response.getFileId());
            return ResponseEntity.ok(response);
        } else {
            log.warn("파일 업로드 실패: {}", response.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 다중 파일 업로드
     */
    @PostMapping(value = "/upload/multiple", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "다중 파일 업로드", description = "여러 파일을 한 번에 업로드합니다")
    public ResponseEntity<List<FileUploadResponse>> uploadMultipleFiles(
            @Parameter(description = "업로드할 파일 목록")
            @RequestParam("files") List<MultipartFile> files) {

        log.info("POST /api/upload/multiple - 다중 파일 업로드 요청: {} 개", files.size());

        List<FileUploadResponse> responses = fileUploadService.uploadFiles(files);

        long successCount = responses.stream().filter(FileUploadResponse::isSuccess).count();
        log.info("다중 파일 업로드 완료: 성공={}, 실패={}", successCount, files.size() - successCount);

        return ResponseEntity.ok(responses);
    }

    /**
     * 파일 목록 조회
     */
    @GetMapping("/files")
    @Operation(summary = "파일 목록 조회", description = "업로드된 파일 목록을 조회합니다")
    public ResponseEntity<FileListResponse> getFileList() {
        log.info("GET /api/files - 파일 목록 조회 요청");

        FileListResponse response = fileUploadService.getFileList();
        return ResponseEntity.ok(response);
    }

    /**
     * 파일 다운로드
     */
    @GetMapping("/files/{fileId}")
    @Operation(summary = "파일 다운로드", description = "파일을 다운로드합니다")
    public ResponseEntity<Resource> downloadFile(
            @Parameter(description = "파일 ID")
            @PathVariable String fileId) {

        log.info("GET /api/files/{} - 파일 다운로드 요청", fileId);

        FileInfo fileInfo = fileUploadService.getFileInfo(fileId);

        if (fileInfo == null) {
            log.warn("파일을 찾을 수 없음: fileId={}", fileId);
            return ResponseEntity.notFound().build();
        }

        try {
            Path filePath = Paths.get(fileInfo.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                log.warn("파일을 읽을 수 없음: {}", filePath);
                return ResponseEntity.notFound().build();
            }

            String contentDisposition = "attachment; filename=\"" +
                    fileInfo.getOriginalFileName() + "\"";

            log.info("파일 다운로드 성공: fileId={}", fileId);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(fileInfo.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                    .body(resource);

        } catch (MalformedURLException e) {
            log.error("파일 다운로드 실패", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 파일 삭제
     */
    @DeleteMapping("/files/{fileId}")
    @Operation(summary = "파일 삭제", description = "파일을 삭제합니다")
    public ResponseEntity<FileDeleteResponse> deleteFile(
            @Parameter(description = "파일 ID")
            @PathVariable String fileId) {

        log.info("DELETE /api/files/{} - 파일 삭제 요청", fileId);

        FileDeleteResponse response = fileUploadService.deleteFile(fileId);

        if (response.isSuccess()) {
            log.info("파일 삭제 성공: fileId={}", fileId);
            return ResponseEntity.ok(response);
        } else {
            log.warn("파일 삭제 실패: {}", response.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
