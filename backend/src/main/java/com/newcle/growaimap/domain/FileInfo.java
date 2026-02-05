package com.newcle.growaimap.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 업로드 파일 정보 Entity
 */
@Entity
@Table(name = "file_info")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileInfo {

    @Id
    @Column(name = "file_id", length = 36)
    private String fileId;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "original_file_name", nullable = false, length = 500)
    private String originalFileName;

    @Column(name = "content_type", length = 100)
    private String contentType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "file_path", length = 1000)
    private String filePath;

    @Column(name = "file_url", length = 1000)
    private String fileUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    @Builder.Default
    private FileStatus status = FileStatus.ACTIVE;

    @Column(name = "uploaded_by", length = 100)
    private String uploadedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum FileStatus {
        ACTIVE,
        DELETED,
        PROCESSING
    }
}
