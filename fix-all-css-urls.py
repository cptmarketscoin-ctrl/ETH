#!/usr/bin/env python3
import re, os

css_dir = "C:/Users/Administrator/WorkBuddy/2026-05-05-task-1/klakna-github-pages/static/css"
fixed = 0
for fname in os.listdir(css_dir):
    if not fname.endswith('.css'):
        continue
    fpath = os.path.join(css_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    # Fix url(/static/...) to url(/ETH/static/...)
    content = re.sub(r'url\(\s*["\']?/', 'url(/ETH/static/', content)
    # Also fix url(/img/...) to url(/ETH/static/img/...) - wait, need to check actual paths
    if content != original:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        fixed += 1
        print(f"Fixed: {fname}")

print(f"\nTotal fixed: {fixed}")
