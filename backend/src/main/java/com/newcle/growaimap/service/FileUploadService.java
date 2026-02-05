package com.newcle.growaimap.service;

import com.newcle.growaimap.domain.FileInfo;
import com.newcle.growaimap.dto.FileDeleteResponse;
import com.newcle.growaimap.dto.FileListResponse;
import com.newcle.growaimap.dto.FileUploadResponse;
import com.newcle.growaimap.repository.FileInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 파일 업로드 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final FileInfoRepository fileInfoRepository;

    @Value("${file.upload.path:./uploads}")
    private String uploadPath;

    @Value("${file.upload.max-size:52428800}")
    private long maxFileSize;

    @Value("${file.upload.base-url:/api/files}")
    private String baseUrl;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "hwp"
    );

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain",
            "text/csv",
            "application/x-hwp",
            "application/haansofthwp"
    );

    /**
     * 파일 업로드
     */
    @Transactional
    public FileUploadResponse uploadFile(MultipartFile file) {
        log.info("파일 업로드 시작: {}", file.getOriginalFilename());

        try {
            // 파일 유효성 검사
            String validationError = validateFile(file);
            if (validationError != null) {
                log.warn("파일 유효성 검사 실패: {}", validationError);
                return FileUploadResponse.error(validationError);
            }

            // 파일 ID 및 저장 경로 생성
            String fileId = UUID.randomUUID().toString();
            String originalFileName = file.getOriginalFilename();
            String extension = getFileExtension(originalFileName);
            String storedFileName = fileId + "." + extension;

            // 날짜별 디렉토리 생성
            String dateDir = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            Path uploadDir = Paths.get(uploadPath, dateDir);
            Files.createDirectories(uploadDir);

            // 파일 저장
            Path filePath = uploadDir.resolve(storedFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            log.info("파일 저장 완료: {}", filePath);

            // DB 저장
            FileInfo fileInfo = FileInfo.builder()
                    .fileId(fileId)
                    .fileName(storedFileName)
                    .originalFileName(originalFileName)
                    .contentType(file.getContentType())
                    .fileSize(file.getSize())
                    .filePath(filePath.toString())
                    .fileUrl(baseUrl + "/" + fileId)
                    .status(FileInfo.FileStatus.ACTIVE)
                    .build();

            fileInfoRepository.save(fileInfo);

            log.info("파일 정보 DB 저장 완료: fileId={}", fileId);

            return FileUploadResponse.success(
                    fileId,
                    storedFileName,
                    originalFileName,
                    fileInfo.getFileUrl(),
                    file.getContentType(),
                    file.getSize()
            );

        } catch (IOException e) {
            log.error("파일 업로드 실패", e);
            return FileUploadResponse.error("파일 저장 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 여러 파일 업로드
     */
    @Transactional
    public List<FileUploadResponse> uploadFiles(List<MultipartFile> files) {
        log.info("다중 파일 업로드 시작: {} 개", files.size());
        return files.stream()
                .map(this::uploadFile)
                .collect(Collectors.toList());
    }

    /**
     * 파일 목록 조회
     */
    @Transactional(readOnly = true)
    public FileListResponse getFileList() {
        log.info("파일 목록 조회");

        List<FileInfo> files = fileInfoRepository.findByStatusOrderByCreatedAtDesc(FileInfo.FileStatus.ACTIVE);

        List<FileListResponse.FileItem> fileItems = files.stream()
                .map(f -> FileListResponse.FileItem.builder()
                        .fileId(f.getFileId())
                        .fileName(f.getFileName())
                        .originalFileName(f.getOriginalFileName())
                        .contentType(f.getContentType())
                        .fileSize(f.getFileSize())
                        .fileUrl(f.getFileUrl())
                        .uploadedAt(f.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        log.info("파일 목록 조회 완료: {} 개", fileItems.size());
        return FileListResponse.success(fileItems);
    }

    /**
     * 파일 삭제
     */
    @Transactional
    public FileDeleteResponse deleteFile(String fileId) {
        log.info("파일 삭제 시작: fileId={}", fileId);

        return fileInfoRepository.findByFileIdAndStatus(fileId, FileInfo.FileStatus.ACTIVE)
                .map(fileInfo -> {
                    // 실제 파일 삭제
                    try {
                        Path filePath = Paths.get(fileInfo.getFilePath());
                        Files.deleteIfExists(filePath);
                        log.info("물리 파일 삭제 완료: {}", filePath);
                    } catch (IOException e) {
                        log.warn("물리 파일 삭제 실패: {}", e.getMessage());
                    }

                    // DB에서 상태 변경 (소프트 삭제)
                    fileInfo.setStatus(FileInfo.FileStatus.DELETED);
                    fileInfoRepository.save(fileInfo);

                    log.info("파일 삭제 완료: fileId={}", fileId);
                    return FileDeleteResponse.success(fileId);
                })
                .orElseGet(() -> {
                    log.warn("파일을 찾을 수 없음: fileId={}", fileId);
                    return FileDeleteResponse.error("파일을 찾을 수 없습니다: " + fileId);
                });
    }

    /**
     * 파일 정보 조회
     */
    @Transactional(readOnly = true)
    public FileInfo getFileInfo(String fileId) {
        return fileInfoRepository.findByFileIdAndStatus(fileId, FileInfo.FileStatus.ACTIVE)
                .orElse(null);
    }

    /**
     * 파일 유효성 검사
     */
    private String validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return "파일이 비어있습니다";
        }

        if (file.getSize() > maxFileSize) {
            return "파일 크기가 제한을 초과합니다 (최대 " + (maxFileSize / 1024 / 1024) + "MB)";
        }

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isEmpty()) {
            return "파일 이름이 없습니다";
        }

        String extension = getFileExtension(originalFileName);
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            return "지원하지 않는 파일 형식입니다: " + extension;
        }

        return null;
    }

    /**
     * 파일 확장자 추출
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }
}
