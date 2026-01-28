package com.newcle.growaimap.domain;

/**
 * 제조 5대 고민 유형
 */
public enum AgonyType {
    QUALITY("품질 블라인드", "Quality Blind"),
    EQUIPMENT("돌발 셧다운", "Sudden Shutdown"),
    PROCESS("깜깜이 공정", "Pitch-Black Process"),
    SAFETY("위험 사각지대", "Danger Zone"),
    LABOR("인력난/반복노동", "Labor Shortage");

    private final String korean;
    private final String english;

    AgonyType(String korean, String english) {
        this.korean = korean;
        this.english = english;
    }

    public String getKorean() {
        return korean;
    }

    public String getEnglish() {
        return english;
    }
}
