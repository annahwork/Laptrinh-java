param(
    [string]$RepoDir = "D:\Code_java\Laptrinh-java\Project_Java",
    [string]$CommitMsg = "Update project files",
    [string]$RemoteUrl = "https://github.com/annahwork/Laptrinh-java.git",
    [string]$Branch = "le-van-khoi"
)

Set-Location $RepoDir

Write-Output "Repo: $(Get-Location)"
git status --porcelain

git add -A
$staged = (git diff --cached --name-only)
if ($staged) {
    git commit -m $CommitMsg
} else {
    Write-Output "No staged changes to commit."
}

if (git show-ref --verify --quiet "refs/heads/$Branch") {
    git checkout $Branch
} else {
    git checkout -b $Branch
}

try {
    git remote get-url origin | Out-Null
    git remote set-url origin $RemoteUrl
} catch {
    git remote add origin $RemoteUrl
}

$exists = git ls-remote --heads origin $Branch | Select-String $Branch
if ($exists) {
    git fetch origin $Branch
    git rebase "origin/$Branch"
}

git push -u origin $Branch
Write-Output "Pushed to origin/$Branch"
