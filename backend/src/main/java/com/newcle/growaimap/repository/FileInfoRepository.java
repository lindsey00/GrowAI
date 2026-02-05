package com.newcle.growaimap.repository;

import com.newcle.growaimap.domain.FileInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 파일 정보 Repository
 */
@Repository
public interface FileInfoRepository extends JpaRepository<FileInfo, String> {

    List<FileInfo> findByStatusOrderByCreatedAtDesc(FileInfo.FileStatus status);

    Optional<FileInfo> findByFileIdAndStatus(String fileId, FileInfo.FileStatus status);

    List<FileInfo> findByUploadedByAndStatusOrderByCreatedAtDesc(String uploadedBy, FileInfo.FileStatus status);
}
