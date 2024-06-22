#!/bin/bash

if [[ -n $(git status --porcelain) ]]; then
  git config user.name github-actions
  git config user.email github-actions@github.com
  git add .
  git commit -m "generated"
  git push
fi