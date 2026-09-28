"""Shared helpers for the upload tools: where secrets live, JSON load/save, and the publish safety gate."""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
SECRETS = os.path.join(REPO, "studio", "secrets")  # git-ignored (see .gitignore)

sys.stdout.reconfigure(encoding="utf-8")


def secret_path(name):
    os.makedirs(SECRETS, exist_ok=True)
    return os.path.join(SECRETS, name)


def load(name, required=True):
    p = secret_path(name)
    if not os.path.exists(p):
        if required:
            sys.exit(f"missing {p}: see studio/tools/publish/SETUP.md")
        return {}
    return json.load(open(p, encoding="utf-8"))


def save(name, data):
    p = secret_path(name)
    json.dump(data, open(p, "w", encoding="utf-8"), indent=1)
    return p


def mask(s):
    return s[:6] + "…" + s[-4:] if s and len(s) > 12 else "***"


def gate(summary, yes):
    """Nothing goes out without --yes. Without it, show exactly what would be posted and stop."""
    print("\n" + summary)
    if not yes:
        print("\nDRY RUN: nothing was uploaded. Re-run with --yes to post (only after the owner has said OK).")
        sys.exit(0)
