#!/usr/bin/env python3
import os, subprocess, concurrent.futures, sys

BASE = "https://www.klakna.sbs"
DEST = "C:/Users/Administrator/WorkBuddy/2026-05-05-task-1/klakna-github-pages/static/css"

# Read CSS chunk IDs from the file created earlier
with open('/tmp/css_chunk_ids.txt') as f:
    ids = [line.strip() for line in f if line.strip()]

print(f"Total CSS chunk IDs in webpack: {len(ids)}")

# Check which ones are missing
missing = []
for cid in ids:
    fpath = os.path.join(DEST, f"{cid}.1774378911945.css")
    if not os.path.exists(fpath):
        missing.append(cid)

print(f"Missing locally: {len(missing)}")
print(f"Already exist: {len(ids) - len(missing)}")

def download(cid):
    url = f"{BASE}/static/css/{cid}.1774378911945.css"
    fpath = os.path.join(DEST, f"{cid}.1774378911945.css")
    try:
        result = subprocess.run(
            ['curl', '-sk', '--connect-timeout', '5', url, '-o', fpath],
            capture_output=True, timeout=10
        )
        if os.path.exists(fpath) and os.path.getsize(fpath) > 200:
            # Check if it's a 404 page
            with open(fpath, 'rb') as f:
                header = f.read(100)
                if b'404' in header or b'nginx' in header:
                    os.remove(fpath)
                    return cid, False, "404"
            return cid, True, f"{os.path.getsize(fpath)} bytes"
        else:
            if os.path.exists(fpath):
                os.remove(fpath)
            return cid, False, "empty"
    except Exception as e:
        return cid, False, str(e)

# Download in parallel (10 workers)
ok = 0
fail = 0
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    futures = {executor.submit(download, cid): cid for cid in missing}
    for future in concurrent.futures.as_completed(futures):
        cid, success, msg = future.result()
        if success:
            ok += 1
            if ok % 10 == 0:
                print(f"  ✓ {cid}: {msg}")
        else:
            fail += 1
            print(f"  ✗ {cid}: {msg}")

print(f"\nDone: {ok} downloaded, {fail} failed")
