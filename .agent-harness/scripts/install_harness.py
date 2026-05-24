#!/usr/bin/env python3
"""Install a scoped Agent Engineering Harness into a project repo.

The installer is non-destructive by default and selects only the harness and
project-playbook files required for the chosen mode, runtime, project type, and
phase. Existing files are skipped unless --force is used.
"""
from __future__ import annotations

import argparse
import json
import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

SKIP_DIRS = {".git", "node_modules", "dist", "build", ".next", ".cache", "__pycache__"}
SKIP_SUFFIXES = {".pyc", ".pyo"}
MODES = ["learning", "mvp", "real-project", "production"]
RUNTIMES = ["generic", "claude", "hermes"]
PHASES = ["bootstrap", "guided-build", "implementation", "validation", "game-adoption", "release"]
INSTALL_STRATEGY = "selective_harness_non_destructive"

ALWAYS_HARNESS_FILES = [
    "HARNESS.md",
    "harness.config.json",
    ".agent-harness/scripts/install_harness.py",
    ".agent-harness/scripts/bootstrap_playbook.py",
    ".agent-harness/scripts/select_context.py",
    ".agent-harness/scripts/validate_harness.py",
    ".agent-harness/workflows/route-selection.md",
    ".agent-harness/workflows/local-continuation.md",
    ".agent-harness/policies/hard-gates.md",
    ".agent-harness/policies/environment-scope.md",
    ".agent-harness/policies/tool-permissions-summary.md",
    ".agent-harness/prompts/local-continuation.md",
    ".agent-harness/checklists/install-checklist.md",
    ".agent-harness/checklists/handoff.md",
    ".agent-harness/checklists/browser-evidence.md",
    ".agent-harness/checklists/browser-interaction-qa.md",
    ".agent-harness/checklists/composition-qa.md",
    ".agent-harness/checklists/product-quality-system.md",
    ".agent-harness/checklists/plan-quality.md",
    ".agent-harness/templates/output-templates.md",
    ".agent-harness/references/playbook-index.md",
    ".agent-harness/references/workflow-cheatsheet.md",
]

PHASE_HARNESS_FILES = {
    "bootstrap": [],
    "guided-build": [
        ".agent-harness/prompts/new-project.md",
    ],
    "implementation": [
        ".agent-harness/workflows/implementation.md",
        ".agent-harness/prompts/implement-story.md",
    ],
    "validation": [
        ".agent-harness/prompts/sandbox-final-report.md",
    ],
    "game-adoption": [
        ".agent-harness/workflows/game-sandbox-to-local.md",
        ".agent-harness/prompts/game-project.md",
        ".agent-harness/checklists/game-playability.md",
        ".agent-harness/checklists/game-player-facing-readiness.md",
        ".agent-harness/checklists/3d-web-game-readiness.md",
    ],
    "release": [
        ".agent-harness/workflows/production-release-readiness.md",
        ".agent-harness/prompts/production-readiness.md",
        ".agent-harness/prompts/sandbox-final-report.md",
        ".agent-harness/checklists/release-readiness.md",
    ],
}

ALWAYS_PROJECT_FILES = [
    "docs/mode-requirements.json",
    "docs/context-read-matrix.md",
    "docs/project-validation.md",
    "docs/validation.md",
    "docs/hard-gates.md",
    "docs/browser-interaction-qa.md",
    "docs/composition-qa.md",
    "docs/product-quality-system.md",
    "docs/role-gate-quality-map.md",
    "docs/role-thinking-protocols.md",
    "docs/plan-quality.md",
    "docs/agent-adapter-contract.md",
    "docs/status-vocabulary.md",
    "scripts/validate-project.mjs",
    "scripts/validate-game-workflow.mjs",
    "scripts/validate-all.mjs",
    "scripts/validate-playbook.mjs",
    "scripts/validate-doc-drift.mjs",
    "scripts/validate-example.mjs",
    "scripts/validate-regression-fixtures.mjs",
    "scripts/validate-ui-readability.mjs",
    "scripts/validate-composition-qa.mjs",
    "scripts/validate-product-quality-system.mjs",
    "scripts/validate-design-assets.mjs",
    "scripts/validate-traceability.mjs",
    "scripts/validate-accessibility-report.mjs",
    "scripts/validate-performance-budget.mjs",
    "scripts/validate-cross-references.mjs",
    "scripts/browser-evidence.mjs",
    "scripts/init-project.mjs",
    "scripts/lib/production-readiness-semantics.mjs",
    "package.json",
]

PHASE_PROJECT_FILES = {
    "bootstrap": [
        "docs/definition-of-done.md",
        "docs/roles-and-raci.md",
        "docs/signoff-ledger.md",
    ],
    "guided-build": [
        "docs/project-brief.md",
        "docs/requirements.md",
        "docs/product.md",
        "docs/stories.md",
        "docs/architecture.md",
        "docs/guided-build-workflow.md",
        "docs/roles-and-raci.md",
        "docs/signoff-ledger.md",
        "docs/traceability-matrix.md",
    ],
    "implementation": [
        "docs/workflows/implementation.md",
        "docs/code-architecture.md",
        "docs/code-review.md",
        "docs/dependency-policy.md",
        "docs/testing-strategy.md",
        "docs/test-matrix.md",
        "docs/qa-test-cases.md",
        "docs/traceability-matrix.md",
        "docs/accessibility.md",
        "docs/performance-budget.md",
        "docs/decisions/README.md",
        "docs/decisions/0001-template.md",
        "templates/decision-record.md",
        "templates/project-state.md",
    ],
    "validation": [
        "docs/testing-strategy.md",
        "docs/test-matrix.md",
        "docs/validation-reports/README.md",
        "docs/validation-reports/template.md",
        "docs/validation-reports/browser-evidence-template.md",
        "templates/validation-report.md",
        "docs/qa-test-cases.md",
        "docs/accessibility.md",
        "docs/performance-budget.md",
        "scripts/validate-ui-readability.mjs",
        "scripts/validate-composition-qa.mjs",
        "scripts/validate-product-quality-system.mjs",
        "scripts/validate-design-assets.mjs",
        "scripts/validate-traceability.mjs",
        "scripts/validate-accessibility-report.mjs",
        "scripts/validate-performance-budget.mjs",
        "scripts/validate-cross-references.mjs",
    ],
    "game-adoption": [
        "docs/game-project-adoption.md",
        "docs/adoption-existing-project.md",
        "docs/project-brief.md",
        "docs/requirements.md",
        "docs/product.md",
        "docs/stories.md",
        "docs/code-architecture.md",
        "docs/risk-register.md",
        "docs/definition-of-done.md",
        "docs/evidence-ledger.md",
        "docs/browser-testing.md",
        "docs/visual-qa.md",
        "docs/composition-qa.md",
    "docs/product-quality-system.md",
    "docs/role-gate-quality-map.md",
    "docs/role-thinking-protocols.md",
    "docs/plan-quality.md",
        "docs/test-matrix.md",
        "DESIGN.md",
        "docs/design-brief.md",
        "docs/design-system.md",
        "docs/design-critique.md",
        "docs/design-assets.md",
        "design-assets/",
        "docs/playtest-protocol.md",
        "docs/license-compliance.md",
        "docs/component-contract.md",
    ],
    "release": [
        "docs/production-readiness.md",
        "docs/release.md",
        "docs/release-strategy.md",
        "docs/release-risk-classification.md",
        "docs/observability.md",
        "docs/evidence-ledger.md",
        "docs/incidents.md",
        "docs/risk-register.md",
        "docs/environments.md",
        "docs/ci-cd.md",
        "docs/security.md",
        "docs/secure-sdlc.md",
        "docs/security-testing.md",
        "docs/threat-model.md",
        "docs/vulnerability-response.md",
        "docs/security-exceptions.md",
        "docs/supply-chain-security.md",
        "docs/standards-map.md",
        "docs/engineering-metrics.md",
        "docs/data-management.md",
        "docs/runbooks/README.md",
        "docs/runbooks/template.md",
        "docs/runbooks/database-migration.md",
        "docs/release-decision.md",
        "docs/signoff-ledger.md",
        "docs/roles-and-raci.md",
        "docs/traceability-matrix.md",
        "docs/accessibility.md",
        "docs/performance-budget.md",
        "docs/license-compliance.md",
        "docs/privacy.md",
        "docs/security-asvs-map.md",
        "docs/qa-test-cases.md",
        "docs/playtest-protocol.md",
    ],
}

@dataclass(frozen=True)
class InstallItem:
    src: Path
    target_rel: Path
    source_rel: Path


def iter_files(root: Path) -> Iterable[Path]:
    for path in root.rglob("*"):
        rel = path.relative_to(root)
        if any(part in SKIP_DIRS for part in rel.parts):
            continue
        if path.suffix in SKIP_SUFFIXES:
            continue
        if path.is_file():
            yield path


def same_bytes(left: Path, right: Path) -> bool:
    return left.read_bytes() == right.read_bytes()


def normalize_installed_permissions(path: Path) -> None:
    if path.suffix in {".py", ".mjs"}:
        path.chmod(0o755)
    else:
        path.chmod(0o644)


def ordered_unique(values: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        if not value:
            continue
        normalized = str(value).replace("\\", "/").strip("/")
        if normalized and normalized not in seen:
            seen.add(normalized)
            result.append(normalized)
    return result


def parse_project_types(value: str) -> list[str]:
    types = [part.strip() for part in value.split(",") if part.strip()]
    return types or ["none"]


def load_matrix(project_playbook: Path) -> dict:
    matrix_path = project_playbook / "docs" / "mode-requirements.json"
    if not matrix_path.exists():
        raise SystemExit(f"Missing mode requirements matrix: {matrix_path}")
    return json.loads(matrix_path.read_text(encoding="utf-8"))


def get_mode_order(matrix: dict) -> list[str]:
    order = matrix.get("modeOrder") or []
    modes = set((matrix.get("modes") or {}).keys())
    if not order or set(order) != modes:
        raise SystemExit("docs/mode-requirements.json must define complete explicit modeOrder")
    return order


def collect_mode_items(matrix: dict, mode: str, key: str) -> list[str]:
    order = get_mode_order(matrix)
    if mode not in order:
        raise SystemExit(f"unknown mode: {mode}")
    index = order.index(mode)
    return ordered_unique(item for m in order[: index + 1] for item in (matrix.get("modes", {}).get(m, {}).get(key, []) or []))


def expand_project_paths(project_playbook: Path, logical_paths: Iterable[str]) -> list[InstallItem]:
    items: list[InstallItem] = []
    for logical in ordered_unique(logical_paths):
        src = project_playbook / logical
        if logical.endswith("/") or src.is_dir():
            if not src.exists():
                raise SystemExit(f"Required source directory is missing: project-playbook/{logical}")
            for file_path in iter_files(src):
                rel = file_path.relative_to(project_playbook)
                items.append(InstallItem(file_path, rel, Path("project-playbook") / rel))
        else:
            if not src.exists():
                raise SystemExit(f"Required source file is missing: project-playbook/{logical}")
            rel = Path(logical)
            items.append(InstallItem(src, rel, Path("project-playbook") / rel))
    return items


def build_project_logical_paths(matrix: dict, *, mode: str, runtime: str, project_types: list[str], phase: str) -> list[str]:
    runtime_cfg = matrix.get("runtimeAdapters", {}).get(runtime)
    if runtime_cfg is None:
        raise SystemExit(f"unknown runtime: {runtime}")
    logical: list[str] = []
    logical.extend(ALWAYS_PROJECT_FILES)
    logical.append(runtime_cfg.get("entrypoint"))
    logical.extend(runtime_cfg.get("requires", []) or [])
    logical.extend(collect_mode_items(matrix, mode, "requires"))
    for project_type in project_types:
        cfg = matrix.get("projectTypes", {}).get(project_type)
        if cfg is None:
            expected = ", ".join(sorted(matrix.get("projectTypes", {}).keys()))
            raise SystemExit(f"unknown project type: {project_type}. expected one of: {expected}")
        logical.extend(cfg.get("requires", []) or [])
    logical.extend(PHASE_PROJECT_FILES.get(phase, []))
    return ordered_unique(logical)


def build_install_items(harness_root: Path, *, mode: str, runtime: str, project_types: list[str], phase: str) -> list[InstallItem]:
    project_playbook = harness_root / "project-playbook"
    if not project_playbook.exists():
        raise SystemExit(f"Missing project-playbook at {project_playbook}")

    matrix = load_matrix(project_playbook)
    items: list[InstallItem] = []
    harness_files = ordered_unique(ALWAYS_HARNESS_FILES + PHASE_HARNESS_FILES.get(phase, []))
    for rel_name in harness_files:
        src = harness_root / rel_name
        if not src.exists():
            raise SystemExit(f"Required harness source file is missing: {rel_name}")
        items.append(InstallItem(src, Path(rel_name), Path(rel_name)))

    project_logical = build_project_logical_paths(
        matrix,
        mode=mode,
        runtime=runtime,
        project_types=project_types,
        phase=phase,
    )
    items.extend(expand_project_paths(project_playbook, project_logical))
    return items


def dedupe_install_items(items: list[InstallItem]) -> tuple[list[InstallItem], list[str]]:
    selected: dict[str, InstallItem] = {}
    ordered: list[InstallItem] = []
    ignored: list[str] = []
    conflicts: list[str] = []

    for item in items:
        key = item.target_rel.as_posix()
        previous = selected.get(key)
        if previous is None:
            selected[key] = item
            ordered.append(item)
            continue
        if same_bytes(previous.src, item.src):
            ignored.append(f"{item.source_rel.as_posix()} -> {key} duplicates {previous.source_rel.as_posix()}")
            continue
        conflicts.append(
            f"install target conflict for {key}: {previous.source_rel.as_posix()} differs from {item.source_rel.as_posix()}"
        )

    if conflicts:
        raise SystemExit("\n".join(conflicts))
    return ordered, ignored


def write_installed_config(source_config: Path, target_config: Path, *, mode: str, runtime: str, project_type: str, phase: str) -> None:
    payload = json.loads(source_config.read_text(encoding="utf-8"))
    payload["install_strategy"] = INSTALL_STRATEGY
    payload["install_note"] = (
        "Installer copies only the harness core plus project-playbook files selected by "
        "mode, runtime, project-type, and phase. Existing files are skipped unless --force is used."
    )
    payload["selected_mode"] = mode
    payload["selected_runtime"] = runtime
    payload["selected_project_type"] = project_type
    payload["selected_phase"] = phase
    target_config.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    normalize_installed_permissions(target_config)


def apply_plan(
    items: list[InstallItem],
    harness_root: Path,
    target: Path,
    *,
    dry_run: bool,
    force: bool,
    mode: str,
    runtime: str,
    project_type: str,
    phase: str,
) -> tuple[list[str], list[str]]:
    copied: list[str] = []
    skipped: list[str] = []
    for item in items:
        target_path = target / item.target_rel
        rel = item.target_rel.as_posix()
        if target_path.exists() and not force:
            skipped.append(rel)
            continue
        copied.append(rel)
        if dry_run:
            continue
        target_path.parent.mkdir(parents=True, exist_ok=True)
        if rel == "harness.config.json":
            write_installed_config(harness_root / "harness.config.json", target_path, mode=mode, runtime=runtime, project_type=project_type, phase=phase)
        else:
            shutil.copy2(item.src, target_path)
            normalize_installed_permissions(target_path)
    return copied, skipped


def main() -> int:
    parser = argparse.ArgumentParser(description="Install Agent Engineering Harness into a project repo")
    parser.add_argument("--target", required=True, help="Target project directory")
    parser.add_argument("--mode", default="mvp", choices=MODES, help="Project mode")
    parser.add_argument("--runtime", default="generic", choices=RUNTIMES, help="Primary runtime")
    parser.add_argument("--project-type", default="none", help="none, ui, api, backend, cli, mixed, or comma-separated combinations such as ui,backend")
    parser.add_argument("--phase", default="bootstrap", choices=PHASES, help="Current project phase")
    parser.add_argument("--dry-run", action="store_true", help="Preview files without copying")
    parser.add_argument("--merge", action="store_true", help="Perform the copy")
    parser.add_argument("--force", action="store_true", help="Overwrite existing files")
    args = parser.parse_args()

    if not args.dry_run and not args.merge:
        parser.error("Use --dry-run first, then --merge when ready")

    harness_root = Path(__file__).resolve().parents[2]
    target = Path(args.target).resolve()
    project_types = parse_project_types(args.project_type)

    items, duplicate_destinations_ignored = dedupe_install_items(build_install_items(
        harness_root,
        mode=args.mode,
        runtime=args.runtime,
        project_types=project_types,
        phase=args.phase,
    ))

    if not args.dry_run:
        target.mkdir(parents=True, exist_ok=True)

    copied, skipped = apply_plan(
        items,
        harness_root,
        target,
        dry_run=args.dry_run,
        force=args.force,
        mode=args.mode,
        runtime=args.runtime,
        project_type=",".join(project_types),
        phase=args.phase,
    )

    action = "dry-run" if args.dry_run else "merge"
    print(f"Agent Engineering Harness install {action}")
    print(f"target: {target}")
    print(f"mode: {args.mode}")
    print(f"runtime: {args.runtime}")
    print(f"project_type: {','.join(project_types)}")
    print(f"phase: {args.phase}")
    print(f"install_strategy: {INSTALL_STRATEGY}")
    print(f"files_selected: {len(items)}")
    print(f"files_to_copy: {len(copied)}")
    print(f"files_skipped_existing: {len(skipped)}")
    print(f"duplicate_destinations_ignored: {len(duplicate_destinations_ignored)}")

    if duplicate_destinations_ignored:
        print("\nDuplicate destinations ignored because source files are byte-identical:")
        for item in duplicate_destinations_ignored[:200]:
            print(f"  {item}")
        if len(duplicate_destinations_ignored) > 200:
            print(f"  ... {len(duplicate_destinations_ignored) - 200} more")
    if copied:
        print("\nFiles to copy:" if args.dry_run else "\nFiles copied:")
        for item in copied[:250]:
            print(f"  {item}")
        if len(copied) > 250:
            print(f"  ... {len(copied) - 250} more")
    if skipped:
        print("\nSkipped existing files:")
        for item in skipped[:250]:
            print(f"  {item}")
        if len(skipped) > 250:
            print(f"  ... {len(skipped) - 250} more")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
