"""
Impact Measurement Generator — Streamlit app
Run with:  streamlit run app.py
"""

import time
import pandas as pd
import streamlit as st

from export_utils import export_to_csv, export_to_excel, export_kpis_to_excel
from kpi_database import (
    CATEGORY_KPIS,
    SECTOR_SPECIFIC_KPIS,
    get_kpis_for_sector_and_categories,
)
from me_database import ME_INDICATORS, get_indicators_for_sector
from models import (
    FREQUENCY_OPTIONS,
    INDICATOR_CATEGORIES,
    KPI_CATEGORIES,
    KPI_SECTORS,
    ME_SECTORS,
    SECTOR_ICONS,
    MEIndicator,
    ProjectInfo,
    SelectedIndicator,
)
from source_library import (
    SourceRecord,
    filter_sources,
    get_indicators_for_source,
    load_sources,
)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Angola", "Argentina", "Armenia",
    "Bangladesh", "Benin", "Bolivia", "Bosnia and Herzegovina", "Botswana",
    "Brazil", "Burkina Faso", "Burundi", "Cambodia", "Cameroon",
    "Central African Republic", "Chad", "Chile", "Colombia", "Comoros",
    "Congo (DRC)", "Congo (Republic)", "Costa Rica", "Côte d'Ivoire", "Cuba",
    "Djibouti", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
    "Eritrea", "Eswatini", "Ethiopia", "Fiji", "Gambia", "Georgia", "Ghana",
    "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
    "India", "Indonesia", "Iraq", "Jamaica", "Jordan", "Kazakhstan", "Kenya",
    "Kiribati", "Kosovo", "Kyrgyzstan", "Laos", "Lebanon", "Lesotho",
    "Liberia", "Libya", "Madagascar", "Malawi", "Malaysia", "Mali",
    "Marshall Islands", "Mauritania", "Mexico", "Micronesia", "Moldova",
    "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
    "Nepal", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Pakistan",
    "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru",
    "Philippines", "Rwanda", "Samoa", "São Tomé and Príncipe", "Senegal",
    "Serbia", "Sierra Leone", "Solomon Islands", "Somalia", "South Africa",
    "South Sudan", "Sri Lanka", "Sudan", "Suriname", "Syria", "Tajikistan",
    "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
    "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela",
    "Vietnam", "Yemen", "Zambia", "Zimbabwe",
]

CATEGORY_BADGE_CSS = {
    "Output":  "background:#dbeafe;color:#1e40af;border-radius:4px;padding:2px 8px;font-size:12px;",
    "Outcome": "background:#fef3c7;color:#92400e;border-radius:4px;padding:2px 8px;font-size:12px;",
    "Impact":  "background:#d1fae5;color:#065f46;border-radius:4px;padding:2px 8px;font-size:12px;",
}

# ---------------------------------------------------------------------------
# Page config
# ---------------------------------------------------------------------------

st.set_page_config(
    page_title="Impact Measurement Generator",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ---------------------------------------------------------------------------
# Session-state initialisation
# ---------------------------------------------------------------------------

def _init_state() -> None:
    defaults = {
        # Dict[indicator_id -> {selected, baseline, target, frequency}]
        "selections": {},
        # List of custom MEIndicator objects added by the user
        "custom_indicators": [],
        # Controls whether the "add custom indicator" form is visible
        "show_custom_form": False,
        # Dict[kpi_name -> bool] for KPI Library selections
        "kpi_selections": {},
    }
    for key, value in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = value


_init_state()

# ---------------------------------------------------------------------------
# Helper: build SelectedIndicator list from session state
# ---------------------------------------------------------------------------

def _get_selected_indicators() -> list[SelectedIndicator]:
    all_indicators = ME_INDICATORS + st.session_state.custom_indicators
    result: list[SelectedIndicator] = []
    for ind in all_indicators:
        sel = st.session_state.selections.get(ind.id, {})
        if sel.get("selected", False):
            result.append(
                SelectedIndicator(
                    indicator=ind,
                    baseline=sel.get("baseline", ""),
                    target=sel.get("target", ""),
                    custom_frequency=sel.get("frequency", ""),
                )
            )
    return result

# ---------------------------------------------------------------------------
# Sidebar navigation
# ---------------------------------------------------------------------------

with st.sidebar:
    st.markdown(
        "<h1 style='font-size:2rem;font-weight:800;line-height:1.2;margin-bottom:0.25rem'>"
        "Impact Measurement Generator</h1>",
        unsafe_allow_html=True,
    )
    st.divider()
    page = st.radio(
        "Navigate",
        ["M&E Indicator Library", "KPI Library"],
        label_visibility="collapsed",
    )
    st.divider()

    if page == "M&E Indicator Library":
        st.subheader("Project Info")
        st.caption("Optional — used for export metadata only.")
        st.text_input("Organization", key="sb_org", placeholder="e.g., UNICEF")
        st.text_input("Project Name", key="sb_project", placeholder="e.g., Health Access Program")
        st.selectbox(
            "Country",
            [""] + COUNTRIES,
            key="sb_country",
            format_func=lambda x: "Select a country…" if x == "" else x,
        )
    else:
        st.caption("Evidence-based indicators aligned with SDGs, USAID, World Bank & OECD DAC frameworks.")

# ===========================================================================
# PAGE 1 — M&E Indicator Library (unified source + indicator browse)
# ===========================================================================

_IND_EDITOR_COLS = {
    "Select":    st.column_config.CheckboxColumn("✓", width="small"),
    "Indicator": st.column_config.TextColumn("Indicator", width="large", disabled=True),
    "Category":  st.column_config.TextColumn("Category", width="small", disabled=True),
    "Unit":      st.column_config.TextColumn("Unit", width="small", disabled=True),
    "Frequency": st.column_config.SelectboxColumn("Frequency", options=FREQUENCY_OPTIONS, width="medium"),
    "Baseline":  st.column_config.TextColumn("Baseline", width="small"),
    "Target":    st.column_config.TextColumn("Target", width="small"),
}

_SOURCE_TYPE_COLORS: dict[str, str] = {
    "indicator registry":                    "background:#dbeafe;color:#1e40af",
    "metadata library":                      "background:#fef3c7;color:#92400e",
    "donor framework":                       "background:#d1fae5;color:#065f46",
    "survey indicator guide":                "background:#ede9fe;color:#5b21b6",
    "survey instrument/question repository": "background:#fce7f3;color:#9d174d",
    "humanitarian cluster registry":         "background:#ffedd5;color:#c2410c",
    "indicator registry/metadata library":   "background:#e0f2fe;color:#0369a1",
}


def _badge(label: str, css: str) -> str:
    return (
        f'<span style="{css};border-radius:4px;padding:2px 8px;'
        f'font-size:12px;margin-right:4px;">{label}</span>'
    )


def _render_indicator_table(
    indicators: list[MEIndicator],
    editor_key: str,
) -> None:
    """Render a mini indicator table inside a source card and sync selections."""
    if not indicators:
        return

    ind_ids = [ind.id for ind in indicators]
    # Ensure all have session state entries
    for ind in indicators:
        if ind.id not in st.session_state.selections:
            st.session_state.selections[ind.id] = {
                "selected": False, "baseline": "", "target": "", "frequency": ind.frequency,
            }

    sa_col, sd_col, _ = st.columns([1, 1, 4])
    with sa_col:
        if st.button("Select all", key=f"sa_{editor_key}", use_container_width=True):
            for ind in indicators:
                st.session_state.selections[ind.id]["selected"] = True
            st.rerun()
    with sd_col:
        if st.button("Deselect", key=f"sd_{editor_key}", use_container_width=True):
            for ind in indicators:
                st.session_state.selections[ind.id]["selected"] = False
            st.rerun()

    df_rows = []
    for ind in indicators:
        sel = st.session_state.selections[ind.id]
        prefix = "⭐ " if ind.id.startswith("custom-") else ""
        df_rows.append({
            "Select":    sel["selected"],
            "Indicator": prefix + ind.title,
            "Category":  ind.category,
            "Unit":      ind.unit,
            "Frequency": sel["frequency"],
            "Baseline":  sel["baseline"],
            "Target":    sel["target"],
        })

    edited = st.data_editor(
        pd.DataFrame(df_rows),
        column_config=_IND_EDITOR_COLS,
        hide_index=True,
        use_container_width=True,
        key=editor_key,
    )

    for i, row in edited.iterrows():
        st.session_state.selections[ind_ids[i]] = {
            "selected":  bool(row["Select"]),
            "baseline":  str(row["Baseline"]) if row["Baseline"] else "",
            "target":    str(row["Target"]) if row["Target"] else "",
            "frequency": str(row["Frequency"]),
        }


if page == "M&E Indicator Library":

    st.header("M&E Indicator Library")
    st.markdown(
        "Browse indicator sources below, select indicators, then export your M&E framework. "
        "Add project details in the sidebar for export metadata."
    )

    all_sources = load_sources()
    all_me_indicators = ME_INDICATORS + st.session_state.custom_indicators

    # Ensure every indicator has a session state entry up-front
    for _ind in all_me_indicators:
        if _ind.id not in st.session_state.selections:
            st.session_state.selections[_ind.id] = {
                "selected": False, "baseline": "", "target": "", "frequency": _ind.frequency,
            }

    # ── Filter bar ──────────────────────────────────────────────────────────
    _all_src_types = sorted({r.source_type for r in all_sources})
    fc1, fc2, fc3 = st.columns([3, 1.5, 1.5])
    with fc1:
        me_search = st.text_input(
            "Search",
            placeholder="Search sources by name, organization or description…",
            label_visibility="collapsed",
        )
    with fc2:
        me_type_filter = st.multiselect(
            "Source type", _all_src_types,
            placeholder="Source type…", label_visibility="collapsed",
        )
    with fc3:
        me_sector_filter = st.multiselect(
            "Sector", ME_SECTORS,
            placeholder="Sector…", label_visibility="collapsed",
        )

    # ── Custom indicator button (inline, under search bar) ───────────────────
    if st.button("➕ Add custom indicator"):
        st.session_state.show_custom_form = not st.session_state.show_custom_form
        st.rerun()

    if st.session_state.show_custom_form:
        with st.expander("New Custom Indicator", expanded=True):
            with st.form("custom_indicator_form", clear_on_submit=True):
                ci_col1, ci_col2 = st.columns(2)
                with ci_col1:
                    ci_title = st.text_input("Indicator Title *", placeholder="e.g., Number of beneficiaries trained")
                    ci_method = st.text_input("Measurement Method", placeholder="e.g., Project records")
                with ci_col2:
                    ci_unit = st.text_input("Unit", placeholder="e.g., Number, %")
                    ci_source_input = st.text_input("Data Source", placeholder="e.g., Project database")
                ci_definition = st.text_area("Definition", placeholder="Describe what this indicator measures", height=80)
                ci_submit = st.form_submit_button("Add Indicator", type="primary")

            if ci_submit:
                if not ci_title.strip():
                    st.error("Indicator title is required.")
                else:
                    new_id = f"custom-{int(time.time() * 1000)}"
                    new_ind = MEIndicator(
                        id=new_id,
                        title=ci_title.strip(),
                        definition=ci_definition.strip() or "Custom indicator",
                        measurement_method=ci_method.strip() or "To be defined",
                        unit=ci_unit.strip() or "Number",
                        frequency="quarterly",
                        suggested_data_source=ci_source_input.strip() or "Project records",
                        framework_source="Custom",
                        sector="Custom",
                        category="Output",
                    )
                    st.session_state.custom_indicators.append(new_ind)
                    st.session_state.selections[new_id] = {
                        "selected": True, "baseline": "", "target": "", "frequency": "quarterly",
                    }
                    st.session_state.show_custom_form = False
                    st.success(f"Custom indicator '{new_ind.title}' added.")
                    st.rerun()

    # Apply source filters
    filtered_sources = filter_sources(
        all_sources,
        source_types=me_type_filter or None,
        active_only=False,
        keyword=me_search,
    )
    if me_sector_filter:
        filtered_sources = [
            r for r in filtered_sources
            if any(s.lower() in r.sector.lower() for s in me_sector_filter)
        ]

    # Sort: SDG framework always last; others by indicator count desc then alpha
    filtered_sources.sort(
        key=lambda r: (
            1 if r.source_id == "SRC022" else 0,
            -len(get_indicators_for_source(r.source_id, all_me_indicators)),
            r.framework_system.lower(),
        )
    )

    # ── Global status + export bar ──────────────────────────────────────────
    _selected_now = _get_selected_indicators()
    _project_info = ProjectInfo(
        organization_name=st.session_state.get("sb_org", ""),
        project_name=st.session_state.get("sb_project", ""),
        country=st.session_state.get("sb_country", ""),
    )
    _fname = (
        (st.session_state.get("sb_project") or "me-framework")
        .lower().replace(" ", "-")
    )

    sc1, sc2, sc3 = st.columns([3, 1.2, 1.2])
    with sc1:
        st.markdown(
            f"**{len(filtered_sources)}** of **{len(all_sources)}** sources shown · "
            f"**{len(_selected_now)}** indicator(s) selected"
        )
    with sc2:
        st.download_button(
            "📊 Download Excel",
            data=export_to_excel(_selected_now, _project_info) if _selected_now else b"",
            file_name=f"{_fname}.xlsx",
            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            use_container_width=True,
            type="primary",
            disabled=not _selected_now,
        )
    with sc3:
        st.download_button(
            "📄 Download CSV",
            data=export_to_csv(_selected_now, _project_info).encode("utf-8") if _selected_now else b"",
            file_name=f"{_fname}.csv",
            mime="text/csv",
            use_container_width=True,
            disabled=not _selected_now,
        )

    st.divider()

    # ── Source cards (only shown when a filter or search is active) ───────────
    if not (me_search or me_type_filter or me_sector_filter):
        st.info("Use the search box or filters above to browse indicator sources.")
    else:
        for rec in filtered_sources:
            src_indicators = get_indicators_for_source(rec.source_id, all_me_indicators)
            ind_count = len(src_indicators)
            count_label = f"{ind_count} indicator{'s' if ind_count != 1 else ''} in library"

            type_css = _SOURCE_TYPE_COLORS.get(rec.source_type, "background:#f3f4f6;color:#374151")
            card_title = f"**{rec.framework_system}** — {rec.organization}   ·   *{count_label}*"

            with st.expander(card_title, expanded=False):
                badges = _badge(rec.source_type, type_css)
                if rec.active_status == "Active":
                    badges += _badge("Active", "background:#d1fae5;color:#065f46")
                if rec.sector:
                    badges += _badge(rec.sector[:40], "background:#f3f4f6;color:#374151")
                st.markdown(badges, unsafe_allow_html=True)
                st.markdown(rec.description)

                link_parts = [f"[{rec.canonical_url}]({rec.canonical_url})"]
                if rec.direct_file_url and rec.direct_file_url != rec.canonical_url:
                    link_parts.append(f"[Direct download]({rec.direct_file_url})")
                st.markdown("  ·  ".join(link_parts))

                if ind_count > 0:
                    st.divider()
                    st.caption(f"Select indicators from this source:")
                    _render_indicator_table(src_indicators, editor_key=f"ed_{rec.source_id}")

        # ── Other Frameworks card (unlinked non-ESG indicators only) ─────────
        _ESG_SECTOR = "Private Sector / ESG / Supply Chain"
        unlinked_indicators = [
            ind for ind in all_me_indicators
            if not ind.source_ids and ind.sector != _ESG_SECTOR
        ]
        if unlinked_indicators:
            other_count = len(unlinked_indicators)
            with st.expander(
                f"**Other Frameworks** (USAID sector codes, World Bank, ILO…)   ·   "
                f"*{other_count} indicator{'s' if other_count != 1 else ''} in library*",
                expanded=False,
            ):
                st.markdown(
                    "Indicators linked to frameworks not yet catalogued as source records "
                    "(USAID DR/EG/ES codes, World Bank, ILO). "
                    "ESG/Private Sector indicators (GRI, SASB, TCFD) are in the KPI Library."
                )
                st.divider()
                _render_indicator_table(unlinked_indicators, editor_key="ed_other")

# ===========================================================================
# PAGE 2 — KPI Library
# ===========================================================================

elif page == "KPI Library":
    st.title("KPI Library")
    st.markdown(
        "Browse cross-sector and sector-specific KPIs by category. "
        "Check the boxes to select KPIs, then download your selection as Excel."
    )
    st.divider()

    # --- Overview ---
    ov_col1, ov_col2 = st.columns(2)
    with ov_col1:
        kpi_org_name = st.text_input(
            "Organization Name *",
            placeholder="e.g., UNICEF, World Vision, Save the Children",
            key="kpi_org_name",
        )
    with ov_col2:
        kpi_country = st.selectbox(
            "Country of Implementation *",
            [""] + COUNTRIES,
            format_func=lambda x: "Select a country…" if x == "" else x,
            key="kpi_country",
        )
    st.divider()

    kpi_col1, kpi_col2 = st.columns(2)
    with kpi_col1:
        selected_sector = st.selectbox(
            "Sector",
            ["All sectors"] + KPI_SECTORS,
        )
    with kpi_col2:
        selected_categories = st.multiselect(
            "Categories",
            KPI_CATEGORIES,
            default=KPI_CATEGORIES,
        )

    complexity_filter = st.radio(
        "Complexity",
        ["All", "Basic", "Advanced"],
        horizontal=True,
    )

    if not selected_categories:
        st.warning("Select at least one category to see KPIs.")
        st.stop()

    # Gather KPIs
    if selected_sector == "All sectors":
        kpis = []
        for cat in selected_categories:
            kpis.extend(CATEGORY_KPIS.get(cat, []))
        for sector_kpi_list in SECTOR_SPECIFIC_KPIS.values():
            for kpi in sector_kpi_list:
                if kpi.category in selected_categories:
                    kpis.append(kpi)
    else:
        kpis = get_kpis_for_sector_and_categories(selected_sector, selected_categories)

    if complexity_filter == "Basic":
        kpis = [k for k in kpis if k.complexity == "basic"]
    elif complexity_filter == "Advanced":
        kpis = [k for k in kpis if k.complexity == "advanced"]

    # Ensure every visible KPI has an entry in kpi_selections
    for kpi in kpis:
        if kpi.name not in st.session_state.kpi_selections:
            st.session_state.kpi_selections[kpi.name] = False

    # Select-all / deselect-all row
    kpi_selected_count = sum(
        1 for kpi in kpis
        if st.session_state.kpi_selections.get(kpi.name, False)
    )
    sa_col1, sa_col2, sa_col3 = st.columns([3, 1, 1])
    with sa_col1:
        st.caption(f"**{len(kpis)}** KPI(s) found · **{kpi_selected_count}** selected")
    with sa_col2:
        if st.button("Select all", use_container_width=True, key="kpi_sel_all"):
            for kpi in kpis:
                st.session_state.kpi_selections[kpi.name] = True
            st.rerun()
    with sa_col3:
        if st.button("Deselect all", use_container_width=True, key="kpi_desel_all"):
            for kpi in kpis:
                st.session_state.kpi_selections[kpi.name] = False
            st.rerun()

    if not kpis:
        st.info("No KPIs match the selected filters.")
    else:
        kpi_names = [k.name for k in kpis]
        kpi_df = pd.DataFrame([
            {
                "Select": st.session_state.kpi_selections.get(k.name, False),
                "KPI": k.name,
                "Category": k.category,
                "Description": k.description,
                "Calculation": k.calculation_method,
                "Unit": k.unit,
                "Data Source": k.data_source,
                "Complexity": k.complexity.capitalize(),
                "Data Availability": k.data_availability.capitalize(),
                "Source": k.source_url,
            }
            for k in kpis
        ])

        edited_kpi_df = st.data_editor(
            kpi_df,
            column_config={
                "Select": st.column_config.CheckboxColumn("✓", width="small"),
                "KPI": st.column_config.TextColumn("KPI", width="large", disabled=True),
                "Category": st.column_config.TextColumn("Category", width="medium", disabled=True),
                "Description": st.column_config.TextColumn("Description", width="large", disabled=True),
                "Calculation": st.column_config.TextColumn("Calculation", width="large", disabled=True),
                "Unit": st.column_config.TextColumn("Unit", width="small", disabled=True),
                "Data Source": st.column_config.TextColumn("Data Source", width="medium", disabled=True),
                "Complexity": st.column_config.TextColumn("Complexity", width="small", disabled=True),
                "Data Availability": st.column_config.TextColumn("Data Availability", width="small", disabled=True),
                "Source": st.column_config.LinkColumn(
                    "Source",
                    display_text=r"https?://(?:www\.)?([^/]+)",
                    width="medium",
                    disabled=True,
                ),
            },
            hide_index=True,
            use_container_width=True,
            key="kpi_editor",
        )

        # Sync checkbox state back to session state
        for i, row in edited_kpi_df.iterrows():
            st.session_state.kpi_selections[kpi_names[i]] = bool(row["Select"])

        # Download bar
        selected_kpis = [
            kpi for kpi in kpis
            if st.session_state.kpi_selections.get(kpi.name, False)
        ]
        if selected_kpis:
            st.divider()
            dl_col1, dl_col2 = st.columns([3, 1.5])
            with dl_col1:
                st.markdown(f"**{len(selected_kpis)} KPI(s) selected** — ready to export")
            with dl_col2:
                st.download_button(
                    label="📊 Download Excel",
                    data=export_kpis_to_excel(selected_kpis, kpi_org_name, kpi_country),
                    file_name="kpi-selection.xlsx",
                    mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    use_container_width=True,
                    type="primary",
                )

    # ── ESG / Private Sector Frameworks ─────────────────────────────────────
    _esg_indicators = [
        ind for ind in ME_INDICATORS
        if ind.sector == "Private Sector / ESG / Supply Chain"
    ]
    st.divider()
    with st.expander(
        f"**ESG & Private Sector Frameworks** (GRI, SASB, TCFD, SA8000)   ·   "
        f"*{len(_esg_indicators)} indicators*",
        expanded=False,
    ):
        st.markdown(
            "M&E indicators drawn from ESG reporting standards — "
            "useful for private sector, supply chain, and corporate sustainability programs."
        )
        st.divider()
        _render_indicator_table(_esg_indicators, editor_key="ed_esg")

# ===========================================================================
# Footer
# ===========================================================================

st.divider()
st.markdown(
    "<div style='text-align:center;color:#9ca3af;font-size:13px;padding:6px 0 12px'>"
    "Built by <a href='https://navisignal.app' target='_blank' style='color:#6b7280;text-decoration:none'>"
    "Navisignal.app</a> &nbsp;·&nbsp; "
    "Questions or feedback? Email us at "
    "<a href='mailto:hello@navisignal.app' style='color:#6b7280;text-decoration:none'>"
    "hello@navisignal.app</a>"
    "</div>",
    unsafe_allow_html=True,
)

