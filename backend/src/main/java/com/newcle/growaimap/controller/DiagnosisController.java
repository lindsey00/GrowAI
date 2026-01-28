package com.newcle.growaimap.controller;

import com.newcle.growaimap.dto.DiagnosisRequest;
import com.newcle.growaimap.dto.RoiSimulationRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 진단 컨트롤러
 * 자가진단 및 ROI 시뮬레이션 API
 */
@RestController
@RequestMapping("/api/diagnosis")
public class DiagnosisController {

    @PostMapping("/self")
    public ResponseEntity<Map<String, Object>> selfDiagnosis(@Valid @RequestBody DiagnosisRequest request) {
        // 시큐어코딩: @Valid 어노테이션을 통한 입력값 검증
        // MyBatis 사용 시 #{} 파라미터 바인딩으로 SQL Injection 방지

        Map<String, Object> response = new HashMap<>();
        response.put("diagnosisId", "DIAG-" + System.currentTimeMillis());
        response.put("companyId", request.getCompanyId());
        response.put("urgencyLevel", calculateUrgencyLevel(request));
        response.put("recommendations", generateRecommendations(request));
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/roi-simulation")
    public ResponseEntity<Map<String, Object>> roiSimulation(@Valid @RequestBody RoiSimulationRequest request) {
        // ROI 시뮬레이션 로직

        Map<String, Object> response = new HashMap<>();
        response.put("simulationId", "SIM-" + System.currentTimeMillis());
        response.put("diagnosisId", request.getDiagnosisId());
        response.put("standardRoi", calculateStandardRoi(request));
        response.put("customRoi", calculateCustomRoi(request));
        response.put("esgBenefits", calculateEsgBenefits(request));
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }

    private String calculateUrgencyLevel(DiagnosisRequest request) {
        double avgScore = request.getAnswers().stream()
                .mapToInt(DiagnosisRequest.Answer::getScore)
                .average()
                .orElse(0.0);

        if (avgScore >= 4.0) return "매우높음";
        if (avgScore >= 3.0) return "높음";
        if (avgScore >= 2.0) return "보통";
        return "낮음";
    }

    private String generateRecommendations(DiagnosisRequest request) {
        return "Vision AI, Predictive Maintenance, APS 공정 최적화 등을 권장합니다.";
    }

    private Map<String, Object> calculateStandardRoi(RoiSimulationRequest request) {
        Map<String, Object> roi = new HashMap<>();
        roi.put("investment", 50000000);
        roi.put("expectedSavings", 70000000);
        roi.put("paybackPeriod", 12);
        return roi;
    }

    private Map<String, Object> calculateCustomRoi(RoiSimulationRequest request) {
        Map<String, Object> roi = new HashMap<>();
        roi.put("investment", 70000000);
        roi.put("expectedSavings", 120000000);
        roi.put("paybackPeriod", 10);
        return roi;
    }

    private Map<String, Object> calculateEsgBenefits(RoiSimulationRequest request) {
        Map<String, Object> esg = new HashMap<>();
        esg.put("carbonReduction", request.getCarbonEmission() * 0.3);
        esg.put("energySavings", request.getEnergyCost() * 0.25);
        return esg;
    }

}
