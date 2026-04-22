"""
Stage 1 Source Library — repository-level inventory of public M&E indicator sources.
Modular design: Stage 2 will add per-indicator extraction on top of this layer.
"""

from __future__ import annotations

import csv
import io
import json
import os
from dataclasses import dataclass, fields

_DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "indicator_repository_stage1.json")


@dataclass
class SourceRecord:
    source_id: str
    organization: str
    framework_system: str
    sector: str
    cross_cutting_domain: str
    source_type: str
    description: str
    canonical_url: str
    direct_file_url: str
    version: str
    publication_year: str
    last_accessed: str
    active_status: str


def load_sources() -> list[SourceRecord]:
    with open(_DATA_PATH, encoding="utf-8") as f:
        raw = json.load(f)
    return [SourceRecord(**r) for r in raw]


def validate_sources(records: list[SourceRecord]) -> list[str]:
    """Return a list of validation warnings (empty = all clear)."""
    warnings: list[str] = []
    seen_ids: set[str] = set()
    for r in records:
        if not r.source_id:
            warnings.append(f"Record missing source_id: {r.framework_system!r}")
        if r.source_id in seen_ids:
            warnings.append(f"Duplicate source_id: {r.source_id}")
        seen_ids.add(r.source_id)
        if not r.canonical_url:
            warnings.append(f"{r.source_id}: missing canonical_url")
    return warnings


def filter_sources(
    records: list[SourceRecord],
    *,
    sectors: list[str] | None = None,
    organizations: list[str] | None = None,
    source_types: list[str] | None = None,
    cross_cutting_domains: list[str] | None = None,
    active_only: bool = False,
    keyword: str = "",
) -> list[SourceRecord]:
    out = records
    if sectors:
        out = [r for r in out if any(s.lower() in r.sector.lower() for s in sectors)]
    if organizations:
        out = [r for r in out if r.organization in organizations]
    if source_types:
        out = [r for r in out if r.source_type in source_types]
    if cross_cutting_domains:
        out = [r for r in out if r.cross_cutting_domain in cross_cutting_domains]
    if active_only:
        out = [r for r in out if r.active_status == "Active"]
    if keyword:
        kw = keyword.lower()
        out = [
            r for r in out
            if kw in r.framework_system.lower()
            or kw in r.organization.lower()
            or kw in r.description.lower()
            or kw in r.sector.lower()
        ]
    return out


def to_csv(records: list[SourceRecord]) -> str:
    buf = io.StringIO()
    writer = csv.writer(buf, quoting=csv.QUOTE_ALL)
    writer.writerow([f.name for f in fields(SourceRecord)])
    for r in records:
        writer.writerow([getattr(r, f.name) for f in fields(SourceRecord)])
    return buf.getvalue()


def to_json(records: list[SourceRecord]) -> str:
    return json.dumps(
        [{f.name: getattr(r, f.name) for f in fields(SourceRecord)} for r in records],
        indent=2,
        ensure_ascii=False,
    )
