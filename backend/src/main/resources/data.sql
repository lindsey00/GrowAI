-- Mock Data for Development
-- 파일 업로드 테스트용 샘플 데이터

-- 샘플 파일 정보 (테스트용)
INSERT INTO file_info (file_id, file_name, original_file_name, content_type, file_size, file_path, file_url, status, uploaded_by, created_at, updated_at)
VALUES
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001.pdf', '제조공정분석_보고서.pdf', 'application/pdf', 2048576, './uploads/2024/01/15/550e8400-e29b-41d4-a716-446655440001.pdf', '/api/files/550e8400-e29b-41d4-a716-446655440001', 'ACTIVE', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002.xlsx', '품질데이터_2024.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 1536000, './uploads/2024/01/15/550e8400-e29b-41d4-a716-446655440002.xlsx', '/api/files/550e8400-e29b-41d4-a716-446655440002', 'ACTIVE', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003.docx', '설비유지보수_매뉴얼.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 512000, './uploads/2024/01/16/550e8400-e29b-41d4-a716-446655440003.docx', '/api/files/550e8400-e29b-41d4-a716-446655440003', 'ACTIVE', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
