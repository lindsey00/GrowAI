package com.newcle.growaimap.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

/**
 * ROI 시뮬레이션 요청 DTO
 */
@Data
public class RoiSimulationRequest {

    @NotBlank(message = "진단 ID는 필수입니다")
    private String diagnosisId;

    @PositiveOrZero(message = "인건비는 0 이상이어야 합니다")
    private Double laborCost;

    @PositiveOrZero(message = "불량률은 0 이상이어야 합니다")
    private Double defectRate;

    @PositiveOrZero(message = "에너지 비용은 0 이상이어야 합니다")
    private Double energyCost;

    @PositiveOrZero(message = "탄소 배출량은 0 이상이어야 합니다")
    private Double carbonEmission;

    @NotBlank(message = "솔루션 타입은 필수입니다")
    private String solutionType; // STANDARD or CUSTOM

}
