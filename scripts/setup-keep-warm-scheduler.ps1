# Script de automação para o Cloud Scheduler Anti-Cold Start no GCP
# Mantém o container do Cloud Run sempre aquecido sem custo adicional (Free Tier)

param (
    [string]$ProjectId = "medstudy-497617",
    [string]$Location = "us-central1",
    [string]$JobName = "medstudy-backend-keep-warm",
    [string]$TargetUri = "https://medstudy-backend-142872223826.us-central1.run.app/api/health/ping",
    [string]$Schedule = "*/10 * * * *",
    [string]$TimeZone = "America/Sao_Paulo"
)

Write-Host "==> Verificando/Habilitando API cloudscheduler.googleapis.com no projeto $ProjectId..." -ForegroundColor Cyan
gcloud services enable cloudscheduler.googleapis.com --project=$ProjectId

Write-Host "==> Verificando se o job $JobName já existe..." -ForegroundColor Cyan
$existingJob = gcloud scheduler jobs list --project=$ProjectId --location=$Location --filter="NAME:$JobName" --format="value(NAME)" 2>$null

if ($existingJob) {
    Write-Host "==> Job já existe. Atualizando configurações..." -ForegroundColor Yellow
    gcloud scheduler jobs update http $JobName `
        --project=$ProjectId `
        --location=$Location `
        --schedule=$Schedule `
        --time-zone=$TimeZone `
        --uri=$TargetUri `
        --http-method=GET `
        --description="Ping a cada 10 minutos para evitar cold start no Cloud Run backend" `
        --max-retry-attempts=1 `
        --attempt-deadline=30s
} else {
    Write-Host "==> Criando novo Cloud Scheduler Job..." -ForegroundColor Green
    gcloud scheduler jobs create http $JobName `
        --project=$ProjectId `
        --location=$Location `
        --schedule=$Schedule `
        --time-zone=$TimeZone `
        --uri=$TargetUri `
        --http-method=GET `
        --description="Ping a cada 10 minutos para evitar cold start no Cloud Run backend" `
        --max-retry-attempts=1 `
        --attempt-deadline=30s
}

Write-Host "==> Status do Cloud Scheduler Job:" -ForegroundColor Cyan
gcloud scheduler jobs describe $JobName --project=$ProjectId --location=$Location
