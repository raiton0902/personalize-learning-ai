param(
    [string]$SpaceRepo = "Kaizennnn/personal-learning"
)

$ErrorActionPreference = "Stop"

$Token = $env:HF_TOKEN
if (-not $Token) {
    $Token = Read-Host -Prompt "Paste your Hugging Face Write Token (hf_...)"
}
$Token = $Token.Trim()
if (-not $Token.StartsWith("hf_")) {
    Write-Error "Invalid token. The token should start with 'hf_'."
    exit 1
}

$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$StageDir = Join-Path $env:TEMP ("hf-space-push-" + [guid]::NewGuid().ToString("N").Substring(0, 8))

Write-Host "Preparing clean deployment bundle in $StageDir ..."
New-Item -ItemType Directory -Path $StageDir -Force | Out-Null

try {
    foreach ($file in @("README.md", "requirements.txt", "packages.txt", "Dockerfile", ".dockerignore")) {
        $src = Join-Path $RepoRoot $file
        if (Test-Path $src) {
            Copy-Item -Path $src -Destination (Join-Path $StageDir $file) -Force
        }
    }

    $AppDest = Join-Path $StageDir "app"
    New-Item -ItemType Directory -Path $AppDest -Force | Out-Null

    # Copy top-level app files (*.py, *.ps1, *.css, *.toml), excluding .env and secrets
    Get-ChildItem -Path (Join-Path $RepoRoot "app") -File | Where-Object {
        $_.Name -notmatch '^(\.env.*|.*\.(sqlite3|db|key|pyc))$'
    } | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination (Join-Path $AppDest $_.Name) -Force
    }

    # Copy app/web and app/sample_materials
    foreach ($sub in @("web", "sample_materials")) {
        $subSrc = Join-Path (Join-Path $RepoRoot "app") $sub
        if (Test-Path $subSrc) {
            Copy-Item -Path $subSrc -Destination (Join-Path $AppDest $sub) -Recurse -Force
        }
    }

    Push-Location $StageDir
    try {
        git init -b main | Out-Null
        git config user.name "Kaizennnn"
        git config user.email "kaizennnn@users.noreply.huggingface.co"
        git lfs install --local | Out-Null
        git lfs track "*.woff2" "*.ttf" "*.ttc" "*.png" "*.jpg" "*.jpeg" "*.webp" | Out-Null
        git add .gitattributes | Out-Null
        git add -A | Out-Null
        git commit -m "Deploy Personal Learning to Hugging Face Space" | Out-Null

        Write-Host "Pushing to https://huggingface.co/spaces/$SpaceRepo ..."
        $RemoteUrl = "https://Kaizennnn:$Token@huggingface.co/spaces/$SpaceRepo"
        git push --force $RemoteUrl HEAD:main
        Write-Host "Done! Open https://huggingface.co/spaces/$SpaceRepo to watch the build."
    } finally {
        Pop-Location
    }
} finally {
    if (Test-Path $StageDir) {
        Remove-Item -Path $StageDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
