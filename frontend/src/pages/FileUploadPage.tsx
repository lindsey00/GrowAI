import FileUpload from '../components/FileUpload';
import { uploadMultipleFiles } from '../services/fileUploadApi';
import './FileUploadPage.css';

export default function FileUploadPage() {
  const handleFilesSelected = (files: File[]) => {
    console.log('선택된 파일:', files);
  };

  const handleUpload = async (files: File[]) => {
    console.log('업로드 시작:', files);

    const results = await uploadMultipleFiles(files, {
      onProgress: (progress) => {
        console.log(`업로드 진행률: ${progress}%`);
      },
    });

    console.log('업로드 결과:', results);
  };

  return (
    <div className="file-upload-page">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">문서 업로드</h1>
          <p className="page-description">
            분석할 문서를 업로드하세요. PDF, Word, Excel 등 다양한 형식을 지원합니다.
          </p>
        </div>

        <FileUpload
          onFilesSelected={handleFilesSelected}
          onUpload={handleUpload}
          maxFiles={10}
          maxSizeMB={50}
        />
      </div>
    </div>
  );
}
