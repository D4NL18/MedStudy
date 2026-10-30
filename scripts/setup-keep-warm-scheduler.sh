#!/usr/bin/env bash
# Script de automação para o Cloud Scheduler Anti-Cold Start no GCP
# Mantém o container do Cloud Run sempre aquecido sem custo adicional (Free Tier)

set -euo pipefail

PROJECT_ID="${1:-medstudy-497617}"
LOCATION="${2:-us-central1}"
JOB_NAME="${3:-medstudy-backend-keep-warm}"
TARGET_URI="${4:-https://medstudy-backend-142872223826.us-central1.run.app/api/health/ping}"
SCHEDULE="${5:-*/10 * * * *}"
TIME_ZONE="${6:-America/Sao_Paulo}"

echo "==> Verificando/Habilitando API cloudscheduler.googleapis.com no projeto $PROJECT_ID..."
gcloud services enable cloudscheduler.googleapis.com --project="$PROJECT_ID"

echo "==> Verificando se o job $JOB_NAME já existe..."
if gcloud scheduler jobs describe "$JOB_NAME" --project="$PROJECT_ID" --location="$LOCATION" >/dev/null 2>&1; then
    echo "==> Job já existe. Atualizando configurações..."
    gcloud scheduler jobs update http "$JOB_NAME" \
        --project="$PROJECT_ID" \
        --location="$LOCATION" \
        --schedule="$SCHEDULE" \
        --time-zone="$TIME_ZONE" \
        --uri="$TARGET_URI" \
        --http-method=GET \
        --description="Ping a cada 10 minutos para evitar cold start no Cloud Run backend" \
        --max-retry-attempts=1 \
        --attempt-deadline=30s
else
    echo "==> Criando novo Cloud Scheduler Job..."
    gcloud scheduler jobs create http "$JOB_NAME" \
        --project="$PROJECT_ID" \
        --location="$LOCATION" \
        --schedule="$SCHEDULE" \
        --time-zone="$TIME_ZONE" \
        --uri="$TARGET_URI" \
        --http-method=GET \
        --description="Ping a cada 10 minutos para evitar cold start no Cloud Run backend" \
        --max-retry-attempts=1 \
        --attempt-deadline=30s
fi

echo "==> Status do Cloud Scheduler Job:"
gcloud scheduler jobs describe "$JOB_NAME" --project="$PROJECT_ID" --location="$LOCATION"
