param(
    [Parameter(Mandatory=$true)]
    [string]$SourcePath,

    [string]$TargetFile = "Frontend/public/images/razorpay-qr.png"
)

$absSource = Resolve-Path -Path $SourcePath -ErrorAction Stop
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$targetFull = Join-Path -Path $projectRoot -ChildPath $TargetFile
$targetDir = Split-Path -Parent $targetFull

if (!(Test-Path -Path $absSource)) {
    Write-Error "Source file not found: $SourcePath"
    exit 1
}

if (!(Test-Path -Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

Copy-Item -Path $absSource -Destination $targetFull -Force
Write-Host "Copied $absSource to $targetFull" -ForegroundColor Green
