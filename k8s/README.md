# GrowAI-MAP Kubernetes 배포 가이드

본 문서는 GrowAI-MAP 애플리케이션을 Google Kubernetes Engine(GKE)에 배포하는 전체 프로세스를 안내합니다.

## 📋 목차

- [사전 요구사항](#사전-요구사항)
- [디렉토리 구조](#디렉토리-구조)
- [초기 설정](#초기-설정)
- [배포 단계](#배포-단계)
- [환경별 배포](#환경별-배포)
- [롤백 절차](#롤백-절차)
- [모니터링](#모니터링)
- [트러블슈팅](#트러블슈팅)

---

## 사전 요구사항

### 필수 도구

- `gcloud` CLI (최신 버전)
- `kubectl` CLI (1.24+)
- `docker` CLI
- Git

### GCP 리소스

다음 리소스가 사전에 구성되어 있어야 합니다:

```bash
# setup-gcp.sh 스크립트 실행으로 자동 생성 가능
./setup-gcp.sh
```

생성되는 리소스:
- GKE Cluster
- Cloud SQL (MySQL 8.0)
- Memorystore (Redis)
- Static IP 주소
- Service Account
- Cloud Storage Bucket

### Kubernetes Secrets

다음 Secrets가 각 네임스페이스에 생성되어 있어야 합니다:

```bash
# DB 자격증명
kubectl create secret generic db-credentials \
  --from-literal=username=growaiuser \
  --from-literal=password=YOUR_PASSWORD \
  --from-literal=database=growai \
  -n staging

kubectl create secret generic db-credentials \
  --from-literal=username=growaiuser \
  --from-literal=password=YOUR_PASSWORD \
  --from-literal=database=growai \
  -n production
```

---

## 디렉토리 구조

```
k8s/
├── README.md                    # 본 문서
├── backend-deployment.yaml      # Backend Deployment 정의
├── backend-service.yaml         # Backend Service 정의
├── frontend-deployment.yaml     # Frontend Deployment 정의
├── frontend-service.yaml        # Frontend Service 정의
├── ingress.yaml                 # Ingress 및 인증서 설정
├── configmap.yaml              # ConfigMap (애플리케이션 설정)
├── hpa.yaml                    # Horizontal Pod Autoscaler
└── pdb.yaml                    # Pod Disruption Budget
```

---

## 초기 설정

### 1. GCP 프로젝트 설정

```bash
# 프로젝트 ID 설정
export PROJECT_ID="your-gcp-project-id"
export REGION="asia-northeast3"
export ZONE="asia-northeast3-a"
export CLUSTER_NAME="growai-cluster"

# gcloud 설정
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION
gcloud config set compute/zone $ZONE
```

### 2. GKE 클러스터 접속

```bash
# kubectl 자격증명 가져오기
gcloud container clusters get-credentials $CLUSTER_NAME \
  --zone $ZONE \
  --project $PROJECT_ID

# 연결 확인
kubectl cluster-info
kubectl get nodes
```

### 3. 네임스페이스 생성

```bash
# Staging 네임스페이스
kubectl create namespace staging

# Production 네임스페이스
kubectl create namespace production

# 네임스페이스 확인
kubectl get namespaces
```

---

## 배포 단계

### Step 1: 매니페스트 파일 수정

배포 전에 다음 값들을 실제 환경에 맞게 수정해야 합니다:

#### backend-deployment.yaml
```yaml
# Line 23: GCR 이미지 경로
image: gcr.io/PROJECT_ID/growai-backend:latest
# → gcr.io/your-actual-project-id/growai-backend:latest

# Line 32: Cloud SQL 연결 문자열
value: "jdbc:mysql://CLOUD_SQL_CONNECTION_NAME/growai?..."
# → jdbc:mysql://your-project:region:instance/growai?...

# Line 47: Redis 호스트
value: "REDIS_HOST"
# → 실제 Redis IP 주소
```

#### frontend-deployment.yaml
```yaml
# Line 23: GCR 이미지 경로
image: gcr.io/PROJECT_ID/growai-frontend:latest
# → gcr.io/your-actual-project-id/growai-frontend:latest
```

### Step 2: ConfigMap 적용

```bash
# Staging
kubectl apply -f configmap.yaml -n staging

# Production
kubectl apply -f configmap.yaml -n production

# 확인
kubectl get configmap -n staging
kubectl describe configmap backend-config -n staging
```

### Step 3: Deployment 적용

```bash
# Backend 배포 (Staging)
kubectl apply -f backend-deployment.yaml -n staging

# Frontend 배포 (Staging)
kubectl apply -f frontend-deployment.yaml -n staging

# 배포 상태 확인
kubectl get deployments -n staging
kubectl get pods -n staging -w
```

### Step 4: Service 적용

```bash
# Backend Service
kubectl apply -f backend-service.yaml -n staging

# Frontend Service
kubectl apply -f frontend-service.yaml -n staging

# Service 확인
kubectl get services -n staging
```

### Step 5: Ingress 적용

```bash
# Ingress 리소스 배포
kubectl apply -f ingress.yaml -n staging

# Ingress 상태 확인
kubectl get ingress -n staging
kubectl describe ingress growai-ingress -n staging

# 외부 IP 할당 대기 (5-10분 소요)
kubectl get ingress -n staging -w
```

### Step 6: HPA 적용

```bash
# Horizontal Pod Autoscaler 설정
kubectl apply -f hpa.yaml -n staging

# HPA 상태 확인
kubectl get hpa -n staging
```

### Step 7: PDB 적용

```bash
# Pod Disruption Budget 설정
kubectl apply -f pdb.yaml -n staging

# PDB 확인
kubectl get pdb -n staging
```

---

## 환경별 배포

### Staging 환경 전체 배포

```bash
# 한 번에 모든 리소스 배포
kubectl apply -f . -n staging

# 롤아웃 상태 확인
kubectl rollout status deployment/growai-backend -n staging
kubectl rollout status deployment/growai-frontend -n staging
```

### Production 환경 배포

```bash
# Production 네임스페이스에 배포
kubectl apply -f configmap.yaml -n production
kubectl apply -f backend-deployment.yaml -n production
kubectl apply -f frontend-deployment.yaml -n production
kubectl apply -f backend-service.yaml -n production
kubectl apply -f frontend-service.yaml -n production
kubectl apply -f ingress.yaml -n production
kubectl apply -f hpa.yaml -n production
kubectl apply -f pdb.yaml -n production

# 롤아웃 확인
kubectl rollout status deployment/growai-backend -n production
kubectl rollout status deployment/growai-frontend -n production
```

### 특정 버전 배포

```bash
# 특정 이미지 태그로 배포
kubectl set image deployment/growai-backend \
  growai-backend=gcr.io/$PROJECT_ID/growai-backend:v1.2.3 \
  -n production

kubectl set image deployment/growai-frontend \
  growai-frontend=gcr.io/$PROJECT_ID/growai-frontend:v1.2.3 \
  -n production
```

---

## 배포 검증

### 1. Pod 상태 확인

```bash
# 모든 Pod가 Running 상태인지 확인
kubectl get pods -n staging

# Pod 상세 정보
kubectl describe pod <pod-name> -n staging

# Pod 로그 확인
kubectl logs <pod-name> -n staging
kubectl logs -f <pod-name> -n staging  # 실시간 로그
```

### 2. 헬스체크 확인

```bash
# Backend 헬스체크
BACKEND_IP=$(kubectl get svc growai-backend -n staging -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
curl http://$BACKEND_IP:8081/actuator/health

# Frontend 헬스체크
FRONTEND_IP=$(kubectl get svc growai-frontend -n staging -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
curl http://$FRONTEND_IP/health
```

### 3. Ingress 확인

```bash
# Ingress IP 확인
kubectl get ingress growai-ingress -n staging

# 도메인으로 접근 테스트
curl -H "Host: growai-map.com" http://<INGRESS_IP>
curl -H "Host: api.growai-map.com" http://<INGRESS_IP>/actuator/health
```

### 4. 스모크 테스트

```bash
# API 엔드포인트 테스트
curl https://api.growai-map.com/actuator/health
curl https://api.growai-map.com/actuator/info

# 프론트엔드 접근 테스트
curl https://growai-map.com
```

---

## 롤백 절차

### 방법 1: kubectl rollout undo

```bash
# 이전 버전으로 롤백
kubectl rollout undo deployment/growai-backend -n production

# 특정 리비전으로 롤백
kubectl rollout history deployment/growai-backend -n production
kubectl rollout undo deployment/growai-backend --to-revision=3 -n production

# 롤백 상태 확인
kubectl rollout status deployment/growai-backend -n production
```

### 방법 2: 이전 이미지로 재배포

```bash
# 이전 버전 이미지로 변경
kubectl set image deployment/growai-backend \
  growai-backend=gcr.io/$PROJECT_ID/growai-backend:v1.2.2 \
  -n production
```

### 방법 3: 매니페스트 재적용

```bash
# Git에서 이전 버전 체크아웃
git checkout <previous-commit-hash> k8s/

# 재배포
kubectl apply -f backend-deployment.yaml -n production
```

---

## 스케일링

### 수동 스케일링

```bash
# Backend 스케일 아웃
kubectl scale deployment/growai-backend --replicas=5 -n production

# Frontend 스케일 아웃
kubectl scale deployment/growai-frontend --replicas=4 -n production

# 현재 레플리카 수 확인
kubectl get deployments -n production
```

### HPA 조정

```yaml
# hpa.yaml 수정
spec:
  minReplicas: 5      # 최소 레플리카 증가
  maxReplicas: 15     # 최대 레플리카 증가
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        averageUtilization: 60  # CPU 임계값 낮춤
```

```bash
# 변경사항 적용
kubectl apply -f hpa.yaml -n production

# HPA 상태 확인
kubectl get hpa -n production
kubectl describe hpa growai-backend-hpa -n production
```

---

## 모니터링

### 리소스 사용량 확인

```bash
# 노드 리소스 사용량
kubectl top nodes

# Pod 리소스 사용량
kubectl top pods -n production

# 특정 Pod의 상세 메트릭
kubectl top pod <pod-name> -n production --containers
```

### 로그 모니터링

```bash
# 모든 Backend Pod 로그
kubectl logs -l app=growai-backend -n production

# 최근 100줄
kubectl logs <pod-name> -n production --tail=100

# 실시간 스트리밍
kubectl logs -f <pod-name> -n production

# 여러 Pod 동시 모니터링 (stern 사용)
stern growai-backend -n production
```

### 이벤트 확인

```bash
# 네임스페이스 이벤트
kubectl get events -n production --sort-by='.lastTimestamp'

# 특정 리소스 이벤트
kubectl describe deployment growai-backend -n production
```

---

## 업데이트 전략

### Rolling Update (기본)

```yaml
# deployment.yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1         # 추가 생성 가능한 Pod 수
      maxUnavailable: 0   # 동시 중단 가능한 Pod 수
```

### Blue-Green Deployment

```bash
# Green 버전 배포
kubectl apply -f backend-deployment-green.yaml -n production

# 트래픽 전환 (Service selector 변경)
kubectl patch service growai-backend -n production \
  -p '{"spec":{"selector":{"version":"green"}}}'

# 이전 버전 제거
kubectl delete deployment growai-backend-blue -n production
```

### Canary Deployment

```bash
# Canary 버전 배포 (10% 트래픽)
kubectl apply -f backend-deployment-canary.yaml -n production

# Service가 두 버전 모두를 대상으로 하도록 설정
# 모니터링 후 문제 없으면 Canary 레플리카 증가
kubectl scale deployment/growai-backend-canary --replicas=3 -n production

# 기존 버전 축소
kubectl scale deployment/growai-backend --replicas=0 -n production
```

---

## 트러블슈팅

### Pod가 시작되지 않음

```bash
# Pod 상태 확인
kubectl get pods -n staging
kubectl describe pod <pod-name> -n staging

# 일반적인 원인:
# 1. 이미지 풀 실패
#    → GCR 권한 확인, 이미지 태그 확인

# 2. ConfigMap/Secret 누락
kubectl get configmap -n staging
kubectl get secret -n staging

# 3. 리소스 부족
kubectl describe nodes
kubectl top nodes
```

### Pod가 CrashLoopBackOff 상태

```bash
# 로그 확인
kubectl logs <pod-name> -n staging
kubectl logs <pod-name> -n staging --previous  # 이전 컨테이너 로그

# 일반적인 원인:
# 1. 애플리케이션 시작 실패
#    → 환경변수 확인, DB 연결 확인

# 2. 헬스체크 실패
kubectl describe pod <pod-name> -n staging
# → livenessProbe, readinessProbe 설정 확인
```

### Ingress가 작동하지 않음

```bash
# Ingress 상태 확인
kubectl get ingress -n staging
kubectl describe ingress growai-ingress -n staging

# 일반적인 원인:
# 1. 백엔드 서비스 문제
kubectl get services -n staging
kubectl get endpoints -n staging

# 2. SSL 인증서 문제
kubectl get managedcertificate -n staging
kubectl describe managedcertificate growai-cert -n staging

# 3. DNS 설정 문제
nslookup growai-map.com
dig growai-map.com
```

### 성능 문제

```bash
# 리소스 사용량 확인
kubectl top pods -n production

# HPA 상태 확인
kubectl get hpa -n production
kubectl describe hpa growai-backend-hpa -n production

# 메트릭 서버 확인
kubectl get deployment metrics-server -n kube-system

# 병목 지점 파악
kubectl logs <pod-name> -n production | grep -i "slow\|timeout\|error"
```

---

## 보안 권장사항

### 1. Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-network-policy
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: growai-backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: growai-frontend
    ports:
    - protocol: TCP
      port: 8081
```

### 2. RBAC 설정

```bash
# 최소 권한 원칙으로 ServiceAccount 생성
kubectl create serviceaccount growai-app -n production

# Role 바인딩
kubectl create rolebinding growai-app-binding \
  --role=view \
  --serviceaccount=production:growai-app \
  -n production
```

### 3. Secret 암호화

```bash
# GCP Secret Manager 사용
gcloud secrets create db-password --data-file=password.txt

# Kubernetes External Secrets 사용
kubectl apply -f external-secrets.yaml
```

---

## 유지보수

### 정기 작업

```bash
# 1. 미사용 리소스 정리
kubectl delete pods --field-selector=status.phase=Failed -n staging
kubectl delete pods --field-selector=status.phase=Succeeded -n staging

# 2. 이미지 정리
gcloud container images list --repository=gcr.io/$PROJECT_ID
gcloud container images delete gcr.io/$PROJECT_ID/growai-backend:old-tag

# 3. 로그 확인 및 보관
kubectl logs <pod-name> -n production > backup-$(date +%Y%m%d).log

# 4. 백업 확인
# Cloud SQL 자동 백업 확인
gcloud sql backups list --instance=growai-mysql
```

### 정기 점검 체크리스트

- [ ] Pod 상태 확인
- [ ] 리소스 사용량 확인
- [ ] 로그 에러 확인
- [ ] 백업 상태 확인
- [ ] 인증서 만료일 확인
- [ ] 보안 패치 확인
- [ ] HPA 메트릭 확인
- [ ] 비용 최적화 검토

---

## 참고 자료

- [Kubernetes 공식 문서](https://kubernetes.io/docs/)
- [GKE 문서](https://cloud.google.com/kubernetes-engine/docs)
- [kubectl 치트시트](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [GCP 베스트 프랙티스](https://cloud.google.com/architecture/best-practices-for-running-cost-effective-kubernetes-applications-on-gke)

---

## 지원

문제가 발생하면:
1. 본 가이드의 트러블슈팅 섹션 확인
2. Pod 로그 및 이벤트 확인
3. GCP 콘솔에서 모니터링 대시보드 확인
4. 필요시 DevOps 팀에 문의

---

**최종 업데이트**: 2026-02-01
**작성자**: Claude Code
