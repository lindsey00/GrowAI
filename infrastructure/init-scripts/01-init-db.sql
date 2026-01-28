-- GrowAI-MAP Database Initialization Script
-- 제조 5대 고민 분석 플랫폼 데이터베이스 초기화

-- 기업 정보 테이블
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    industry_type VARCHAR(50) NOT NULL,
    employee_count INTEGER,
    annual_revenue BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 진단 결과 테이블
CREATE TABLE IF NOT EXISTS diagnosis_results (
    id VARCHAR(50) PRIMARY KEY,
    company_id VARCHAR(50) REFERENCES companies(id),
    urgency_level VARCHAR(20),
    avg_score DECIMAL(3,2),
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 진단 답변 테이블
CREATE TABLE IF NOT EXISTS diagnosis_answers (
    id SERIAL PRIMARY KEY,
    diagnosis_id VARCHAR(50) REFERENCES diagnosis_results(id),
    question_id VARCHAR(50) NOT NULL,
    agony_type VARCHAR(20) NOT NULL,
    score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ROI 시뮬레이션 테이블
CREATE TABLE IF NOT EXISTS roi_simulations (
    id VARCHAR(50) PRIMARY KEY,
    diagnosis_id VARCHAR(50) REFERENCES diagnosis_results(id),
    labor_cost DECIMAL(15,2),
    defect_rate DECIMAL(5,2),
    energy_cost DECIMAL(15,2),
    carbon_emission DECIMAL(10,2),
    solution_type VARCHAR(20),
    standard_roi_investment BIGINT,
    standard_roi_savings BIGINT,
    custom_roi_investment BIGINT,
    custom_roi_savings BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_companies_industry ON companies(industry_type);
CREATE INDEX idx_diagnosis_company ON diagnosis_results(company_id);
CREATE INDEX idx_diagnosis_created ON diagnosis_results(created_at DESC);
CREATE INDEX idx_roi_diagnosis ON roi_simulations(diagnosis_id);

-- 초기 데이터 샘플
INSERT INTO companies (id, name, industry_type, employee_count, annual_revenue) VALUES
('test-company-001', '테스트 제조사 A', 'ELECTRONICS', 150, 50000000000),
('test-company-002', '테스트 제조사 B', 'AUTOMOTIVE', 300, 120000000000)
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE companies IS '제조 기업 정보';
COMMENT ON TABLE diagnosis_results IS '자가진단 결과';
COMMENT ON TABLE diagnosis_answers IS '진단 질문별 답변';
COMMENT ON TABLE roi_simulations IS 'ROI 시뮬레이션 결과';
