"""
GrowAI-MAP Mock Data API Server
FastAPI 기반 Mock 데이터 제공 서버
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pathlib import Path
import json
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import random

app = FastAPI(
    title="GrowAI-MAP Mock Data API",
    description="제조 AI 플랫폼 Mock 데이터 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 데이터 로드
DATA_DIR = Path(__file__).parent / "mock_data"
CACHE = {}


def load_data(filename: str) -> List[Dict[str, Any]]:
    """JSON 파일에서 데이터 로드 (캐싱)"""
    if filename not in CACHE:
        file_path = DATA_DIR / filename
        if not file_path.exists():
            return []
        with open(file_path, 'r', encoding='utf-8') as f:
            CACHE[filename] = json.load(f)
    return CACHE[filename]


@app.get("/")
async def root():
    """API 루트"""
    return {
        "message": "GrowAI-MAP Mock Data API",
        "version": "1.0.0",
        "endpoints": {
            "sensor_data": "/api/sensor-data",
            "equipment_status": "/api/equipment-status",
            "quality_inspection": "/api/quality-inspection",
            "roi_simulation": "/api/roi-simulation",
            "customer_diagnosis": "/api/customer-diagnosis",
            "dashboard_summary": "/api/dashboard/summary",
            "realtime_metrics": "/api/realtime/metrics"
        }
    }


@app.get("/api/sensor-data")
async def get_sensor_data(
    limit: int = Query(100, ge=1, le=10000),
    offset: int = Query(0, ge=0),
    status: Optional[str] = None,
    equipment_type: Optional[str] = None
):
    """센서 데이터 조회"""
    data = load_data("sensor_data.json")
    
    # 필터링
    if status:
        data = [d for d in data if d["status"] == status]
    if equipment_type:
        data = [d for d in data if d["equipment_type"] == equipment_type]
    
    # 페이지네이션
    total = len(data)
    data = data[offset:offset + limit]
    
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "data": data
    }


@app.get("/api/equipment-status")
async def get_equipment_status(
    limit: int = Query(100, ge=1, le=10000),
    offset: int = Query(0, ge=0),
    company: Optional[str] = None,
    status: Optional[str] = None
):
    """설비 상태 조회"""
    data = load_data("equipment_status.json")
    
    if company:
        data = [d for d in data if d["company"] == company]
    if status:
        data = [d for d in data if d["status"] == status]
    
    total = len(data)
    data = data[offset:offset + limit]
    
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "data": data
    }


@app.get("/api/quality-inspection")
async def get_quality_inspection(
    limit: int = Query(100, ge=1, le=10000),
    offset: int = Query(0, ge=0),
    result: Optional[str] = None
):
    """품질 검사 데이터 조회"""
    data = load_data("quality_inspection.json")
    
    if result:
        data = [d for d in data if d["result"] == result]
    
    total = len(data)
    data = data[offset:offset + limit]
    
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "data": data
    }


@app.get("/api/roi-simulation")
async def get_roi_simulation(
    limit: int = Query(100, ge=1, le=5000),
    offset: int = Query(0, ge=0),
    solution_type: Optional[str] = None
):
    """ROI 시뮬레이션 데이터 조회"""
    data = load_data("roi_simulation.json")
    
    if solution_type:
        data = [d for d in data if d["solution_type"] == solution_type]
    
    total = len(data)
    data = data[offset:offset + limit]
    
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "data": data
    }


@app.get("/api/customer-diagnosis")
async def get_customer_diagnosis(
    limit: int = Query(100, ge=1, le=2000),
    offset: int = Query(0, ge=0),
    urgency_level: Optional[str] = None
):
    """고객 진단 데이터 조회"""
    data = load_data("customer_diagnosis.json")
    
    if urgency_level:
        data = [d for d in data if d["urgency_level"] == urgency_level]
    
    total = len(data)
    data = data[offset:offset + limit]
    
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "data": data
    }


@app.get("/api/dashboard/summary")
async def get_dashboard_summary():
    """대시보드 요약 통계"""
    sensor_data = load_data("sensor_data.json")
    equipment_data = load_data("equipment_status.json")
    quality_data = load_data("quality_inspection.json")
    roi_data = load_data("roi_simulation.json")
    
    # 센서 이상 감지
    anomaly_count = sum(1 for d in sensor_data if d["status"] in ["warning", "critical"])
    
    # 설비 가동률
    total_uptime = sum(d["performance"]["uptime_hours"] for d in equipment_data)
    total_downtime = sum(d["performance"]["downtime_hours"] for d in equipment_data)
    availability = (total_uptime / (total_uptime + total_downtime)) * 100 if (total_uptime + total_downtime) > 0 else 0
    
    # 품질 불량률
    defect_count = sum(1 for d in quality_data if d["result"] == "불량")
    defect_rate = (defect_count / len(quality_data)) * 100 if quality_data else 0
    
    # 평균 ROI
    avg_roi = sum(d["roi_metrics"]["roi_percent"] for d in roi_data) / len(roi_data) if roi_data else 0
    
    return {
        "timestamp": datetime.now().isoformat(),
        "total_sensors": len(sensor_data),
        "total_equipment": len(equipment_data),
        "total_inspections": len(quality_data),
        "total_simulations": len(roi_data),
        "metrics": {
            "anomaly_detection": {
                "total_anomalies": anomaly_count,
                "anomaly_rate": round((anomaly_count / len(sensor_data)) * 100, 2) if sensor_data else 0
            },
            "equipment_performance": {
                "availability_percent": round(availability, 2),
                "total_uptime_hours": total_uptime,
                "total_downtime_hours": total_downtime
            },
            "quality_metrics": {
                "defect_rate_percent": round(defect_rate, 2),
                "total_defects": defect_count,
                "pass_rate_percent": round(100 - defect_rate, 2)
            },
            "roi_metrics": {
                "average_roi_percent": round(avg_roi, 2),
                "total_investment": sum(d["investment"]["total_investment"] for d in roi_data),
                "total_saving": sum(d["benefits"]["annual_total_saving"] for d in roi_data)
            }
        }
    }


@app.get("/api/realtime/metrics")
async def get_realtime_metrics():
    """실시간 메트릭 (시뮬레이션)"""
    # 실시간 데이터 시뮬레이션
    now = datetime.now()
    metrics = []
    
    for i in range(20):
        timestamp = now - timedelta(minutes=i)
        metrics.append({
            "timestamp": timestamp.isoformat(),
            "temperature": round(random.uniform(20.0, 80.0), 2),
            "pressure": round(random.uniform(1.0, 5.0), 2),
            "vibration": round(random.uniform(0.1, 2.0), 2),
            "power": round(random.uniform(10.0, 50.0), 2),
            "production_count": random.randint(50, 150),
            "defect_count": random.randint(0, 5)
        })
    
    return {
        "data": list(reversed(metrics))
    }


@app.get("/api/stats")
async def get_stats():
    """전체 통계"""
    return {
        "sensor_data": len(load_data("sensor_data.json")),
        "equipment_status": len(load_data("equipment_status.json")),
        "quality_inspection": len(load_data("quality_inspection.json")),
        "roi_simulation": len(load_data("roi_simulation.json")),
        "customer_diagnosis": len(load_data("customer_diagnosis.json")),
        "total_records": sum([
            len(load_data("sensor_data.json")),
            len(load_data("equipment_status.json")),
            len(load_data("quality_inspection.json")),
            len(load_data("roi_simulation.json")),
            len(load_data("customer_diagnosis.json"))
        ])
    }


# Pydantic 모델 정의
class DiagnosisScores(BaseModel):
    quality: int
    facility: int
    process: int
    safety: int
    hr: int


@app.post("/diagnose/questionnaire")
async def diagnose_questionnaire(scores: DiagnosisScores):
    """5대 고민 진단 설문 처리"""
    # 점수를 딕셔너리로 변환
    score_dict = scores.dict()
    
    # 총점 및 평균 계산
    total_score = sum(score_dict.values())
    avg_score = total_score / len(score_dict)
    max_score = max(score_dict.values())
    max_concern = max(score_dict, key=score_dict.get)
    
    # 긴급도 판정
    if avg_score >= 8:
        urgency_level = "높음 (High)"
        urgency_color = "red"
    elif avg_score >= 5:
        urgency_level = "중간 (Medium)"
        urgency_color = "yellow"
    else:
        urgency_level = "낮음 (Low)"
        urgency_color = "green"
    
    # Mock 데이터에서 유사 사례 찾기
    diagnosis_data = load_data("customer_diagnosis.json")
    similar_cases = [d for d in diagnosis_data if abs(sum(d["concern_scores"].values()) / 5 - avg_score) < 2]
    
    # 예상 절감액 계산 (Mock 데이터 기반)
    if similar_cases:
        avg_saving = sum(d["estimated_saving"] for d in similar_cases) / len(similar_cases)
    else:
        avg_saving = int(avg_score * 50000000)  # 점수당 5천만원
    
    # 한국어 고민 매핑
    concern_names = {
        "quality": "품질",
        "facility": "설비",
        "process": "공정",
        "safety": "안전",
        "hr": "인력"
    }
    
    # AI 진단 보고서 생성
    report_lines = [
        f"📊 **진단 결과 요약**",
        f"",
        f"귀사의 제조 현장 진단 결과, 총 {len(score_dict)}개 영역에서 평균 {avg_score:.1f}점의 고민 수준이 확인되었습니다.",
        f"",
        f"🔴 **최우선 개선 영역**: {concern_names[max_concern]} ({max_score}점)",
        f"",
        f"**영역별 점수:**"
    ]
    
    for key, value in sorted(score_dict.items(), key=lambda x: x[1], reverse=True):
        emoji = "🔴" if value >= 8 else "🟡" if value >= 5 else "🟢"
        report_lines.append(f"  {emoji} {concern_names[key]}: {value}점")
    
    report_lines.extend([
        f"",
        f"💡 **권장 솔루션:**"
    ])
    
    # 점수 기반 솔루션 추천
    recommendations = []
    if score_dict["quality"] >= 7:
        recommendations.append("• AI 비전 검사 시스템 도입으로 불량률 50% 감소 가능")
    if score_dict["facility"] >= 7:
        recommendations.append("• 예지보전(Predictive Maintenance) 시스템으로 설비 가동률 15% 향상")
    if score_dict["process"] >= 7:
        recommendations.append("• MES(제조실행시스템) 구축으로 생산 효율 25% 개선")
    if score_dict["safety"] >= 7:
        recommendations.append("• 협동로봇 도입으로 안전사고 80% 감소")
    if score_dict["hr"] >= 7:
        recommendations.append("• 자동화 설비 투자로 인력 의존도 40% 절감")
    
    if not recommendations:
        recommendations.append("• 현재 수준 유지 및 지속적인 모니터링 권장")
    
    report_lines.extend(recommendations)
    
    # 유사 사례 정보
    if similar_cases:
        report_lines.extend([
            f"",
            f"📈 **유사 사례 분석:**",
            f"귀사와 유사한 {len(similar_cases)}개 기업의 평균 개선 효과를 분석한 결과,",
            f"연간 약 {avg_saving:,.0f}원의 비용 절감이 예상됩니다."
        ])
    
    # ROI 데이터 기반 추가 정보
    roi_data = load_data("roi_simulation.json")
    if roi_data:
        avg_roi = sum(d["roi_metrics"]["roi_percent"] for d in roi_data[:10]) / 10
        avg_payback = sum(d["roi_metrics"]["payback_period_years"] for d in roi_data[:10]) / 10
        
        report_lines.extend([
            f"",
            f"💰 **투자 수익성 예측:**",
            f"• 평균 ROI: {avg_roi:.1f}%",
            f"• 투자 회수 기간: {avg_payback:.1f}년",
            f"• ESG 효과: 연간 CO2 {random.randint(20, 100)}톤 감축 예상"
        ])
    
    report_lines.extend([
        f"",
        f"---",
        f"",
        f"🎯 **다음 단계:**",
        f"1. 현장 정밀 진단 (Digital Audit) 실시",
        f"2. 맞춤형 솔루션 제안서 작성",
        f"3. ROI 시뮬레이션 및 투자 계획 수립",
        f"4. 파일럿 프로젝트 진행",
        f"",
        f"📞 전문 컨설턴트와 상담을 원하시면 '전문가 매칭' 버튼을 클릭하세요."
    ])
    
    report = "\n".join(report_lines)
    
    return {
        "urgency_level": urgency_level,
        "urgency_color": urgency_color,
        "report": report,
        "estimated_savings": f"₩{avg_saving:,.0f}",
        "scores": score_dict,
        "max_concern": concern_names[max_concern],
        "recommendations": recommendations,
        "similar_cases_count": len(similar_cases)
    }



if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("🚀 GrowAI-MAP Mock Data API Server")
    print("=" * 60)
    print("📍 Server: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
