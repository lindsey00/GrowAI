@echo off
chcp 65001
set TARGET_DIR=D:\WorkSpace\GrowAI-MAP\src\database
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

echo [진행 중] 정밀 노이즈가 포함된 제조 시뮬레이션 데이터 생성 중...

gemini "실제 제조 현장의 복잡한 예외 케이스를 반영한 Python 데이터 생성 스크립트(generate_data.py)를 작성해줘. 
다음 요구사항을 반드시 반영해:
1. **노이즈 모델링**: 센서 데이터에 가우스 노이즈(Gaussian Noise)를 추가하고, 시간이 지남에 따라 설비 효율이 떨어지는 '드리프트 현상'을 구현할 것.
2. **예외 케이스(Anomaly)**: 
   - 센서 일시 단절(Null 값)
   - 전압 급등으로 인한 스파이크(Spike) 데이터
   - 설비 과열 전조 현상(점진적 온도 상승)
3. **데이터 규모**: 1,000건의 타임시리즈(Time-series) 데이터.
4. **한글 주석 및 가이드**:
   - [배경지식]: 제조 시계열 데이터의 특성과 노이즈 유형
   - [연관항목]: FFT(고속 푸리에 변환)를 이용한 노이즈 제거 기술
   - [학습사이트]: https://pandas.pydata.org/
5. 생성된 데이터를 'complex_manufacturing_data.csv'로 저장하는 코드 포함." > "%TARGET_DIR%\generate_data.py"

:: Python 스크립트 즉시 실행하여 데이터 파일 생성
python "%TARGET_DIR%\generate_data.py"

echo [완료] 정밀 데이터가 %TARGET_DIR%\complex_manufacturing_data.csv 에 생성되었습니다.
pause