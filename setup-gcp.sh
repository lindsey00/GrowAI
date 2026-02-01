#!/bin/bash
# GCP 초기 설정 스크립트
# GrowAI-MAP 프로젝트를 GCP에 배포하기 위한 환경 구성

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# 로그 함수
log_info() {
    echo -e "${CYAN}[INFO] $1${NC}"
}

log_success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

log_error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

echo "================================================================================"
echo "  GrowAI-MAP GCP 초기 설정"
echo "================================================================================"
echo ""

# 1. 환경 변수 설정
log_info "환경 변수 설정 중..."
echo ""

read -p "GCP Project ID를 입력하세요: " PROJECT_ID
read -p "GCP Region (기본값: asia-northeast3): " REGION
REGION=${REGION:-asia-northeast3}

read -p "GKE Cluster 이름 (기본값: growai-cluster): " CLUSTER_NAME
CLUSTER_NAME=${CLUSTER_NAME:-growai-cluster}

read -p "GKE Zone (기본값: asia-northeast3-a): " ZONE
ZONE=${ZONE:-asia-northeast3-a}

export PROJECT_ID
export REGION
export CLUSTER_NAME
export ZONE

log_success "환경 변수 설정 완료"
echo ""

# 2. gcloud 설정
log_info "gcloud 설정 중..."

gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION
gcloud config set compute/zone $ZONE

log_success "gcloud 설정 완료"
echo ""

# 3. 필요한 API 활성화
log_info "필요한 GCP API 활성화 중..."

APIS=(
    "compute.googleapis.com"
    "container.googleapis.com"
    "containerregistry.googleapis.com"
    "cloudbuild.googleapis.com"
    "cloudresourcemanager.googleapis.com"
    "iam.googleapis.com"
    "run.googleapis.com"
    "sqladmin.googleapis.com"
    "servicenetworking.googleapis.com"
    "redis.googleapis.com"
    "monitoring.googleapis.com"
    "logging.googleapis.com"
)

for API in "${APIS[@]}"; do
    log_info "  - $API 활성화 중..."
    gcloud services enable $API --project=$PROJECT_ID
done

log_success "모든 API 활성화 완료"
echo ""

# 4. GKE 클러스터 생성
log_info "GKE 클러스터 생성 중..."

gcloud container clusters create $CLUSTER_NAME \
    --zone $ZONE \
    --num-nodes 3 \
    --machine-type n1-standard-2 \
    --disk-size 50 \
    --disk-type pd-standard \
    --enable-autoscaling \
    --min-nodes 2 \
    --max-nodes 10 \
    --enable-autorepair \
    --enable-autoupgrade \
    --enable-ip-alias \
    --network "default" \
    --subnetwork "default" \
    --enable-stackdriver-kubernetes \
    --addons HorizontalPodAutoscaling,HttpLoadBalancing,GcePersistentDiskCsiDriver

log_success "GKE 클러스터 생성 완료"
echo ""

# 5. kubectl 설정
log_info "kubectl 자격 증명 가져오기..."

gcloud container clusters get-credentials $CLUSTER_NAME \
    --zone $ZONE \
    --project $PROJECT_ID

log_success "kubectl 설정 완료"
echo ""

# 6. Kubernetes 네임스페이스 생성
log_info "Kubernetes 네임스페이스 생성 중..."

kubectl create namespace staging || log_warning "staging 네임스페이스가 이미 존재합니다"
kubectl create namespace production || log_warning "production 네임스페이스가 이미 존재합니다"

log_success "네임스페이스 생성 완료"
echo ""

# 7. Cloud SQL 인스턴스 생성
log_info "Cloud SQL 인스턴스 생성 중..."

INSTANCE_NAME="growai-mysql"

gcloud sql instances create $INSTANCE_NAME \
    --database-version=MYSQL_8_0 \
    --tier=db-n1-standard-2 \
    --region=$REGION \
    --storage-type=SSD \
    --storage-size=50GB \
    --storage-auto-increase \
    --backup \
    --backup-start-time=03:00 \
    --maintenance-window-day=SUN \
    --maintenance-window-hour=04 \
    --enable-bin-log

log_success "Cloud SQL 인스턴스 생성 완료"
echo ""

# 8. 데이터베이스 생성
log_info "데이터베이스 생성 중..."

gcloud sql databases create growai \
    --instance=$INSTANCE_NAME \
    --charset=utf8mb4 \
    --collation=utf8mb4_unicode_ci

log_success "데이터베이스 생성 완료"
echo ""

# 9. 데이터베이스 사용자 생성
log_info "데이터베이스 사용자 생성 중..."

read -sp "MySQL 비밀번호를 입력하세요: " MYSQL_PASSWORD
echo ""

gcloud sql users create growaiuser \
    --instance=$INSTANCE_NAME \
    --password=$MYSQL_PASSWORD

log_success "데이터베이스 사용자 생성 완료"
echo ""

# 10. Redis 인스턴스 생성
log_info "Redis 인스턴스 생성 중..."

REDIS_INSTANCE="growai-redis"

gcloud redis instances create $REDIS_INSTANCE \
    --size=1 \
    --region=$REGION \
    --redis-version=redis_7_0 \
    --tier=basic

log_success "Redis 인스턴스 생성 완료"
echo ""

# 11. Kubernetes Secret 생성
log_info "Kubernetes Secret 생성 중..."

# Staging 네임스페이스
kubectl create secret generic db-credentials \
    --from-literal=username=growaiuser \
    --from-literal=password=$MYSQL_PASSWORD \
    --from-literal=database=growai \
    --namespace=staging \
    --dry-run=client -o yaml | kubectl apply -f -

# Production 네임스페이스
kubectl create secret generic db-credentials \
    --from-literal=username=growaiuser \
    --from-literal=password=$MYSQL_PASSWORD \
    --from-literal=database=growai \
    --namespace=production \
    --dry-run=client -o yaml | kubectl apply -f -

log_success "Kubernetes Secret 생성 완료"
echo ""

# 12. Static IP 예약
log_info "Static IP 주소 예약 중..."

gcloud compute addresses create growai-frontend-ip \
    --region=$REGION \
    --network-tier=PREMIUM

gcloud compute addresses create growai-backend-ip \
    --region=$REGION \
    --network-tier=PREMIUM

FRONTEND_IP=$(gcloud compute addresses describe growai-frontend-ip --region=$REGION --format="get(address)")
BACKEND_IP=$(gcloud compute addresses describe growai-backend-ip --region=$REGION --format="get(address)")

log_success "Static IP 예약 완료"
log_info "  Frontend IP: $FRONTEND_IP"
log_info "  Backend IP: $BACKEND_IP"
echo ""

# 13. Service Account 생성
log_info "Service Account 생성 중..."

SA_NAME="growai-deployer"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud iam service-accounts create $SA_NAME \
    --display-name="GrowAI-MAP Deployer" \
    --description="Service account for GrowAI-MAP deployment"

# 권한 부여
ROLES=(
    "roles/container.developer"
    "roles/cloudsql.client"
    "roles/storage.admin"
    "roles/cloudbuild.builds.editor"
    "roles/redis.editor"
)

for ROLE in "${ROLES[@]}"; do
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:${SA_EMAIL}" \
        --role="$ROLE"
done

# Key 생성
gcloud iam service-accounts keys create ~/growai-key.json \
    --iam-account=$SA_EMAIL

log_success "Service Account 생성 완료"
log_info "  Key 파일: ~/growai-key.json"
echo ""

# 14. Cloud Storage 버킷 생성
log_info "Cloud Storage 버킷 생성 중..."

BUCKET_NAME="${PROJECT_ID}-growai-storage"

gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$BUCKET_NAME/ || log_warning "버킷이 이미 존재합니다"

# 버킷 권한 설정
gsutil iam ch serviceAccount:${SA_EMAIL}:objectAdmin gs://$BUCKET_NAME/

log_success "Cloud Storage 버킷 생성 완료"
log_info "  Bucket: gs://$BUCKET_NAME"
echo ""

# 15. 설정 요약
echo "================================================================================"
log_success "GCP 초기 설정 완료!"
echo "================================================================================"
echo ""
log_info "설정 요약:"
echo "  - Project ID: $PROJECT_ID"
echo "  - Region: $REGION"
echo "  - Zone: $ZONE"
echo "  - GKE Cluster: $CLUSTER_NAME"
echo "  - Cloud SQL Instance: $INSTANCE_NAME"
echo "  - Redis Instance: $REDIS_INSTANCE"
echo "  - Frontend IP: $FRONTEND_IP"
echo "  - Backend IP: $BACKEND_IP"
echo "  - Service Account: $SA_EMAIL"
echo "  - Storage Bucket: gs://$BUCKET_NAME"
echo ""
log_info "다음 단계:"
echo "  1. GitHub Secrets에 다음 값 추가:"
echo "     - GCP_PROJECT_ID: $PROJECT_ID"
echo "     - GCP_SA_KEY: (~/growai-key.json 파일 내용)"
echo "     - SLACK_WEBHOOK_URL: (선택사항)"
echo ""
echo "  2. DNS 설정:"
echo "     - growai-map.com → $FRONTEND_IP"
echo "     - api.growai-map.com → $BACKEND_IP"
echo ""
echo "  3. Kubernetes 배포 매니페스트 적용:"
echo "     kubectl apply -f k8s/"
echo ""
echo "  4. GitHub Actions 워크플로우 트리거:"
echo "     git push origin develop  # staging 배포"
echo "     git push origin main     # production 배포"
echo ""
echo "================================================================================"

# 16. 설정 파일 저장
cat > gcp-config.env << EOF
export PROJECT_ID=$PROJECT_ID
export REGION=$REGION
export ZONE=$ZONE
export CLUSTER_NAME=$CLUSTER_NAME
export INSTANCE_NAME=$INSTANCE_NAME
export REDIS_INSTANCE=$REDIS_INSTANCE
export FRONTEND_IP=$FRONTEND_IP
export BACKEND_IP=$BACKEND_IP
export SA_EMAIL=$SA_EMAIL
export BUCKET_NAME=$BUCKET_NAME
EOF

log_success "설정이 gcp-config.env 파일에 저장되었습니다"
log_info "다음 명령어로 환경 변수를 로드할 수 있습니다:"
echo "  source gcp-config.env"
echo ""
