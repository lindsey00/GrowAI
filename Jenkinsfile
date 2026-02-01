pipeline {
    agent any

    environment {
        // GCP Configuration
        GCP_PROJECT_ID = credentials('gcp-project-id')
        GCP_REGION = 'asia-northeast3'
        GCP_ZONE = 'asia-northeast3-a'
        GKE_CLUSTER = 'growai-cluster'

        // Docker Registry
        DOCKER_REGISTRY = 'gcr.io'
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/${GCP_PROJECT_ID}/growai-backend"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/${GCP_PROJECT_ID}/growai-frontend"

        // Build metadata
        GIT_COMMIT_SHORT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
        BUILD_TAG = "${env.BRANCH_NAME}-${GIT_COMMIT_SHORT}-${env.BUILD_NUMBER}"

        // Credentials
        GCP_SA_KEY = credentials('gcp-service-account-key')
        SLACK_WEBHOOK = credentials('slack-webhook-url')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out code from ${env.GIT_BRANCH} branch..."
                checkout scm

                script {
                    env.GIT_COMMIT_MSG = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
                }
            }
        }

        stage('Build') {
            parallel {
                stage('Build Backend') {
                    agent {
                        docker {
                            image 'gradle:8.5-jdk17-alpine'
                            args '-v gradle-cache:/home/gradle/.gradle'
                        }
                    }
                    steps {
                        dir('backend') {
                            echo 'Building backend application...'
                            sh '''
                                chmod +x gradlew
                                ./gradlew clean build --no-daemon -x test
                            '''

                            // Archive JAR
                            archiveArtifacts artifacts: 'build/libs/*.jar', fingerprint: true
                        }
                    }
                }

                stage('Build Frontend') {
                    agent {
                        docker {
                            image 'node:20-alpine'
                            args '-v npm-cache:/root/.npm'
                        }
                    }
                    steps {
                        dir('frontend') {
                            echo 'Building frontend application...'
                            sh '''
                                npm ci
                                npm run build
                            '''

                            // Archive build artifacts
                            archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                        }
                    }
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    agent {
                        docker {
                            image 'gradle:8.5-jdk17-alpine'
                            args '-v gradle-cache:/home/gradle/.gradle'
                        }
                    }
                    steps {
                        dir('backend') {
                            echo 'Running backend tests...'
                            sh './gradlew test --no-daemon'

                            // Publish test results
                            junit 'build/test-results/test/*.xml'
                        }
                    }
                }

                stage('Frontend Lint') {
                    agent {
                        docker {
                            image 'node:20-alpine'
                        }
                    }
                    steps {
                        dir('frontend') {
                            echo 'Running frontend linter...'
                            sh 'npm run lint || true'
                        }
                    }
                }
            }
        }

        stage('Docker Build & Push') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    echo "Building and pushing Docker images with tag: ${BUILD_TAG}"

                    // Authenticate with GCR
                    sh '''
                        echo "${GCP_SA_KEY}" | docker login -u _json_key --password-stdin https://gcr.io
                    '''

                    // Build and push backend image
                    dir('backend') {
                        sh """
                            docker build -t ${BACKEND_IMAGE}:${BUILD_TAG} .
                            docker tag ${BACKEND_IMAGE}:${BUILD_TAG} ${BACKEND_IMAGE}:latest
                            docker push ${BACKEND_IMAGE}:${BUILD_TAG}
                            docker push ${BACKEND_IMAGE}:latest
                        """
                    }

                    // Build and push frontend image
                    dir('frontend') {
                        sh """
                            docker build -t ${FRONTEND_IMAGE}:${BUILD_TAG} .
                            docker tag ${FRONTEND_IMAGE}:${BUILD_TAG} ${FRONTEND_IMAGE}:latest
                            docker push ${FRONTEND_IMAGE}:${BUILD_TAG}
                            docker push ${FRONTEND_IMAGE}:latest
                        """
                    }
                }
            }
        }

        stage('Security Scan') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    echo 'Running Trivy security scan...'

                    // Scan backend image
                    sh """
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                            aquasec/trivy:latest image --severity HIGH,CRITICAL \
                            ${BACKEND_IMAGE}:${BUILD_TAG} || true
                    """

                    // Scan frontend image
                    sh """
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                            aquasec/trivy:latest image --severity HIGH,CRITICAL \
                            ${FRONTEND_IMAGE}:${BUILD_TAG} || true
                    """
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            environment {
                NAMESPACE = 'staging'
            }
            steps {
                script {
                    echo "Deploying to staging environment..."

                    // Authenticate with GKE
                    sh '''
                        gcloud auth activate-service-account --key-file=${GCP_SA_KEY}
                        gcloud config set project ${GCP_PROJECT_ID}
                        gcloud container clusters get-credentials ${GKE_CLUSTER} \
                            --zone ${GCP_ZONE} --project ${GCP_PROJECT_ID}
                    '''

                    // Deploy to Kubernetes
                    sh """
                        kubectl set image deployment/growai-backend \
                            growai-backend=${BACKEND_IMAGE}:${BUILD_TAG} \
                            -n ${NAMESPACE}

                        kubectl set image deployment/growai-frontend \
                            growai-frontend=${FRONTEND_IMAGE}:${BUILD_TAG} \
                            -n ${NAMESPACE}

                        # Wait for rollout
                        kubectl rollout status deployment/growai-backend -n ${NAMESPACE} --timeout=5m
                        kubectl rollout status deployment/growai-frontend -n ${NAMESPACE} --timeout=5m
                    """
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            environment {
                NAMESPACE = 'production'
            }
            steps {
                script {
                    // Request manual approval
                    timeout(time: 10, unit: 'MINUTES') {
                        input message: 'Deploy to production?', ok: 'Deploy'
                    }

                    echo "Deploying to production environment..."

                    // Authenticate with GKE
                    sh '''
                        gcloud auth activate-service-account --key-file=${GCP_SA_KEY}
                        gcloud config set project ${GCP_PROJECT_ID}
                        gcloud container clusters get-credentials ${GKE_CLUSTER} \
                            --zone ${GCP_ZONE} --project ${GCP_PROJECT_ID}
                    '''

                    // Deploy to Kubernetes
                    sh """
                        kubectl set image deployment/growai-backend \
                            growai-backend=${BACKEND_IMAGE}:${BUILD_TAG} \
                            -n ${NAMESPACE}

                        kubectl set image deployment/growai-frontend \
                            growai-frontend=${FRONTEND_IMAGE}:${BUILD_TAG} \
                            -n ${NAMESPACE}

                        # Wait for rollout
                        kubectl rollout status deployment/growai-backend -n ${NAMESPACE} --timeout=10m
                        kubectl rollout status deployment/growai-frontend -n ${NAMESPACE} --timeout=10m
                    """
                }
            }
        }

        stage('Smoke Tests') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    def namespace = env.BRANCH_NAME == 'main' ? 'production' : 'staging'

                    echo "Running smoke tests in ${namespace}..."

                    sh """
                        # Get service endpoints
                        BACKEND_IP=\$(kubectl get svc growai-backend -n ${namespace} -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
                        FRONTEND_IP=\$(kubectl get svc growai-frontend -n ${namespace} -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

                        # Test backend health
                        curl -f http://\${BACKEND_IP}:8081/actuator/health || exit 1

                        # Test frontend accessibility
                        curl -f http://\${FRONTEND_IP} || exit 1

                        echo "Smoke tests passed!"
                    """
                }
            }
        }
    }

    post {
        success {
            script {
                def message = """
                    ✅ *GrowAI-MAP Build SUCCESS*
                    Branch: ${env.BRANCH_NAME}
                    Build: #${env.BUILD_NUMBER}
                    Commit: ${GIT_COMMIT_SHORT}
                    Tag: ${BUILD_TAG}
                    Message: ${env.GIT_COMMIT_MSG}
                    Duration: ${currentBuild.durationString}
                """.stripIndent()

                sh """
                    curl -X POST ${SLACK_WEBHOOK} \
                        -H 'Content-Type: application/json' \
                        -d '{"text": "${message}"}'
                """
            }
        }

        failure {
            script {
                def message = """
                    ❌ *GrowAI-MAP Build FAILED*
                    Branch: ${env.BRANCH_NAME}
                    Build: #${env.BUILD_NUMBER}
                    Commit: ${GIT_COMMIT_SHORT}
                    Message: ${env.GIT_COMMIT_MSG}
                    Duration: ${currentBuild.durationString}
                """.stripIndent()

                sh """
                    curl -X POST ${SLACK_WEBHOOK} \
                        -H 'Content-Type: application/json' \
                        -d '{"text": "${message}"}'
                """
            }
        }

        always {
            // Cleanup
            cleanWs()
        }
    }
}
