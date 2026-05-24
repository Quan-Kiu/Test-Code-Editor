#!/usr/bin/env python3
"""Compatibility wrapper for playbook bootstrap commands.

This wrapper delegates to install_harness.py and preserves the historical
bootstrap command shape while performing the current selective, non-destructive
install by mode, runtime, project type, and phase.
"""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

PHASES = ["bootstrap", "guided-build", "implementation", "validation", "game-adoption", "release"]


def main() -> int:
    parser = argparse.ArgumentParser(description="Compatibility wrapper around install_harness.py")
    parser.add_argument("--target", required=True, help="target project directory")
    parser.add_argument("--mode", default="mvp", choices=["learning", "mvp", "real-project", "production"])
    parser.add_argument("--runtime", default="generic", choices=["generic", "claude", "hermes"])
    parser.add_argument("--project-type", default="none")
    parser.add_argument("--phase", default="bootstrap", choices=PHASES, help="phase-scoped selection to install")
    parser.add_argument("--merge", action="store_true")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    installer = Path(__file__).resolve().with_name("install_harness.py")
    if not installer.exists():
        raise SystemExit(f"install_harness.py not found next to bootstrap wrapper: {installer}")

    cmd = [
        sys.executable, str(installer),
        "--target", args.target,
        "--mode", args.mode,
        "--runtime", args.runtime,
        "--project-type", args.project_type,
        "--phase", args.phase,
    ]
    if args.dry_run:
        cmd.append("--dry-run")
    if args.merge:
        cmd.append("--merge")
    if args.force:
        cmd.append("--force")

    print("bootstrap_playbook.py compatibility wrapper", flush=True)
    print(f"phase: {args.phase} (selective harness install)", flush=True)
    result = subprocess.run(cmd, text=True, capture_output=True)
    if result.stdout:
        print(result.stdout, end="")
    if result.stderr:
        print(result.stderr, end="", file=sys.stderr)
    return result.returncode


if __name__ == "__main__":
    raise SystemExit(main())
