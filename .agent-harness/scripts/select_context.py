#!/usr/bin/env python3
"""Select required harness/project-playbook context for a mode/runtime/project-type/task.

Works in both forms:
- distributable harness package: docs live under project-playbook/
- installed project repo: docs live at repo root under docs/
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Iterable

HARNESS_ROOT = Path(__file__).resolve().parents[2]
MATRIX_CANDIDATES = [
    HARNESS_ROOT / "docs" / "mode-requirements.json",
    HARNESS_ROOT / "project-playbook" / "docs" / "mode-requirements.json",
]

TASK_CONTEXT = {
    "guided-build": [
        "docs/guided-build-workflow.md",
        "docs/project-brief.md",
        "docs/requirements.md",
        "docs/product.md",
        "docs/stories.md",
        "docs/architecture.md",
        "docs/roles-and-raci.md",
        "docs/signoff-ledger.md",
        "docs/traceability-matrix.md",
    ],
    "game-adoption": [
        "docs/game-project-adoption.md",
        "docs/adoption-existing-project.md",
        "DESIGN.md",
        "docs/design-brief.md",
        "docs/component-contract.md",
        "docs/browser-testing.md",
        "docs/visual-qa.md",
        "docs/design-assets.md",
        "docs/playtest-protocol.md",
        ".agent-harness/checklists/game-player-facing-readiness.md",
        "docs/project-brief.md",
        "docs/requirements.md",
        "docs/product.md",
        "docs/stories.md",
        "docs/code-architecture.md",
        "docs/validation.md",
        "docs/risk-register.md",
        "docs/definition-of-done.md",
        "docs/evidence-ledger.md",
        "DESIGN.md",
        "docs/component-contract.md",
        "docs/browser-testing.md",
        "docs/visual-qa.md",
        "docs/test-matrix.md",
        ".agent-harness/workflows/game-sandbox-to-local.md",
        ".agent-harness/checklists/game-playability.md",
    ],
    "web3d-game": [
        "docs/game-project-adoption.md",
        "docs/3d-web-game-architecture.md",
        "docs/3d-asset-pipeline.md",
        "docs/3d-physics-workers.md",
        "docs/3d-multiplayer-security.md",
        "docs/3d-browser-testing.md",
        ".agent-harness/checklists/3d-web-game-readiness.md",
        "DESIGN.md",
        "docs/design-brief.md",
        "docs/component-contract.md",
        "docs/browser-testing.md",
        "docs/visual-qa.md",
        "docs/design-assets.md",
        "docs/license-compliance.md",
        "docs/performance-budget.md",
        "docs/stories.md",
        "docs/code-architecture.md",
        "docs/validation.md",
    ],
    "implementation": [
        "docs/hard-gates.md",
        "docs/workflows/implementation.md",
        "docs/code-architecture.md",
        "docs/stories.md",
        "docs/validation.md",
        "docs/traceability-matrix.md",
        "docs/qa-test-cases.md",
    ],
    "ui-feature": [
        "DESIGN.md",
        "docs/component-contract.md",
        "docs/browser-testing.md",
        "docs/visual-qa.md",
        "docs/design-system.md",
        "docs/testing-strategy.md",
        "docs/design-assets.md",
        "docs/accessibility.md",
        "docs/performance-budget.md",
        "docs/qa-test-cases.md",
    ],
    "api-data": [
        "docs/api-contract.md",
        "docs/data-model.md",
        "docs/data-management.md",
        "docs/system-design.md",
        "docs/validation.md",
    ],
    "ai-tooling": [
        "docs/agent-security.md",
        "docs/tool-permissions.md",
        "docs/tool-permissions.json",
        "docs/testing-strategy.md",
        "docs/observability.md",
        "docs/secure-sdlc.md",
    ],
    "security": [
        "docs/security.md",
        "docs/agent-security.md",
        "docs/secure-sdlc.md",
        "docs/security-testing.md",
        "docs/tool-permissions.md",
        "docs/threat-model.md",
        "docs/security-asvs-map.md",
        "docs/privacy.md",
    ],
    "production-release": [
        "docs/production-readiness.md",
        "docs/release-risk-classification.md",
        "docs/release.md",
        "docs/release-strategy.md",
        "docs/observability.md",
        "docs/evidence-ledger.md",
        "docs/project-validation.md",
        "docs/signoff-ledger.md",
        "docs/traceability-matrix.md",
        "docs/accessibility.md",
        "docs/performance-budget.md",
        "docs/license-compliance.md",
        "docs/privacy.md",
        ".agent-harness/workflows/production-release-readiness.md",
        ".agent-harness/checklists/release-readiness.md",
    ],
    "quality-system": [
        "docs/roles-and-raci.md",
        "docs/signoff-ledger.md",
        "docs/traceability-matrix.md",
        "docs/qa-test-cases.md",
        "docs/design-assets.md",
        "design-assets/manifest.json",
        "docs/accessibility.md",
        "docs/performance-budget.md",
        "docs/license-compliance.md",
        "docs/privacy.md",
        "docs/security-asvs-map.md",
        "docs/playtest-protocol.md",
        "docs/evidence-ledger.md",
    ],
    "local-continuation": [
        "HARNESS.md",
        ".agent/project-state.md",
        ".hermes/project-state.md",
        "docs/stories.md",
        "docs/validation.md",
        "docs/evidence-ledger.md",
        "docs/risk-register.md",
        "docs/validation-reports/",
        ".agent-harness/workflows/local-continuation.md",
    ],
    "playbook-maintenance": [
        "HARNESS.md",
        "MANIFEST.md",
        "harness.config.json",
        ".agent-harness/scripts/validate_harness.py",
        "docs/playbook-governance.md",
        "docs/project-validation.md",
    ],
}


def find_matrix() -> Path:
    for candidate in MATRIX_CANDIDATES:
        if candidate.exists():
            return candidate
    checked = "\n".join(f"- {p}" for p in MATRIX_CANDIDATES)
    raise SystemExit(f"mode requirements matrix not found. Checked:\n{checked}")


def rel_to_root(path: Path) -> str:
    try:
        return path.relative_to(HARNESS_ROOT).as_posix()
    except ValueError:
        return path.as_posix()


def resolve_path(rel: str) -> Path | None:
    rel_path = Path(rel)
    candidates = [HARNESS_ROOT / rel_path, HARNESS_ROOT / "project-playbook" / rel_path]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def ordered_unique(items: Iterable[str]) -> list[str]:
    seen = set()
    out = []
    for item in items:
        if item and item not in seen:
            seen.add(item)
            out.append(item)
    return out


def expand_mode_requirements(matrix: dict, mode: str) -> list[str]:
    order = matrix.get("modeOrder") or ["learning", "mvp", "real-project", "production"]
    if mode not in order:
        raise SystemExit(f"unknown mode: {mode}. expected one of: {', '.join(order)}")
    required = []
    for m in order[: order.index(mode) + 1]:
        required.extend(matrix.get("modes", {}).get(m, {}).get("requires", []))
    return required


def project_type_requirements(matrix: dict, project_type: str) -> list[str]:
    required = []
    for raw in project_type.split(','):
        t = raw.strip()
        if not t or t == "none":
            continue
        cfg = matrix.get("projectTypes", {}).get(t)
        if cfg is None:
            expected = ["none"] + sorted(matrix.get("projectTypes", {}).keys())
            raise SystemExit(f"unknown project type: {t}. expected one of: {', '.join(expected)} or comma-separated combinations")
        required.extend(cfg.get("requires", []))
    return required


def validation_commands(mode: str, runtime: str, project_type: str) -> list[str]:
    base = f"node scripts/validate-project.mjs --mode {mode} --runtime {runtime} --project-type {project_type}"
    if mode == "production":
        return [base, base + " --summary"]
    return [base]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mode", default="mvp", choices=["learning", "mvp", "real-project", "production"])
    parser.add_argument("--runtime", default="generic", choices=["generic", "claude", "hermes"])
    parser.add_argument("--project-type", default="none", help="none, ui, api, backend, cli, mixed, or comma-separated combinations such as ui,backend")
    parser.add_argument("--task", default="implementation", choices=sorted(TASK_CONTEXT.keys()))
    parser.add_argument("--format", default="markdown", choices=["markdown", "json"])
    args = parser.parse_args()

    matrix_path = find_matrix()
    matrix = json.loads(matrix_path.read_text(encoding="utf-8"))
    runtime_cfg = matrix.get("runtimeAdapters", {}).get(args.runtime)
    if runtime_cfg is None:
        raise SystemExit(f"unknown runtime: {args.runtime}")

    files = ordered_unique(
        ["HARNESS.md", runtime_cfg.get("entrypoint")]
        + runtime_cfg.get("requires", [])
        + expand_mode_requirements(matrix, args.mode)
        + project_type_requirements(matrix, args.project_type)
        + TASK_CONTEXT[args.task]
    )

    resolved_files = []
    missing = []
    for logical_path in files:
        actual = resolve_path(logical_path)
        if actual is None:
            missing.append(logical_path)
            resolved_files.append({"path": logical_path, "actual_path": None, "exists": False})
        else:
            resolved_files.append({"path": logical_path, "actual_path": rel_to_root(actual), "exists": True})

    layout = "package" if "project-playbook" in matrix_path.parts else "installed"
    payload = {
        "mode": args.mode,
        "runtime": args.runtime,
        "project_type": args.project_type,
        "task": args.task,
        "layout": layout,
        "matrix": rel_to_root(matrix_path),
        "files": files,
        "resolved_files": resolved_files,
        "missing_files": missing,
        "validation_commands": validation_commands(args.mode, args.runtime, args.project_type),
    }

    if args.format == "json":
        print(json.dumps(payload, indent=2))
        return

    print(f"# Context selection: {args.task}")
    print()
    print(f"- mode: `{args.mode}`")
    print(f"- runtime: `{args.runtime}`")
    print(f"- project type: `{args.project_type}`")
    print(f"- layout: `{payload['layout']}`")
    print(f"- matrix: `{payload['matrix']}`")
    print()
    print("## Files to read")
    for item in resolved_files:
        suffix = " (missing)" if not item["exists"] else ""
        actual = item["actual_path"]
        if actual and actual != item["path"]:
            print(f"- `{item['path']}` -> `{actual}`{suffix}")
        else:
            print(f"- `{item['path']}`{suffix}")
    print()
    print("## Suggested validation commands")
    for cmd in payload["validation_commands"]:
        print(f"- `{cmd}`")


if __name__ == "__main__":
    main()
