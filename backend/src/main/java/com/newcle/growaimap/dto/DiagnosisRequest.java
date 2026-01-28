package com.newcle.growaimap.dto;

import com.newcle.growaimap.domain.AgonyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

/**
 * 자가진단 요청 DTO
 */
@Data
public class DiagnosisRequest {

    @NotBlank(message = "기업 ID는 필수입니다")
    private String companyId;

    @NotBlank(message = "산업 유형은 필수입니다")
    private String industryType;

    @Positive(message = "직원 수는 양수여야 합니다")
    private Integer employeeCount;

    @Positive(message = "연 매출은 양수여야 합니다")
    private Long annualRevenue;

    @NotEmpty(message = "답변은 최소 1개 이상이어야 합니다")
    private List<Answer> answers;

    @Data
    public static class Answer {
        @NotBlank(message = "질문 ID는 필수입니다")
        private String questionId;

        private AgonyType agonyType;

        @Positive(message = "점수는 1~5 사이여야 합니다")
        private Integer score;
    }

}
