#!/usr/bin/env bash
set -e

REPO_DIR="${1:-/d/Code_java/Laptrinh-java/Project_Java}"
REMOTE_URL="https://github.com/annahwork/Laptrinh-java.git"
BRANCH="le-van-khoi"
COMMIT_MSG="${2:-Update project files}"

cd "$REPO_DIR" || { echo "Repo dir not found: $REPO_DIR"; exit 1; }

echo "Repo: $(pwd)"
git status --porcelain

# add & commit if changes
git add -A
if git diff --cached --quiet; then
  echo "No staged changes to commit."
else
  git commit -m "$COMMIT_MSG"
fi

# ensure branch
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git checkout "$BRANCH"
else
  git checkout -b "$BRANCH"
fi

# set remote origin URL
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi

# fetch remote branch and rebase to avoid non-fast-forward
if git ls-remote --heads origin "$BRANCH" | grep -q "$BRANCH"; then
  git fetch origin "$BRANCH"
  git rebase "origin/$BRANCH" || { echo "Rebase conflict: resolve then run git rebase --continue"; exit 1; }
fi

# push
git push -u origin "$BRANCH"
echo "Pushed to origin/$BRANCH"
