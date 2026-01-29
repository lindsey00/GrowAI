"""
GrowAI-MAP Mock Data Generator
제조 AI 플랫폼을 위한 대규모 Mock 데이터 생성기

데이터 종류:
1. 센서 데이터 (Sensor Logs)
2. 설비 상태 데이터 (Equipment Status)
3. 품질 검사 데이터 (Quality Inspection)
4. ROI 시뮬레이션 데이터 (ROI Simulation)
5. 고객 진단 데이터 (Customer Diagnosis)
"""

import json
import random
import datetime
from typing import List, Dict, Any
from pathlib import Path


class MockDataGenerator:
    """제조 데이터 생성기"""
    
    def __init__(self, seed: int = 42):
        random.seed(seed)
        self.companies = [
            "삼성전자", "LG전자", "현대자동차", "SK하이닉스", "포스코",
            "한화", "두산", "효성", "LS전선", "대우조선해양",
            "중소제조A", "중소제조B", "중소제조C", "스타트업D", "스타트업E"
        ]
        self.equipment_types = [
            "CNC 밀링머신", "사출성형기", "프레스", "용접로봇", "도장로봇",
            "조립라인", "검사장비", "포장기", "컨베이어", "AGV"
        ]
        self.locations = [
            "경기 화성", "경기 평택", "충남 아산", "울산", "경북 구미",
            "전남 광양", "경남 창원", "인천", "서울", "부산"
        ]
        
    def generate_sensor_data(self, count: int) -> List[Dict[str, Any]]:
        """센서 데이터 생성 (온도, 압력, 진동, 전력 등)"""
        data = []
        base_time = datetime.datetime(2026, 1, 1, 0, 0, 0)
        
        for i in range(count):
            timestamp = base_time + datetime.timedelta(seconds=i * 10)
            
            # 정상 범위 내 데이터 (90%)
            if random.random() < 0.9:
                temperature = round(random.uniform(20.0, 80.0), 2)
                pressure = round(random.uniform(1.0, 5.0), 2)
                vibration = round(random.uniform(0.1, 2.0), 2)
                power = round(random.uniform(10.0, 50.0), 2)
                status = "normal"
            # 이상 데이터 (10%)
            else:
                temperature = round(random.uniform(85.0, 120.0), 2)
                pressure = round(random.uniform(5.5, 8.0), 2)
                vibration = round(random.uniform(3.0, 10.0), 2)
                power = round(random.uniform(60.0, 100.0), 2)
                status = "warning" if random.random() < 0.7 else "critical"
            
            data.append({
                "id": f"SENSOR_{i+1:08d}",
                "timestamp": timestamp.isoformat(),
                "equipment_id": f"EQ_{random.randint(1, 100):04d}",
                "equipment_type": random.choice(self.equipment_types),
                "location": random.choice(self.locations),
                "metrics": {
                    "temperature_celsius": temperature,
                    "pressure_bar": pressure,
                    "vibration_mm_s": vibration,
                    "power_consumption_kw": power,
                    "rpm": random.randint(500, 3000),
                    "cycle_count": random.randint(0, 10000)
                },
                "status": status,
                "anomaly_score": round(random.uniform(0.0, 1.0), 4)
            })
        
        return data
    
    def generate_equipment_status(self, count: int) -> List[Dict[str, Any]]:
        """설비 상태 데이터 생성"""
        data = []
        
        for i in range(count):
            uptime_hours = random.randint(0, 8760)  # 1년 = 8760시간
            downtime_hours = random.randint(0, 100)
            
            data.append({
                "id": f"EQ_{i+1:06d}",
                "equipment_name": random.choice(self.equipment_types),
                "manufacturer": random.choice(["FANUC", "KUKA", "ABB", "Siemens", "Mitsubishi"]),
                "model": f"MODEL-{random.randint(1000, 9999)}",
                "installation_date": (datetime.datetime.now() - datetime.timedelta(days=random.randint(30, 3650))).strftime("%Y-%m-%d"),
                "location": random.choice(self.locations),
                "company": random.choice(self.companies),
                "status": random.choice(["운영중", "정비중", "대기", "고장"]),
                "performance": {
                    "uptime_hours": uptime_hours,
                    "downtime_hours": downtime_hours,
                    "availability_percent": round((uptime_hours / (uptime_hours + downtime_hours)) * 100, 2) if (uptime_hours + downtime_hours) > 0 else 0,
                    "oee_percent": round(random.uniform(60.0, 95.0), 2),
                    "mtbf_hours": round(random.uniform(100.0, 1000.0), 1),
                    "mttr_hours": round(random.uniform(1.0, 24.0), 1)
                },
                "maintenance": {
                    "last_maintenance": (datetime.datetime.now() - datetime.timedelta(days=random.randint(1, 90))).strftime("%Y-%m-%d"),
                    "next_maintenance": (datetime.datetime.now() + datetime.timedelta(days=random.randint(1, 90))).strftime("%Y-%m-%d"),
                    "maintenance_cost_yearly": random.randint(1000000, 50000000)
                }
            })
        
        return data
    
    def generate_quality_inspection(self, count: int) -> List[Dict[str, Any]]:
        """품질 검사 데이터 생성"""
        data = []
        defect_types = ["스크래치", "변형", "치수불량", "색상불량", "이물질", "크랙", "기포"]
        
        for i in range(count):
            is_defective = random.random() < 0.05  # 5% 불량률
            
            data.append({
                "id": f"QC_{i+1:08d}",
                "timestamp": (datetime.datetime.now() - datetime.timedelta(minutes=random.randint(0, 10000))).isoformat(),
                "product_id": f"PROD_{random.randint(1, 100000):08d}",
                "batch_id": f"BATCH_{random.randint(1, 1000):06d}",
                "inspector": f"검사원{random.randint(1, 20)}",
                "equipment_id": f"EQ_{random.randint(1, 100):04d}",
                "result": "불량" if is_defective else "합격",
                "defect_type": random.choice(defect_types) if is_defective else None,
                "measurements": {
                    "dimension_x_mm": round(random.uniform(99.5, 100.5), 3),
                    "dimension_y_mm": round(random.uniform(49.5, 50.5), 3),
                    "weight_g": round(random.uniform(95.0, 105.0), 2),
                    "hardness_hv": round(random.uniform(180.0, 220.0), 1)
                },
                "ai_confidence": round(random.uniform(0.85, 0.99), 4),
                "inspection_time_seconds": round(random.uniform(0.5, 3.0), 2)
            })
        
        return data
    
    def generate_roi_simulation(self, count: int) -> List[Dict[str, Any]]:
        """ROI 시뮬레이션 데이터 생성"""
        data = []
        
        for i in range(count):
            investment = random.randint(50000000, 500000000)
            annual_saving = random.randint(10000000, 150000000)
            payback_period = round(investment / annual_saving, 2) if annual_saving > 0 else 0
            
            data.append({
                "id": f"ROI_{i+1:06d}",
                "company": random.choice(self.companies),
                "simulation_date": (datetime.datetime.now() - datetime.timedelta(days=random.randint(0, 365))).strftime("%Y-%m-%d"),
                "solution_type": random.choice(["Standard", "Custom"]),
                "investment": {
                    "initial_cost": investment,
                    "installation_cost": int(investment * 0.1),
                    "training_cost": int(investment * 0.05),
                    "total_investment": int(investment * 1.15)
                },
                "benefits": {
                    "labor_cost_reduction": random.randint(20000000, 80000000),
                    "defect_rate_reduction": round(random.uniform(1.0, 5.0), 2),
                    "productivity_increase": round(random.uniform(10.0, 40.0), 2),
                    "energy_saving": random.randint(5000000, 20000000),
                    "annual_total_saving": annual_saving
                },
                "roi_metrics": {
                    "payback_period_years": payback_period,
                    "roi_percent": round((annual_saving / investment) * 100, 2) if investment > 0 else 0,
                    "npv_5years": random.randint(-50000000, 300000000),
                    "irr_percent": round(random.uniform(5.0, 25.0), 2)
                },
                "esg_impact": {
                    "co2_reduction_tons": round(random.uniform(10.0, 100.0), 2),
                    "energy_efficiency_improvement": round(random.uniform(5.0, 30.0), 2),
                    "waste_reduction_percent": round(random.uniform(10.0, 40.0), 2)
                }
            })
        
        return data
    
    def generate_customer_diagnosis(self, count: int) -> List[Dict[str, Any]]:
        """고객 진단 데이터 생성 (5대 고민 모델)"""
        data = []
        concerns = ["품질", "설비", "공정", "안전", "인력"]
        
        for i in range(count):
            concern_scores = {concern: random.randint(1, 10) for concern in concerns}
            urgency = "높음" if max(concern_scores.values()) >= 8 else "중간" if max(concern_scores.values()) >= 5 else "낮음"
            
            data.append({
                "id": f"DIAG_{i+1:06d}",
                "company": random.choice(self.companies),
                "diagnosis_date": (datetime.datetime.now() - datetime.timedelta(days=random.randint(0, 180))).strftime("%Y-%m-%d"),
                "industry": random.choice(["자동차", "전자", "화학", "식품", "기계"]),
                "employee_count": random.choice([50, 100, 300, 500, 1000, 3000]),
                "annual_revenue": random.randint(100, 10000) * 100000000,
                "concern_scores": concern_scores,
                "urgency_level": urgency,
                "estimated_saving": random.randint(50000000, 500000000),
                "recommended_solutions": random.sample([
                    "AI 비전 검사", "협동로봇", "예지보전", "MES 시스템", 
                    "스마트 물류", "에너지 관리", "품질 관리 시스템"
                ], k=random.randint(2, 4)),
                "consultant_notes": f"진단 완료 - 우선순위: {max(concern_scores, key=concern_scores.get)}"
            })
        
        return data


def main():
    """메인 실행 함수"""
    print("=" * 60)
    print("🏭 GrowAI-MAP Mock Data Generator")
    print("=" * 60)
    print()
    
    generator = MockDataGenerator()
    output_dir = Path(__file__).parent / "mock_data"
    output_dir.mkdir(exist_ok=True)
    
    # 사용자 입력
    print("생성할 데이터 개수를 선택하세요:")
    print("1. 소규모 (100개)")
    print("2. 중규모 (1,000개)")
    print("3. 대규모 (10,000개)")
    print("4. 초대규모 (100,000개)")
    print("5. 커스텀")
    
    choice = input("\n선택 (1-5): ").strip()
    
    count_map = {
        "1": 100,
        "2": 1000,
        "3": 10000,
        "4": 100000
    }
    
    if choice == "5":
        count = int(input("생성할 개수를 입력하세요: "))
    else:
        count = count_map.get(choice, 1000)
    
    print(f"\n📊 {count:,}개의 Mock 데이터를 생성합니다...\n")
    
    # 데이터 생성
    datasets = {
        "sensor_data": generator.generate_sensor_data(count),
        "equipment_status": generator.generate_equipment_status(min(count, 10000)),
        "quality_inspection": generator.generate_quality_inspection(count),
        "roi_simulation": generator.generate_roi_simulation(min(count, 5000)),
        "customer_diagnosis": generator.generate_customer_diagnosis(min(count, 2000))
    }
    
    # 파일 저장
    for name, data in datasets.items():
        file_path = output_dir / f"{name}.json"
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        file_size = file_path.stat().st_size / 1024 / 1024  # MB
        print(f"✅ {name}: {len(data):,}개 생성 ({file_size:.2f} MB)")
        print(f"   📁 {file_path}")
    
    # 통합 파일 생성
    combined_path = output_dir / "combined_all_data.json"
    with open(combined_path, 'w', encoding='utf-8') as f:
        json.dump(datasets, f, ensure_ascii=False, indent=2)
    
    combined_size = combined_path.stat().st_size / 1024 / 1024
    total_records = sum(len(data) for data in datasets.values())
    
    print(f"\n{'=' * 60}")
    print(f"✨ 데이터 생성 완료!")
    print(f"{'=' * 60}")
    print(f"📊 총 레코드 수: {total_records:,}개")
    print(f"💾 총 파일 크기: {combined_size:.2f} MB")
    print(f"📁 저장 위치: {output_dir}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
