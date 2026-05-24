#!/usr/bin/env python3
"""Validate an Agent Engineering Harness package or installed repo.

This validator intentionally checks more than file presence. It catches common drift
introduced when exporting from a ChatGPT Skill layout into a repo-local harness:
wrong path roots, runtime entrypoints that do not read HARNESS.md, stale exported-layout
references, helper scripts that no longer run, release-gate drift, installer destination
conflicts, version drift, and validators that accidentally pass on template text instead
of concrete evidence.
"""
from __future__ import annotations

import argparse
import json
import importlib.util
import os
import re
import subprocess
import shutil
import sys
import tempfile
from pathlib import Path
from urllib.parse import unquote, urlparse

PACKAGE_REQUIRED = [
    "HARNESS.md",
    "AGENTS.md",
    "CLAUDE.md",
    "harness.config.json",
    ".agent-harness/workflows/route-selection.md",
    ".agent-harness/workflows/local-continuation.md",
    ".agent-harness/workflows/game-sandbox-to-local.md",
    ".agent-harness/workflows/production-release-readiness.md",
    ".agent-harness/policies/hard-gates.md",
    ".agent-harness/policies/environment-scope.md",
    ".agent-harness/prompts/local-continuation.md",
    ".agent-harness/checklists/handoff.md",
    ".agent-harness/checklists/game-player-facing-readiness.md",
    ".agent-harness/checklists/browser-evidence.md",
    ".agent-harness/checklists/product-quality-system.md",
    ".agent-harness/checklists/plan-quality.md",
    ".agent-harness/scripts/install_harness.py",
    ".agent-harness/scripts/select_context.py",
    ".agent-harness/scripts/bootstrap_playbook.py",
]

PROJECT_REQUIRED = [
    "project-playbook/AGENTS.md",
    "project-playbook/CLAUDE.md",
    "project-playbook/.hermes/context.md",
    "project-playbook/package.json",
    "project-playbook/docs/game-project-adoption.md",
    "project-playbook/docs/browser-testing.md",
    "project-playbook/docs/product-quality-system.md",
    "project-playbook/docs/role-gate-quality-map.md",
    "project-playbook/docs/role-thinking-protocols.md",
    "project-playbook/docs/plan-quality.md",
    "project-playbook/docs/production-readiness.md",
    "project-playbook/docs/evidence-ledger.md",
    "project-playbook/docs/status-vocabulary.md",
    "project-playbook/scripts/validate-project.mjs",
    "project-playbook/scripts/validate-game-workflow.mjs",
    "project-playbook/scripts/browser-evidence.mjs",
    "project-playbook/playwright.config.mjs",
]

INSTALLED_BASE_REQUIRED = [
    "HARNESS.md",
    "harness.config.json",
    ".agent-harness/workflows/route-selection.md",
    ".agent-harness/scripts/install_harness.py",
    ".agent-harness/scripts/bootstrap_playbook.py",
    ".agent-harness/scripts/select_context.py",
    ".agent-harness/scripts/validate_harness.py",
    "docs/mode-requirements.json",
    "docs/context-read-matrix.md",
    "docs/project-validation.md",
    "docs/validation.md",
    "docs/hard-gates.md",
    "docs/product-quality-system.md",
    "docs/role-gate-quality-map.md",
    "docs/role-thinking-protocols.md",
    "docs/plan-quality.md",
    "docs/status-vocabulary.md",
    "scripts/validate-project.mjs",
    "scripts/lib/production-readiness-semantics.mjs",
    "scripts/browser-evidence.mjs",
    "scripts/validate-composition-qa.mjs",
    "scripts/validate-product-quality-system.mjs",
]

INSTALL_STRATEGY = "selective_harness_non_destructive"

STALE_PATTERNS = [
    "references/" + "source-" + "playbook",
    "source-" + "playbook/",
    "assets/" + "project-starter",
    "/home/oai/" + "skills/ai-agent-project-playbook",
]


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def rel(root: Path, path: Path) -> str:
    try:
        return str(path.relative_to(root))
    except ValueError:
        return str(path)


def run(cmd: list[str], cwd: Path, timeout: int = 30) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=cwd, text=True, capture_output=True, timeout=timeout)


def parse_colon_summary(stdout: str) -> dict[str, str]:
    summary: dict[str, str] = {}
    for line in stdout.splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if key:
            summary[key] = value
    return summary


def int_summary(summary: dict[str, str], key: str) -> int | None:
    value = summary.get(key)
    if value is None:
        return None
    try:
        return int(value)
    except ValueError:
        return None


def markdown_fence_errors(root: Path) -> list[str]:
    errors: list[str] = []
    for path in root.rglob("*.md"):
        if any(part in {"node_modules", ".git"} for part in path.parts):
            continue
        text = read(path)
        if text.count("```") % 2 != 0:
            errors.append(f"unbalanced markdown fence: {rel(root, path)}")
    return errors


def stale_reference_errors(root: Path) -> list[str]:
    errors: list[str] = []
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if any(part in {"node_modules", ".git", "dist", "build"} for part in path.parts):
            continue
        if path.name == "validate_harness.py":
            continue
        if path.suffix not in {".md", ".py", ".json", ".mjs", ".txt", ""}:
            continue
        text = read(path)
        for pattern in STALE_PATTERNS:
            if pattern in text:
                errors.append(f"stale Skill/source-layout reference `{pattern}` in {rel(root, path)}")
    return errors


def heading_errors(root: Path) -> list[str]:
    errors: list[str] = []
    for path in root.rglob("*.md"):
        if any(part in {"node_modules", ".git"} for part in path.parts):
            continue
        seen = set()
        for line in read(path).splitlines():
            if line.startswith("## ") and line[3:5].replace(".", "").isdigit():
                key = line.strip()
                if key in seen:
                    errors.append(f"duplicate markdown heading `{key}` in {rel(root, path)}")
                seen.add(key)
    return errors


SKIP_SCAN_DIRS = {".git", "node_modules", "dist", "build", ".next", ".cache", "__pycache__"}
TEXT_SUFFIXES = {".md", ".py", ".json", ".mjs", ".txt", ""}
ROOT_PATH_NAMES = {
    "AGENTS.md",
    "CLAUDE.md",
    "DESIGN.md",
    "HARNESS.md",
    "MANIFEST.md",
    "QUICKSTART.md",
    "README.md",
    "START-HERE.md",
    "VALIDATION-REPORT.md",
    "harness.config.json",
    "package.json",
}
GENERATED_OR_EXAMPLE_PREFIXES = (
    "artifacts/",
    "coverage/",
    "dist/",
    "build/",
    "node_modules/",
    "reports/",
    "test-results/",
    "playwright-report/",
    ".git/",
    ".github/",
    ".next/",
    "src/",
    "app/",
    "pages/",
    "components/",
    "features/",
    "tests/",
    "e2e/",
    "api/",
    "public/",
    "uploads/",
    "tmp/",
    "temp/",
    "logs/",
    "hooks/",
    "services/",
    "schemas/",
    "lib/",
)


def should_skip_path(path: Path) -> bool:
    return any(part in SKIP_SCAN_DIRS for part in path.parts)


def strip_fenced_blocks(text: str) -> str:
    # Inline references outside code fences are documentation claims; examples inside
    # fences are commands/templates and are checked by the command-specific validators.
    return re.sub(r"```.*?```", "", text, flags=re.DOTALL)


def markdown_slug(heading: str) -> str:
    slug = heading.strip().lower()
    slug = re.sub(r"<[^>]+>", "", slug)
    slug = re.sub(r"[`*_~]", "", slug)
    slug = re.sub(r"[^a-z0-9\s\-]", "", slug)
    slug = re.sub(r"\s+", "-", slug.strip())
    slug = re.sub(r"-+", "-", slug)
    return slug


def markdown_anchors(text: str) -> set[str]:
    anchors: set[str] = set()
    seen: dict[str, int] = {}
    for line in text.splitlines():
        match = re.match(r"^(#{1,6})\s+(.+?)\s*#*\s*$", line)
        if not match:
            continue
        base = markdown_slug(match.group(2))
        if not base:
            continue
        count = seen.get(base, 0)
        seen[base] = count + 1
        anchors.add(base if count == 0 else f"{base}-{count}")
    return anchors


def resolve_doc_reference(root: Path, source: Path, ref_path: str, package_mode: bool) -> Path:
    clean = unquote(ref_path).strip()
    if clean.startswith("/"):
        return root / clean.lstrip("/")
    if clean.startswith("./") or clean.startswith("../"):
        return (source.parent / clean).resolve()
    # Backticked docs usually describe installed-project paths. In package mode,
    # installed-project files live under project-playbook/ while harness files live at root.
    candidates = reference_candidates(root, source, clean, package_mode)
    return candidates[0]


def reference_candidates(root: Path, source: Path, candidate: str, package_mode: bool) -> list[Path]:
    clean = candidate.strip().rstrip(".,;:)")
    paths: list[Path] = []
    if clean.startswith("/"):
        paths.append(root / clean.lstrip("/"))
    else:
        paths.append((source.parent / clean).resolve())
        paths.append(root / clean)
        if package_mode:
            paths.append(root / "project-playbook" / clean)
            if clean.startswith("project-playbook/"):
                paths.append(root / clean)
    # Preserve order while deduping.
    unique: list[Path] = []
    seen: set[Path] = set()
    for path in paths:
        resolved = path.resolve()
        if resolved not in seen:
            seen.add(resolved)
            unique.append(resolved)
    return unique


def looks_like_file_path(candidate: str) -> bool:
    value = candidate.strip().rstrip(".,;:)")
    if not value or value.startswith(("http://", "https://", "mailto:")):
        return False
    if any(token in value for token in ["<", ">", "|", "*", "{", "}", "$", "&&", "||"]):
        return False
    if " " in value or "\t" in value or "\n" in value:
        return False
    if value.startswith("--") or value.startswith("npm:"):
        return False
    if value.startswith("/") and "." not in Path(value).name:
        return False
    normalized = value.lstrip("./")
    if value in {"SKILL.md", "agents/openai.yaml", ".env", ".env.local", ".gitignore", ".git"}:
        return False
    if normalized.startswith(GENERATED_OR_EXAMPLE_PREFIXES) or value.startswith(GENERATED_OR_EXAMPLE_PREFIXES):
        return False
    if value in ROOT_PATH_NAMES:
        return True
    if value.startswith((".", "/")):
        return True
    if "/" in value:
        first = value.split("/", 1)[0]
        return first in {"docs", "project-playbook", ".agent-harness", ".agent", ".hermes", ".claude", "scripts", "templates"}
    return False


def markdown_link_errors(root: Path, package_mode: bool) -> list[str]:
    errors: list[str] = []
    for source in root.rglob("*.md"):
        if should_skip_path(source):
            continue
        text = read(source)
        for match in re.finditer(r"(?<!!)\[[^\]]+\]\(([^)]+)\)", text):
            raw_target = match.group(1).strip()
            if not raw_target:
                continue
            target = raw_target.strip("<>")
            # Drop optional Markdown link title: [x](file.md "title").
            if " " in target and not target.startswith("#"):
                target = target.split()[0]
            parsed = urlparse(target)
            if parsed.scheme or target.startswith("mailto:"):
                continue
            path_part, _, anchor = target.partition("#")
            if not path_part:
                target_file = source
            else:
                target_file = resolve_doc_reference(root, source, path_part, package_mode)
            if path_part and not target_file.exists():
                errors.append(f"broken markdown link `{raw_target}` in {rel(root, source)}")
                continue
            if anchor and target_file.suffix.lower() == ".md":
                anchors = markdown_anchors(read(target_file))
                if unquote(anchor).lower() not in anchors:
                    errors.append(f"broken markdown anchor `{raw_target}` in {rel(root, source)}")
    return errors


def backticked_path_errors(root: Path, package_mode: bool) -> list[str]:
    errors: list[str] = []
    for source in root.rglob("*.md"):
        if should_skip_path(source):
            continue
        text = strip_fenced_blocks(read(source))
        for match in re.finditer(r"(?<!`)`([^`\n]+)`(?!`)", text):
            candidate = match.group(1).strip()
            if not looks_like_file_path(candidate):
                continue
            paths = reference_candidates(root, source, candidate, package_mode)
            if not any(path.exists() for path in paths):
                errors.append(f"broken backticked path `{candidate}` in {rel(root, source)}")
    return errors


def project_manifest_errors(root: Path, package_mode: bool) -> list[str]:
    errors: list[str] = []
    if not package_mode:
        return errors
    manifest_path = root / "project-playbook" / "MANIFEST.json"
    if not manifest_path.exists():
        errors.append("project-playbook/MANIFEST.json missing")
        return errors
    try:
        payload = json.loads(read(manifest_path))
    except json.JSONDecodeError as exc:
        errors.append(f"project-playbook/MANIFEST.json invalid JSON: {exc}")
        return errors
    files = payload.get("files")
    if not isinstance(files, list):
        errors.append("project-playbook/MANIFEST.json files must be a list")
        return errors
    listed = {str(item) for item in files}
    actual = {
        str(path.relative_to(root / "project-playbook"))
        for path in (root / "project-playbook").rglob("*")
        if path.is_file() and not should_skip_path(path)
    }
    missing = sorted(listed - actual)
    unlisted = sorted(actual - listed)
    for item in missing:
        errors.append(f"project-playbook/MANIFEST.json lists missing file `{item}`")
    for item in unlisted:
        errors.append(f"project-playbook/MANIFEST.json missing shipped file `{item}`")
    return errors


def generated_file_errors(root: Path) -> list[str]:
    errors: list[str] = []
    banned_dirs = {".git", "node_modules", "dist", "build", ".next", ".cache", "__pycache__"}
    banned_suffixes = {".pyc", ".pyo"}
    for path in root.rglob("*"):
        rel_parts = set(path.relative_to(root).parts) if path != root else set()
        if rel_parts & banned_dirs:
            errors.append(f"generated/cache path should not be packaged: {rel(root, path)}")
        if path.is_file() and path.suffix in banned_suffixes:
            errors.append(f"generated Python bytecode should not be packaged: {rel(root, path)}")
    return errors


def must_contain(root: Path, file: str, needle: str, errors: list[str], label: str | None = None) -> None:
    path = root / file
    if not path.exists():
        errors.append(f"missing file for content check: {file}")
        return
    if needle not in read(path):
        errors.append(f"{label or file} must contain `{needle}`")


def validate_config(root: Path, errors: list[str]) -> dict:
    path = root / "harness.config.json"
    if not path.exists():
        errors.append("harness.config.json missing")
        return {}
    try:
        cfg = json.loads(read(path))
    except json.JSONDecodeError as exc:
        errors.append(f"invalid harness.config.json: {exc}")
        return {}
    if cfg.get("primary_entrypoint") != "HARNESS.md":
        errors.append("harness.config.json primary_entrypoint must be HARNESS.md")
    project_types = cfg.get("supported_project_types", [])
    if "comma-separated" in project_types:
        errors.append("harness.config.json must not list `comma-separated` as a project type; it is a format")
    for required in ["none", "ui", "api", "backend", "cli", "mixed", "game", "web3d"]:
        if required not in project_types:
            errors.append(f"harness.config.json supported_project_types missing `{required}`")
    if cfg.get("install_strategy") != INSTALL_STRATEGY:
        errors.append(f"harness.config.json install_strategy must be {INSTALL_STRATEGY}")
    return cfg


def validate_versions(root: Path, package_mode: bool, cfg: dict, errors: list[str]) -> None:
    cfg_version = cfg.get("version")
    if not cfg_version:
        errors.append("harness.config.json missing version")
        return
    if package_mode:
        pkg_path = root / "project-playbook" / "package.json"
        if pkg_path.exists():
            try:
                pkg = json.loads(read(pkg_path))
                if pkg.get("version") != cfg_version:
                    errors.append(f"version drift: harness.config.json={cfg_version}, project-playbook/package.json={pkg.get('version')}")
            except json.JSONDecodeError as exc:
                errors.append(f"project-playbook/package.json invalid JSON: {exc}")
        changelog = root / "CHANGELOG.md"
        if changelog.exists() and f"## {cfg_version} " not in read(changelog):
            errors.append(f"CHANGELOG.md missing top-level entry for version {cfg_version}")
        report = root / "VALIDATION-REPORT.md"
        if report.exists() and cfg_version not in read(report).splitlines()[0]:
            errors.append(f"VALIDATION-REPORT.md title does not mention version {cfg_version}")


def validate_package_scripts(root: Path, errors: list[str]) -> None:
    pkg_path = root / "project-playbook" / "package.json"
    if not pkg_path.exists():
        errors.append("project-playbook/package.json missing; npm validation docs will drift")
        return
    try:
        pkg = json.loads(read(pkg_path))
    except json.JSONDecodeError as exc:
        errors.append(f"project-playbook/package.json invalid JSON: {exc}")
        return
    scripts = pkg.get("scripts", {})
    for script in [
        "validate:playbook",
        "validate:all",
        "validate:drift",
        "validate:game-workflow",
        "validate:browser-pack",
        "browser:evidence",
        "test:browser",
        "test:browser:game",
        "validate:regression",
        "validate:composition:qa",
        "validate:examples",
        "validate:examples:allow-unavailable",
        "validate:template:matrix",
        "validate:template:mvp:ui",
        "validate:template:mvp:game",
        "validate:project:mvp:ui",
        "validate:project:mvp:game",
        "validate:project:production",
        "validate:project:production:summary",
        "init:project",
    ]:
        if script not in scripts:
            errors.append(f"project-playbook/package.json missing script `{script}`")


def validate_docs_layout(root: Path, package_mode: bool, errors: list[str]) -> None:
    if not package_mode:
        return
    for file in ["AGENTS.md", "CLAUDE.md", "README.md"]:
        must_contain(root, file, "project-playbook/docs", errors, label=file)
    readme = read(root / "README.md") if (root / "README.md").exists() else ""
    if "selective non-destructive harness install" not in readme:
        errors.append("README.md must describe the selective non-destructive harness install strategy")
    if "reporting/planning labels, not file filters" in readme:
        errors.append("README.md still claims mode/runtime/project-type are not file filters")


def validate_release_gates(root: Path, base: str, errors: list[str]) -> None:
    prod = root / base / "docs" / "production-readiness.md"
    ledger = root / base / "docs" / "evidence-ledger.md"
    if prod.exists():
        text = read(prod)
        for gate in [
            "Real-device/gameplay check completed",
            "Human playtest completed",
            "Public URL smoke verified",
            "Hosting/proxy rate-limit reviewed",
        ]:
            if gate not in text:
                errors.append(f"production-readiness.md missing explicit gate `{gate}`")
    if ledger.exists():
        text = read(ledger)
        for evidence in ["real-device/gameplay check", "human playtest", "public URL smoke", "hosting/proxy rate-limit review"]:
            if evidence not in text:
                errors.append(f"evidence-ledger.md missing evidence type `{evidence}`")


def validate_helper_scripts(root: Path, package_mode: bool, errors: list[str], no_smoke: bool) -> None:
    select_script = root / ".agent-harness" / "scripts" / "select_context.py"
    if select_script.exists():
        if package_mode:
            select_mode = "mvp"
            select_runtime = "generic"
            select_project_type = "game"
            select_task = "game-adoption"
        else:
            cfg_path = root / "harness.config.json"
            try:
                installed_cfg = json.loads(read(cfg_path)) if cfg_path.exists() else {}
            except json.JSONDecodeError:
                installed_cfg = {}
            select_mode = installed_cfg.get("selected_mode") or "mvp"
            select_runtime = installed_cfg.get("selected_runtime") or "generic"
            select_project_type = installed_cfg.get("selected_project_type") or "none"
            phase = installed_cfg.get("selected_phase") or "bootstrap"
            select_task = {
                "bootstrap": "guided-build",
                "guided-build": "guided-build",
                "implementation": "implementation",
                "validation": "implementation",
                "game-adoption": "game-adoption",
                "release": "production-release",
            }.get(phase, "guided-build")
        proc = run([
            sys.executable,
            str(select_script),
            "--mode", select_mode,
            "--runtime", select_runtime,
            "--project-type", select_project_type,
            "--task", select_task,
            "--format", "json",
        ], cwd=root)
        if proc.returncode != 0:
            errors.append(f"select_context.py smoke failed: {proc.stderr.strip() or proc.stdout.strip()}")
        else:
            try:
                payload = json.loads(proc.stdout)
                if payload.get("missing_files"):
                    errors.append(f"select_context.py reports missing files: {payload['missing_files']}")
                resolved = payload.get("resolved_files") or []
                if not resolved:
                    errors.append("select_context.py JSON must include resolved_files")
                for item in resolved:
                    actual = item.get("actual_path")
                    if item.get("exists") and actual and not (root / actual).exists():
                        errors.append(f"select_context.py actual_path does not exist: {actual}")
                if package_mode and not any((item.get("actual_path") or "").startswith("project-playbook/docs/") for item in resolved):
                    errors.append("select_context.py package-mode output must expose project-playbook/docs actual paths")
            except json.JSONDecodeError as exc:
                errors.append(f"select_context.py did not return valid JSON: {exc}")

    if package_mode and not no_smoke:
        installer = root / ".agent-harness" / "scripts" / "install_harness.py"
        boot = root / ".agent-harness" / "scripts" / "bootstrap_playbook.py"
        if installer.exists():
            with tempfile.TemporaryDirectory(prefix="harness-bootstrap-") as td:
                target = Path(td) / "project"
                base_args = [
                    "--target", str(target),
                    "--mode", "mvp",
                    "--runtime", "generic",
                    "--project-type", "game",
                    "--phase", "game-adoption",
                ]
                dry = run([sys.executable, str(installer), *base_args, "--dry-run"], cwd=root)
                if dry.returncode != 0:
                    errors.append(f"install_harness.py game dry-run failed: {dry.stderr.strip() or dry.stdout.strip()}")
                    return
                merge = run([sys.executable, str(installer), *base_args, "--merge"], cwd=root)
                if merge.returncode != 0:
                    errors.append(f"install_harness.py game merge failed: {merge.stderr.strip() or merge.stdout.strip()}")
                    return
                # The compatibility wrapper delegates to install_harness.py.
                # Smoke the canonical installer here to avoid nested subprocess pipes
                # holding validation open in constrained sandboxes.
                for file in ["HARNESS.md", ".agent-harness/scripts/validate_harness.py", "AGENTS.md"]:
                    if not (target / file).exists():
                        errors.append(f"bootstrap output missing `{file}`")
                validator = target / ".agent-harness" / "scripts" / "validate_harness.py"
                if validator.exists():
                    check = run([sys.executable, str(validator), "--root", str(target), "--no-smoke"], cwd=target)
                    if check.returncode != 0:
                        errors.append(f"bootstrap output harness validation failed: {check.stderr.strip() or check.stdout.strip()}")


def files_listed_by_installer(stdout: str) -> set[str]:
    files: set[str] = set()
    capture = False
    for line in stdout.splitlines():
        if line.strip() in {"Files to copy:", "Files copied:"}:
            capture = True
            continue
        if capture:
            if not line.startswith("  "):
                capture = False
                continue
            value = line.strip()
            if value and not value.startswith("..."):
                files.add(value)
    return files


def load_installed_matrix(root: Path, errors: list[str]) -> dict:
    path = root / "docs" / "mode-requirements.json"
    if not path.exists():
        errors.append("docs/mode-requirements.json missing; installed validation cannot determine selected requirements")
        return {"modes": {}, "runtimeAdapters": {}, "projectTypes": {}, "modeOrder": []}
    try:
        return json.loads(read(path))
    except json.JSONDecodeError as exc:
        errors.append(f"docs/mode-requirements.json invalid JSON: {exc}")
        return {"modes": {}, "runtimeAdapters": {}, "projectTypes": {}, "modeOrder": []}


def parse_project_type_list(value: str | None) -> list[str]:
    raw = value or "none"
    parsed = [item.strip() for item in raw.split(",") if item.strip()]
    return parsed or ["none"]


def ordered_unique(values: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        if not value:
            continue
        normalized = str(value).strip().strip("/")
        if normalized and normalized not in seen:
            seen.add(normalized)
            result.append(normalized)
    return result


def mode_items(matrix: dict, mode: str, key: str, errors: list[str]) -> list[str]:
    order = matrix.get("modeOrder") or []
    modes = matrix.get("modes") or {}
    if not order:
        errors.append("docs/mode-requirements.json must define explicit modeOrder")
        return []
    if mode not in order:
        errors.append(f"selected mode `{mode}` is not in modeOrder")
        return []
    return ordered_unique([item for name in order[: order.index(mode) + 1] for item in (modes.get(name, {}).get(key, []) or [])])


def expand_required_path(root: Path, logical: str) -> list[str]:
    clean = logical.strip().strip("/")
    if not clean:
        return []
    candidate = root / clean
    if clean.endswith("/") or candidate.is_dir():
        if not candidate.exists():
            return [clean]
        return [path.relative_to(root).as_posix() for path in candidate.rglob("*") if path.is_file() and not should_skip_path(path)]
    return [clean]


def selected_installed_required(root: Path, cfg: dict, cli_mode: str | None, cli_runtime: str | None, cli_project_type: str | None, errors: list[str]) -> list[str]:
    mode = cli_mode or cfg.get("selected_mode") or "mvp"
    runtime = cli_runtime or cfg.get("selected_runtime") or "generic"
    project_types = parse_project_type_list(cli_project_type or cfg.get("selected_project_type") or "none")
    matrix = load_installed_matrix(root, errors)
    required = list(INSTALLED_BASE_REQUIRED)
    runtime_cfg = (matrix.get("runtimeAdapters") or {}).get(runtime)
    if runtime_cfg is None:
        errors.append(f"selected runtime `{runtime}` is not in docs/mode-requirements.json")
    else:
        if runtime_cfg.get("entrypoint"):
            required.append(runtime_cfg["entrypoint"])
        required.extend(runtime_cfg.get("requires", []) or [])
    required.extend(mode_items(matrix, mode, "requires", errors))
    for project_type in project_types:
        project_cfg = (matrix.get("projectTypes") or {}).get(project_type)
        if project_cfg is None:
            errors.append(f"selected project type `{project_type}` is not in docs/mode-requirements.json")
            continue
        required.extend(project_cfg.get("requires", []) or [])
    expanded: list[str] = []
    for item in ordered_unique(required):
        expanded.extend(expand_required_path(root, item))
    return ordered_unique(expanded)


def validate_selective_install_semantics(root: Path, errors: list[str]) -> None:
    installer = root / ".agent-harness" / "scripts" / "install_harness.py"
    if not installer.exists():
        errors.append("install_harness.py missing")
        return
    spec = importlib.util.spec_from_file_location("install_harness_module", installer)
    if spec is None or spec.loader is None:
        errors.append("could not import install_harness.py for selection regression checks")
        return
    previous_dont_write_bytecode = sys.dont_write_bytecode
    sys.dont_write_bytecode = True
    try:
        module = importlib.util.module_from_spec(spec)
        sys.modules[spec.name] = module
        spec.loader.exec_module(module)
    finally:
        sys.dont_write_bytecode = previous_dont_write_bytecode
        sys.modules.pop(spec.name, None)

    def selection(*, mode: str, runtime: str, project_type: str, phase: str) -> tuple[int, set[str]]:
        project_types = module.parse_project_types(project_type)
        items, _ = module.dedupe_install_items(module.build_install_items(
            root,
            mode=mode,
            runtime=runtime,
            project_types=project_types,
            phase=phase,
        ))
        return len(items), {item.target_rel.as_posix() for item in items}

    mode_counts: dict[str, int] = {}
    for mode in ["learning", "mvp", "real-project", "production"]:
        count, _ = selection(mode=mode, runtime="generic", project_type="none", phase="bootstrap")
        mode_counts[mode] = count
    if len(set(mode_counts.values())) <= 1:
        errors.append(f"mode-scoped install selection did not change file counts: {mode_counts}")
    if not (mode_counts.get("learning", 0) < mode_counts.get("mvp", 0) < mode_counts.get("real-project", 0) < mode_counts.get("production", 0)):
        errors.append(f"mode-scoped install counts should increase by mode inheritance: {mode_counts}")

    runtime_expectations = {
        "generic": {"present": ["AGENTS.md", ".agent/project-state.md"], "absent": ["CLAUDE.md", ".claude/commands/init-playbook.md", ".hermes/context.md"]},
        "claude": {"present": ["CLAUDE.md", ".claude/commands/init-playbook.md"], "absent": ["AGENTS.md", ".agent/project-state.md", ".hermes/context.md"]},
        "hermes": {"present": [".hermes/context.md", ".hermes/project-state.md"], "absent": ["AGENTS.md", "CLAUDE.md", ".claude/commands/init-playbook.md"]},
    }
    runtime_sets: dict[str, set[str]] = {}
    for runtime, expectation in runtime_expectations.items():
        _, files = selection(mode="mvp", runtime=runtime, project_type="none", phase="bootstrap")
        runtime_sets[runtime] = files
        for item in expectation["present"]:
            if item not in files:
                errors.append(f"runtime {runtime} selection missing expected `{item}`")
        for item in expectation["absent"]:
            if item in files:
                errors.append(f"runtime {runtime} selection unexpectedly includes `{item}`")
    if len({frozenset(v) for v in runtime_sets.values()}) != len(runtime_sets):
        errors.append("runtime-scoped install selections are not distinct")

    project_expectations = {
        "none": {"absent": ["DESIGN.md", "docs/api-contract.md", "docs/data-model.md"]},
        "ui": {"present": ["DESIGN.md", "docs/component-contract.md", "docs/browser-testing.md", "docs/browser-interaction-qa.md", "playwright.config.mjs", "tests/browser/ui-visual-smoke.spec.mjs", "scripts/browser-evidence.mjs"]},
        "api": {"present": ["docs/api-contract.md"], "absent": ["DESIGN.md"]},
        "backend": {"present": ["docs/data-model.md", "docs/testing-strategy.md"], "absent": ["DESIGN.md"]},
        "cli": {"present": ["docs/api-contract.md", "docs/testing-strategy.md", "docs/test-matrix.md"], "absent": ["DESIGN.md"]},
        "mixed": {"present": ["DESIGN.md", "docs/api-contract.md", "docs/component-contract.md", "docs/browser-interaction-qa.md", "playwright.config.mjs", "tests/browser/ui-visual-smoke.spec.mjs"]},
        "game": {"present": ["DESIGN.md", "docs/design-brief.md", "docs/game-project-adoption.md", "docs/browser-testing.md", "docs/browser-interaction-qa.md", "docs/visual-qa.md", "docs/component-contract.md", "playwright.config.mjs", "tests/browser/game-player-mode.spec.mjs", "scripts/browser-evidence.mjs"], "absent": ["docs/api-contract.md"]},
        "web3d": {"present": ["docs/3d-web-game-architecture.md", "docs/3d-asset-pipeline.md", "docs/3d-browser-testing.md", "docs/browser-interaction-qa.md", "tests/browser/web3d-canvas-ready.spec.mjs", "scripts/browser-evidence.mjs"]},
    }
    project_sets: dict[str, set[str]] = {}
    for project_type, expectation in project_expectations.items():
        _, files = selection(mode="mvp", runtime="generic", project_type=project_type, phase="bootstrap")
        project_sets[project_type] = files
        for item in expectation.get("present", []):
            if item not in files:
                errors.append(f"project type {project_type} selection missing expected `{item}`")
        for item in expectation.get("absent", []):
            if item in files:
                errors.append(f"project type {project_type} selection unexpectedly includes `{item}`")
    if project_sets["none"] == project_sets["ui"] or project_sets["ui"] == project_sets["api"]:
        errors.append("project-type install selections are not distinct enough")

    _, bootstrap_files = selection(mode="mvp", runtime="generic", project_type="ui", phase="bootstrap")
    _, release_files = selection(mode="mvp", runtime="generic", project_type="ui", phase="release")
    if release_files == bootstrap_files or len(release_files) <= len(bootstrap_files):
        errors.append("phase-scoped install selection should add release files beyond bootstrap")
    for item in ["docs/production-readiness.md", ".agent-harness/workflows/production-release-readiness.md"]:
        if item not in release_files:
            errors.append(f"release phase selection missing `{item}`")
        if item in bootstrap_files:
            errors.append(f"bootstrap phase selection should not include release-only `{item}`")



def validate_game_workflow_regression(root: Path, errors: list[str]) -> None:
    script = root / "project-playbook" / "scripts" / "validate-game-workflow.mjs"
    if not script.exists():
        errors.append("validate-game-workflow.mjs missing")
        return
    proc = run(["node", str(script)], cwd=root / "project-playbook")
    if proc.returncode != 0:
        errors.append(f"validate-game-workflow.mjs failed: {proc.stderr.strip() or proc.stdout.strip()}")

    installer = root / ".agent-harness" / "scripts" / "install_harness.py"
    if installer.exists():
        spec = importlib.util.spec_from_file_location("install_harness_game_regression", installer)
        if spec and spec.loader:
            previous_dont_write_bytecode = sys.dont_write_bytecode
            sys.dont_write_bytecode = True
            try:
                module = importlib.util.module_from_spec(spec)
                sys.modules[spec.name] = module
                spec.loader.exec_module(module)
                items, _ = module.dedupe_install_items(module.build_install_items(
                    root, mode="mvp", runtime="generic", project_types=["game", "web3d"], phase="game-adoption"
                ))
                selected = {item.target_rel.as_posix() for item in items}
                for required in [
                    ".agent-harness/checklists/game-player-facing-readiness.md",
                    "docs/game-project-adoption.md",
                    "docs/3d-web-game-architecture.md",
                    "docs/3d-asset-pipeline.md",
                    "docs/3d-browser-testing.md",
                    "docs/browser-interaction-qa.md",
                    "docs/composition-qa.md",
                    "docs/role-gate-quality-map.md",
                    "docs/design-brief.md",
                    "docs/visual-qa.md",
                    "docs/component-contract.md",
                    "playwright.config.mjs",
                    "tests/browser/game-player-mode.spec.mjs",
                    "scripts/browser-evidence.mjs",
                ]:
                    if required not in selected:
                        errors.append(f"game project selection missing `{required}`")
            finally:
                sys.dont_write_bytecode = previous_dont_write_bytecode
                sys.modules.pop(spec.name, None)


def validate_browser_pack_regression(root: Path, errors: list[str]) -> None:
    script = root / "project-playbook" / "scripts" / "browser-evidence.mjs"
    if not script.exists():
        errors.append("browser-evidence.mjs missing")
        return
    proc = run(["node", str(script), "--self-check"], cwd=root / "project-playbook")
    if proc.returncode != 0:
        errors.append(f"browser evidence pack self-check failed: {proc.stderr.strip() or proc.stdout.strip()}")
    for required in [
        "project-playbook/playwright.config.mjs",
        "project-playbook/tests/browser/ui-visual-smoke.spec.mjs",
        "project-playbook/tests/browser/game-player-mode.spec.mjs",
        "project-playbook/tests/browser/game-debug-mode.spec.mjs",
        "project-playbook/docs/validation-reports/browser-evidence-template.md",
        ".agent-harness/checklists/browser-evidence.md",
    ]:
        if not (root / required).exists():
            errors.append(f"browser evidence pack missing `{required}`")

def validate_guide_sync(root: Path, errors: list[str]) -> None:
    """Keep human-facing README/guide files aligned with the quality-system spine."""
    required_tokens: dict[str, list[str]] = {
        "README.md": ["role-gate-quality-map.md", "product-quality-system.md", "plan-quality.md", "composition-qa.md"],
        "QUICKSTART.md": ["role-gate-quality-map.md", "product-quality-system.md", "plan-quality.md", "composition-qa.md"],
        "HARNESS.md": ["role-gate-quality-map.md", "product-quality-system.md", "No plan-quality review", "post-validation product-quality role review"],
        "AGENTS.md": ["role-gate-quality-map.md", "product-quality-system.md", "pre-code role simulation"],
        "CLAUDE.md": ["role-gate-quality-map.md", "product-quality-system.md", "post-validation product-quality role review"],
        "project-playbook/START-HERE.md": ["role-gate-quality-map.md", "product-quality-system.md", "plan-quality.md", "composition-qa.md"],
        "project-playbook/FIRST-5-MINUTES.md": ["role-gate-quality-map.md", "product-quality-system.md", "plan-quality.md"],
        "project-playbook/QUICKSTART-15MIN.md": ["role-gate-quality-map.md", "product-quality-system.md", "plan-quality.md", "composition-qa.md"],
        "project-playbook/HARNESS.md": ["role-gate-quality-map.md", "product-quality-system.md", "No plan-quality review", "post-validation product-quality role review"],
        "project-playbook/AGENTS.md": ["role-gate-quality-map.md", "product-quality-system.md", "composition-qa.md"],
        "project-playbook/CLAUDE.md": ["role-gate-quality-map.md", "product-quality-system.md", "composition-qa.md"],
        "project-playbook/AGENT-RUNTIME-MAP.md": ["role-gate-quality-map.md", "product-quality-system.md", "plan-quality.md"],
        "project-playbook/DESIGN.md": ["composition-qa.md", "role-gate-quality-map.md", "visual dominance"],
        "project-playbook/docs/validation-reports/README.md": ["role-gate-quality-map.md", "post-validation product-quality role review", "composition-qa.md"],
        "project-playbook/docs/decisions/README.md": ["role-gate-quality-map.md", "plan-quality.md"],
        "project-playbook/docs/runbooks/README.md": ["role-gate-quality-map.md", "product-quality-system.md"],
        "project-playbook/.agent/workflows/guided-build.md": ["role-gate-quality-map.md", "plan-quality.md", "post-validation product-quality role review"],
        "project-playbook/.claude/commands/guided-build.md": ["role-gate-quality-map.md", "plan-quality.md", "post-validation product-quality role review"],
        "project-playbook/.hermes/workflows/guided-build.md": ["role-gate-quality-map.md", "plan-quality.md", "post-validation product-quality role review"],
        "project-playbook/design-assets/README.md": ["role-gate-quality-map.md", "composition-qa.md"],
        "project-playbook/design-assets/brand/README.md": ["role-gate-quality-map.md"],
        "project-playbook/design-assets/components/README.md": ["composition-qa.md"],
        "project-playbook/design-assets/flows/README.md": ["product-quality-system.md"],
        "project-playbook/design-assets/references/README.md": ["role-gate-quality-map.md"],
        "project-playbook/design-assets/screens/README.md": ["composition QA"],
        "project-playbook/design-assets/states/README.md": ["compositionally stable"],
    }
    for file, tokens in required_tokens.items():
        path = root / file
        if not path.exists():
            errors.append(f"guide sync check missing `{file}`")
            continue
        text = read(path)
        for token in tokens:
            if token not in text:
                errors.append(f"guide sync drift: `{file}` missing `{token}`")


def validate_runtime_entrypoint_regression(root: Path, errors: list[str]) -> None:
    source = root / "project-playbook"
    if not source.exists():
        return
    cases = [
        ("generic", "AGENTS.md"),
        ("claude", "CLAUDE.md"),
        ("hermes", ".hermes/context.md"),
    ]
    for runtime, entrypoint in cases:
        with tempfile.TemporaryDirectory(prefix="harness-entrypoint-regression-") as td:
            temp = Path(td) / "project"
            shutil.copytree(source, temp)
            target = temp / entrypoint
            if target.exists():
                target.unlink()
            proc = run([
                "node", "scripts/validate-project.mjs",
                "--mode", "mvp",
                "--runtime", runtime,
                "--project-type", "none",
                "--allow-template-placeholders",
            ], cwd=temp)
            if proc.returncode == 0:
                errors.append(f"validate-project.mjs did not fail when runtime entrypoint was missing for {runtime}: {entrypoint}")
            elif entrypoint not in (proc.stderr + proc.stdout):
                errors.append(f"validate-project.mjs missing-entrypoint failure for {runtime} did not mention `{entrypoint}`")


def validate_install_smoke(root: Path, errors: list[str]) -> None:
    installer = root / ".agent-harness" / "scripts" / "install_harness.py"
    if not installer.exists():
        errors.append("install_harness.py missing")
        return
    with tempfile.TemporaryDirectory(prefix="harness-install-") as td:
        target = Path(td) / "project"
        base_args = ["--target", str(target), "--mode", "mvp", "--runtime", "generic", "--project-type", "ui", "--phase", "bootstrap"]
        dry = run([sys.executable, str(installer), *base_args, "--dry-run"], cwd=root)
        if dry.returncode != 0:
            errors.append(f"install_harness.py dry-run failed: {dry.stderr.strip() or dry.stdout.strip()}")
            return
        merge = run([sys.executable, str(installer), *base_args, "--merge"], cwd=root)
        if merge.returncode != 0:
            errors.append(f"install_harness.py merge failed: {merge.stderr.strip() or merge.stdout.strip()}")
            return

        dry_summary = parse_colon_summary(dry.stdout)
        merge_summary = parse_colon_summary(merge.stdout)
        for key in ["install_strategy", "files_selected", "files_to_copy", "files_skipped_existing", "duplicate_destinations_ignored", "phase"]:
            if key not in dry_summary:
                errors.append(f"install_harness.py dry-run output missing `{key}`")
        if dry_summary.get("install_strategy") != INSTALL_STRATEGY:
            errors.append(f"install_harness.py must report {INSTALL_STRATEGY} strategy")
        if int_summary(dry_summary, "files_selected") != int_summary(dry_summary, "files_to_copy"):
            errors.append("install_harness.py dry-run into empty target should have files_selected == files_to_copy")
        if int_summary(merge_summary, "files_selected") != int_summary(merge_summary, "files_to_copy"):
            errors.append("install_harness.py merge into empty target should have files_selected == files_to_copy")
        if int_summary(merge_summary, "files_skipped_existing") != 0:
            errors.append("install_harness.py merge into empty target should skip 0 files")

        expected = ["HARNESS.md", "harness.config.json", "AGENTS.md", ".agent/project-state.md", "DESIGN.md", "docs/browser-testing.md", "docs/mode-requirements.json", "scripts/validate-project.mjs", "scripts/browser-evidence.mjs", "playwright.config.mjs", "tests/browser/ui-visual-smoke.spec.mjs"]
        unexpected = ["CLAUDE.md", ".hermes/context.md", "docs/production-readiness.md"]
        for file in expected:
            if not (target / file).exists():
                errors.append(f"installed project missing selected `{file}`")
        for file in unexpected:
            if (target / file).exists():
                errors.append(f"installed mvp/generic/ui/bootstrap project unexpectedly includes `{file}`")
        if (target / "AGENTS.md").exists() and "HARNESS.md" not in read(target / "AGENTS.md")[:800]:
            errors.append("installed `AGENTS.md` does not require reading HARNESS.md first")
        cfg_path = target / "harness.config.json"
        if cfg_path.exists():
            try:
                installed_cfg = json.loads(read(cfg_path))
                for key, expected_value in {"selected_mode": "mvp", "selected_runtime": "generic", "selected_project_type": "ui", "selected_phase": "bootstrap"}.items():
                    if installed_cfg.get(key) != expected_value:
                        errors.append(f"installed harness.config.json {key} expected `{expected_value}`, got `{installed_cfg.get(key)}`")
            except json.JSONDecodeError as exc:
                errors.append(f"installed harness.config.json invalid JSON: {exc}")
        proj = run(["node", "scripts/validate-project.mjs", "--mode", "mvp", "--runtime", "generic", "--project-type", "ui", "--allow-template-placeholders"], cwd=target)
        if proj.returncode != 0:
            errors.append(f"installed project template validation failed: {proj.stderr.strip() or proj.stdout.strip()}")


def validate_example_semantics(root: Path, errors: list[str]) -> None:
    script = root / "project-playbook" / "scripts" / "validate-example.mjs"
    if not script.exists():
        return
    unavailable = run(["node", str(script)], cwd=root / "project-playbook")
    if unavailable.returncode != 0:
        errors.append(f"validate-example.mjs default not_available check should be informational/success: {unavailable.stderr.strip() or unavailable.stdout.strip()}")
    if "not_available" not in (unavailable.stdout + unavailable.stderr):
        errors.append("validate-example.mjs unavailable output must include not_available")
    strict = run(["node", str(script), "--strict"], cwd=root / "project-playbook")
    if strict.returncode == 0:
        errors.append("validate-example.mjs --strict must return non-zero when filled examples are unavailable")
    allowed = run(["node", str(script), "--allow-unavailable"], cwd=root / "project-playbook")
    if allowed.returncode != 0:
        errors.append(f"validate-example.mjs --allow-unavailable failed: {allowed.stderr.strip() or allowed.stdout.strip()}")


def validate_ui_readability_semantics(root: Path, errors: list[str]) -> None:
    script = root / "project-playbook" / "scripts" / "validate-ui-readability.mjs"
    if not script.exists():
        return
    with tempfile.TemporaryDirectory(prefix="harness-ui-readability-") as td:
        temp = Path(td)
        (temp / "docs" / "validation-reports").mkdir(parents=True)
        negative = run(["node", str(script)], cwd=temp)
        if negative.returncode == 0:
            errors.append("validate-ui-readability.mjs must fail when no concrete validation report exists")
        report = temp / "docs" / "validation-reports" / "latest.md"
        report.write_text(
            "# UI readability report\n\n"
            "Status: pass\n"
            "Screenshot evidence path: artifacts/screenshots/home-desktop.png\n"
            "Viewport coverage: desktop 1440x900 and mobile 390x844\n"
            "Readability and contrast judgment: text is readable with acceptable contrast.\n"
            "Console and network review: console clean; network clean.\n",
            encoding="utf-8",
        )
        positive = run(["node", str(script)], cwd=temp)
        if positive.returncode != 0:
            errors.append(f"validate-ui-readability.mjs positive evidence smoke failed: {positive.stderr.strip() or positive.stdout.strip()}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate Agent Engineering Harness")
    parser.add_argument("--root", default=".", help="Harness package root or installed project root")
    parser.add_argument("--mode", choices=["learning", "mvp", "real-project", "production"], help="Expected installed project mode; overrides harness.config.json")
    parser.add_argument("--runtime", choices=["generic", "claude", "hermes"], help="Expected installed project runtime; overrides harness.config.json")
    parser.add_argument("--project-type", help="Expected installed project type; overrides harness.config.json")
    parser.add_argument("--no-smoke", action="store_true", help="Skip temp install/bootstrap smoke tests")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    errors: list[str] = []

    package_mode = (root / "project-playbook").exists()

    cfg = validate_config(root, errors)

    required = PACKAGE_REQUIRED + PROJECT_REQUIRED if package_mode else selected_installed_required(root, cfg, args.mode, args.runtime, args.project_type, errors)
    for file in required:
        if not (root / file).exists():
            errors.append(f"missing required file: {file}")
    validate_versions(root, package_mode, cfg, errors)

    if (root / "SKILL.md").exists():
        errors.append("SKILL.md should not exist at harness root; this package is not a ChatGPT Skill")
    if (root / "agents" / "openai.yaml").exists():
        errors.append("agents/openai.yaml should not exist at harness root; this package is not a Skill")

    if package_mode:
        for file in ["AGENTS.md", "CLAUDE.md", "project-playbook/AGENTS.md", "project-playbook/CLAUDE.md", "project-playbook/.hermes/context.md"]:
            must_contain(root, file, "HARNESS.md", errors, label=file)
        validate_package_scripts(root, errors)
        validate_docs_layout(root, package_mode, errors)
        validate_release_gates(root, "project-playbook", errors)
        validate_example_semantics(root, errors)
        validate_ui_readability_semantics(root, errors)
        validate_game_workflow_regression(root, errors)
        validate_browser_pack_regression(root, errors)
        validate_runtime_entrypoint_regression(root, errors)
        validate_guide_sync(root, errors)
    else:
        for file in ["AGENTS.md", "CLAUDE.md", ".hermes/context.md"]:
            if (root / file).exists():
                must_contain(root, file, "HARNESS.md", errors, label=file)
        validate_release_gates(root, "", errors)

    errors.extend(markdown_fence_errors(root))
    errors.extend(stale_reference_errors(root))
    errors.extend(heading_errors(root))
    if package_mode:
        errors.extend(markdown_link_errors(root, package_mode))
        errors.extend(backticked_path_errors(root, package_mode))
    # In installed selective projects, docs may legitimately mention files from
    # other runtimes, project types, or later phases that were not copied yet.
    # Package-mode still performs comprehensive link/path coverage.
    errors.extend(project_manifest_errors(root, package_mode))
    errors.extend(generated_file_errors(root))
    validate_helper_scripts(root, package_mode, errors, args.no_smoke)
    if package_mode:
        validate_selective_install_semantics(root, errors)
    if package_mode and not args.no_smoke and os.environ.get("HARNESS_EXTRA_INSTALL_SMOKE") == "1":
        validate_install_smoke(root, errors)

    if errors:
        print("Harness validation: fail")
        for error in errors:
            print(f"- {error}")
        return 1

    print("Harness validation: pass")
    print(f"root: {root}")
    print(f"mode: {'package' if package_mode else 'installed'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
