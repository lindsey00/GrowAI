import os
import io
import json
import random
import datetime
import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from pathlib import Path
from scipy import stats
import matplotlib.pyplot as plt
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# --- Initialize App ---
app = FastAPI(
    title="GrowAI-MAP Core API",
    description="제조 AI 분석 및 진단 엔진 (Diagnosis & Data Engine)",
    version="2.0.0"
)

# CORS Enable
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path Settings
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "mock_data"
REPORTS_DIR = BASE_DIR / "reports"
REPORTS_DIR.mkdir(exist_ok=True)

# Try to register Korean font if available, otherwise use default
try:
    # On Windows, NanumGothic or Malgun Gothic is common. 
    # For now, we'll use a placeholder or check system paths if needed.
    # pdfmetrics.registerFont(TTFont('MalgunGothic', 'C:/Windows/Fonts/malgun.ttf'))
    # FONT_NAME = 'MalgunGothic'
    FONT_NAME = 'Helvetica' # Default for now to avoid crashes if font not found
except:
    FONT_NAME = 'Helvetica'

# --- Models ---
class DiagnosisScores(BaseModel):
    quality: int
    facility: int
    process: int
    safety: int
    hr: int
    company_name: Optional[str] = "제조혁신기업"

class ROIPayload(BaseModel):
    standard_roi: float
    custom_roi: float
    man_month_cost: float
    efficiency_gain: float

# --- Helper Functions ---
def load_mock_data(filename: str) -> List[Dict[str, Any]]:
    file_path = DATA_DIR / filename
    if not file_path.exists():
        return []
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def calculate_anomalies(df: pd.DataFrame) -> List[Dict[str, Any]]:
    anomalies = []
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    
    for col in numeric_cols:
        z_scores = np.abs(stats.zscore(df[col].dropna()))
        anomaly_indices = np.where(z_scores > 3)[0]
        if len(anomaly_indices) > 0:
            for idx in anomaly_indices:
                anomalies.append({
                    "row": int(idx),
                    "column": col,
                    "value": float(df.iloc[idx][col]),
                    "z_score": float(z_scores[idx]),
                    "reason": f"Standard Deviation outlier (>3 sigma)"
                })
    return anomalies

# --- API Endpoints ---

@app.get("/")
async def root():
    return {
        "status": "online",
        "engine": "GrowAI-MAP Diagnosis & Data Engine",
        "version": "2.0.0",
        "timestamp": datetime.datetime.now().isoformat()
    }

@app.post("/diagnose/questionnaire")
async def diagnose_questionnaire(scores: DiagnosisScores):
    """제조 5대 고민 모델 기반 자가진단 (Task 2.1)"""
    score_dict = scores.dict()
    company_name = score_dict.pop("company_name")
    
    avg_score = sum(score_dict.values()) / len(score_dict)
    max_concern = max(score_dict, key=score_dict.get)
    
    urgency = "High" if avg_score >= 8 else "Medium" if avg_score >= 5 else "Low"
    
    # Mock similar cases from data
    all_diagnoses = load_mock_data("customer_diagnosis.json")
    similar_cases = [d for d in all_diagnoses if d["urgency_level"] == ("높음" if urgency == "High" else "중간" if urgency == "Medium" else "낮음")]
    
    report_id = f"REPORT_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    recommendations = {
        "quality": "AI 비전 검사 시스템 및 실시간 품질 모니터링 도입 권장",
        "facility": "IoT 센서 기반 예지보전(PdM) 솔루션 구축 권장",
        "process": "MES 연동 공정 최적화 및 디지털 트윈 시뮬레이션 권장",
        "safety": "AI 지능형 CCTV 및 작업자 안전 웨어러블 도입 권장",
        "hr": "AI 기반 표준 작업 가이드(SOP) 및 LMS 교육 시스템 도입 권장"
    }

    return {
        "report_id": report_id,
        "company_name": company_name,
        "urgency_level": urgency,
        "average_score": round(avg_score, 2),
        "primary_concern": max_concern,
        "recommendation": recommendations.get(max_concern, "종합적인 AX 컨설팅이 필요합니다."),
        "estimated_savings": f"₩{int(avg_score * 50000000):,}",
        "similar_cases_count": len(similar_cases),
        "scores": score_dict
    }

@app.post("/diagnose/log")
async def diagnose_log(file: UploadFile = File(...)):
    """설비 로그 데이터 업로드 및 기초 통계 분석 (Task 2.2)"""
    content = await file.read()
    filename = file.filename
    
    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(content))
        elif filename.endswith('.json'):
            data = json.loads(content)
            df = pd.DataFrame(data)
        else:
            raise HTTPException(status_code=400, detail="Only CSV or JSON files are supported.")
        
        # 1. Statistics
        summary = df.describe().to_dict()
        
        # 2. Anomaly Detection
        anomalies = calculate_anomalies(df)
        
        # 3. Correlation Analysis
        correlation = df.select_dtypes(include=[np.number]).corr().to_dict()
        
        # 4. AI Insight Simulation (Vertex AI integration point)
        insight = "정상 범위를 벗어난 진동 데이터가 다수 발견되었습니다. 설비 #3의 베어링 마모가 의심됩니다."
        if df.get('temperature_celsius') is not None and df.get('vibration_mm_s') is not None:
            corr_val = df['temperature_celsius'].corr(df['vibration_mm_s'])
            if corr_val > 0.7:
                insight = f"온도와 진동 간의 강한 상관관계({corr_val:.2f})가 관찰됩니다. 과열에 따른 기계적 불안정성이 높습니다."

        return {
            "status": "success",
            "filename": filename,
            "rows": len(df),
            "columns": list(df.columns),
            "statistics": summary,
            "anomalies_found": len(anomalies),
            "top_anomalies": anomalies[:5],
            "correlation_matrix": correlation,
            "ai_insight": insight
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/diagnose/precision")
async def precision_diagnosis(data: Dict[str, Any]):
    """Vertex AI 기반 정밀 진단 에이전트 (Task 2.3)"""
    # In a real scenario, this would call Vertex AI / Gemini API
    # Using 'google-genai' library logic here (simulated)
    
    context = data.get("context", "No data provided")
    
    # Simulate Gemini response
    prompt = f"Analyze following manufacturing data and provide expert diagnosis: {context}"
    
    # Mocking Gemini Response
    diagnosis_text = (
        "Vertex AI 분석 결과: 귀사의 설비 가동 패턴은 특정 시간대에 비정상적인 전력 피크를 보이고 있습니다. "
        "이는 공정 스케줄링의 불균형으로 인한 병목 현상을 의미하며, AI 기반 부하 분산 스케줄러 도입 시 "
        "에너지 비용의 약 12% 절감이 가능할 것으로 판단됩니다. 또한 품질 검사 단계의 병목은 비전 AI를 통해 해결 가능합니다."
    )
    
    return {
        "status": "complete",
        "agent": "Vertex-AI Manufacturing Specialist",
        "detailed_diagnosis": diagnosis_text,
        "confidence_score": 0.94,
        "next_steps": ["현장 정밀 실사", "PoC 시나리오 수립"]
    }

@app.get("/report/generate/{report_id}")
async def generate_pdf_report(report_id: str):
    """진단 결과 보고서 PDF 생성 (Task 2.4)"""
    file_path = REPORTS_DIR / f"{report_id}.pdf"
    
    # Create simple PDF
    doc = SimpleDocTemplate(str(file_path), pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title_style = ParagraphStyle('Title', parent=styles['Heading1'], alignment=1, spaceAfter=20)
    story.append(Paragraph("GrowAI-MAP Manufacturing Diagnosis Report", title_style))
    story.append(Spacer(1, 12))
    
    # Metadata
    story.append(Paragraph(f"Report ID: {report_id}", styles['Normal']))
    story.append(Paragraph(f"Date: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
    story.append(Spacer(1, 24))
    
    # Summary Section
    story.append(Paragraph("1. Executive Summary", styles['Heading2']))
    summary_text = (
        "This report provides a comprehensive analysis of the manufacturing environment based on the 5 Major Agony Model "
        "and collected log data. Our AI diagnosis engine identifies key optimization points for digital transformation."
    )
    story.append(Paragraph(summary_text, styles['Normal']))
    story.append(Spacer(1, 12))
    
    # Data Table (Mocked for now)
    data = [
        ['Category', 'Score', 'Status', 'Priority'],
        ['Quality', '8', 'Critical', 'High'],
        ['Facility', '5', 'Normal', 'Medium'],
        ['Process', '4', 'Good', 'Low'],
        ['Safety', '6', 'Warning', 'Medium'],
        ['HR', '3', 'Excellent', 'Low']
    ]
    t = Table(data, colWidths=[100, 50, 80, 80])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(t)
    story.append(Spacer(1, 24))
    
    # AI Insight Section
    story.append(Paragraph("2. AI-Driven Insights", styles['Heading2']))
    insight_text = (
        "Analysis reveals high correlation between temperature spikes and defective product counts. "
        "Implementing a predictive maintenance schedule could reduce unplanned downtime by 22%."
    )
    story.append(Paragraph(insight_text, styles['Normal']))
    
    # Build PDF
    doc.build(story)
    
    return FileResponse(path=file_path, filename=f"GrowAI_Report_{report_id}.pdf", media_type='application/pdf')

# --- Existing Endpoints from main.py updated ---

@app.post("/roi-simulator")
async def simulate_roi(payload: ROIPayload):
    result = {
        "standard_savings": payload.standard_roi * payload.man_month_cost,
        "custom_savings": payload.custom_roi * payload.man_month_cost * payload.efficiency_gain,
        "esg_impact": "Reduction in carbon footprint estimated at 15%",
        "payback_period": round(payload.man_month_cost / (payload.custom_roi * 0.5), 2)
    }
    return result

@app.get("/api/dashboard/summary")
async def get_dashboard_summary():
    sensor_data = load_mock_data("sensor_data.json")
    equipment_data = load_mock_data("equipment_status.json")
    
    anomaly_count = sum(1 for d in sensor_data if d["status"] in ["warning", "critical"])
    
    return {
        "total_anomalies": anomaly_count,
        "active_equipment": len([e for e in equipment_data if e["status"] == "운영중"]),
        "average_oee": round(sum(e["performance"]["oee_percent"] for e in equipment_data) / len(equipment_data), 2) if equipment_data else 0
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)