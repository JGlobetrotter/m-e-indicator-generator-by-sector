"""
M&E Indicator Generator — Streamlit app
Run with:  streamlit run app.py
"""

import time
import pandas as pd
import streamlit as st

from export_utils import export_to_csv, export_to_excel
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
    page_title="M&E Indicator Generator",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ---------------------------------------------------------------------------
# Session-state initialisation
# ---------------------------------------------------------------------------

def _init_state() -> None:
    defaults = {
        "step": 1,
        "project_info": None,
        # Dict[indicator_id -> {selected, baseline, target, frequency}]
        "selections": {},
        # List of custom MEIndicator objects added by the user
        "custom_indicators": [],
        # Controls whether the "add custom indicator" form is visible
        "show_custom_form": False,
    }
    for key, value in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = value


_init_state()

# ---------------------------------------------------------------------------
# Helper: build SelectedIndicator list from session state
# ---------------------------------------------------------------------------

def _get_selected_indicators() -> list[SelectedIndicator]:
    project_info: ProjectInfo = st.session_state.project_info
    db_indicators = get_indicators_for_sector(project_info.sector)
    all_indicators = db_indicators + st.session_state.custom_indicators

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
    st.title("📊 M&E Generator")
    st.divider()
    page = st.radio(
        "Navigate",
        ["M&E Indicator Generator", "KPI Library"],
        label_visibility="collapsed",
    )
    st.divider()
    st.caption("Evidence-based indicators aligned with SDGs, USAID, World Bank & OECD DAC frameworks.")

# ===========================================================================
# PAGE 1 — M&E Indicator Generator
# ===========================================================================

if page == "M&E Indicator Generator":

    # -----------------------------------------------------------------------
    # STEP 1 — Project Info Form
    # -----------------------------------------------------------------------

    if st.session_state.step == 1:
        st.title("M&E Indicator Generator")
        st.markdown(
            "Generate evidence-based monitoring & evaluation indicators for your "
            "development project — aligned with SDGs, USAID, World Bank, and OECD DAC frameworks."
        )
        st.divider()

        with st.form("project_info_form"):
            st.subheader("Project Details")
            col_a, col_b = st.columns(2)
            with col_a:
                org_name = st.text_input(
                    "Organization Name *",
                    placeholder="e.g., UNICEF, World Vision, Save the Children",
                )
            with col_b:
                project_name = st.text_input(
                    "Project Name *",
                    placeholder="e.g., Rural Water Access Improvement Program",
                )

            col_c, col_d = st.columns(2)
            with col_c:
                country = st.selectbox(
                    "Country of Implementation *",
                    [""] + COUNTRIES,
                    format_func=lambda x: "Select a country…" if x == "" else x,
                )
            with col_d:
                sector_options = [""] + ME_SECTORS
                sector_display = {
                    s: (f"{SECTOR_ICONS[s]}  {s}" if s else "Select a sector…")
                    for s in sector_options
                }
                sector = st.selectbox(
                    "Sector *",
                    sector_options,
                    format_func=lambda x: sector_display[x],
                )

            st.subheader("Additional Details")
            col_e, col_f, col_g = st.columns(3)
            with col_e:
                sub_sector = st.text_input(
                    "Sub-sector / Thematic Focus",
                    placeholder="e.g., Maternal Health",
                )
            with col_f:
                duration = st.text_input(
                    "Project Duration",
                    placeholder="e.g., 3 years (2024–2027)",
                )
            with col_g:
                target_pop = st.text_input(
                    "Target Population",
                    placeholder="e.g., 50,000 rural households",
                )

            submitted = st.form_submit_button(
                "Generate Indicators →",
                use_container_width=True,
                type="primary",
            )

        if submitted:
            errors: list[str] = []
            if not org_name.strip():
                errors.append("Organization name is required.")
            if not project_name.strip():
                errors.append("Project name is required.")
            if not country:
                errors.append("Country of implementation is required.")
            if not sector:
                errors.append("Sector is required.")

            if errors:
                for msg in errors:
                    st.error(msg)
            else:
                st.session_state.project_info = ProjectInfo(
                    organization_name=org_name.strip(),
                    project_name=project_name.strip(),
                    country=country,
                    sector=sector,
                    sub_sector=sub_sector.strip(),
                    project_duration=duration.strip(),
                    target_population=target_pop.strip(),
                )
                # Reset selections whenever a new project is started
                st.session_state.selections = {}
                st.session_state.custom_indicators = []
                st.session_state.show_custom_form = False
                st.session_state.step = 2
                st.rerun()

    # -----------------------------------------------------------------------
    # STEP 2 — Indicator Results
    # -----------------------------------------------------------------------

    elif st.session_state.step == 2:
        project_info: ProjectInfo = st.session_state.project_info
        icon = SECTOR_ICONS.get(project_info.sector, "")

        # Back button
        if st.button("← Back to project info"):
            st.session_state.step = 1
            st.rerun()

        # Header
        st.title(f"{icon} {project_info.sector} Indicators")
        st.caption(f"**{project_info.project_name}** — {project_info.organization_name} · {project_info.country}")
        st.divider()

        # Gather all indicators for this sector
        db_indicators = get_indicators_for_sector(project_info.sector)
        all_indicators = db_indicators + st.session_state.custom_indicators

        # Ensure every indicator has an entry in selections
        for ind in all_indicators:
            if ind.id not in st.session_state.selections:
                st.session_state.selections[ind.id] = {
                    "selected": False,
                    "baseline": "",
                    "target": "",
                    "frequency": ind.frequency,
                }

        # --- Filters ---
        filter_col1, filter_col2, filter_col3 = st.columns([3, 1.5, 1.2])
        with filter_col1:
            search = st.text_input(
                "Search indicators",
                placeholder="Search by title or definition…",
                label_visibility="collapsed",
            )
        with filter_col2:
            cat_filter = st.selectbox(
                "Category",
                ["All categories"] + INDICATOR_CATEGORIES,
                label_visibility="collapsed",
            )
        with filter_col3:
            if st.button("➕ Add custom indicator", use_container_width=True):
                st.session_state.show_custom_form = not st.session_state.show_custom_form
                st.rerun()

        # --- Custom indicator form ---
        if st.session_state.show_custom_form:
            with st.expander("New Custom Indicator", expanded=True):
                with st.form("custom_indicator_form", clear_on_submit=True):
                    ci_col1, ci_col2 = st.columns(2)
                    with ci_col1:
                        ci_title = st.text_input("Indicator Title *", placeholder="e.g., Number of beneficiaries trained")
                        ci_method = st.text_input("Measurement Method", placeholder="e.g., Project records")
                    with ci_col2:
                        ci_unit = st.text_input("Unit", placeholder="e.g., Number, %")
                        ci_source = st.text_input("Data Source", placeholder="e.g., Project database")
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
                            suggested_data_source=ci_source.strip() or "Project records",
                            framework_source="Custom",
                            sector=project_info.sector,
                            category="Output",
                        )
                        st.session_state.custom_indicators.append(new_ind)
                        st.session_state.selections[new_id] = {
                            "selected": True,
                            "baseline": "",
                            "target": "",
                            "frequency": "quarterly",
                        }
                        st.session_state.show_custom_form = False
                        st.success(f"Custom indicator '{new_ind.title}' added.")
                        st.rerun()

        # --- Apply filters ---
        filtered_indicators = [
            ind for ind in all_indicators
            if (cat_filter == "All categories" or ind.category == cat_filter)
            and (
                not search
                or search.lower() in ind.title.lower()
                or search.lower() in ind.definition.lower()
            )
        ]

        # --- Select all / deselect all ---
        sel_col1, sel_col2, sel_col3 = st.columns([2, 1, 1])
        with sel_col1:
            selected_count = sum(
                1 for ind in all_indicators
                if st.session_state.selections.get(ind.id, {}).get("selected", False)
            )
            st.markdown(f"**{len(filtered_indicators)}** indicators shown · **{selected_count}** selected")
        with sel_col2:
            if st.button("Select all visible", use_container_width=True):
                for ind in filtered_indicators:
                    st.session_state.selections[ind.id]["selected"] = True
                st.rerun()
        with sel_col3:
            if st.button("Deselect all", use_container_width=True):
                for ind in all_indicators:
                    st.session_state.selections[ind.id]["selected"] = False
                st.rerun()

        st.divider()

        # --- Indicator table via st.data_editor ---
        # Build the dataframe from the current session state so selections
        # persist across filter / search changes.
        indicator_ids = [ind.id for ind in filtered_indicators]

        df_rows = []
        for ind in filtered_indicators:
            sel = st.session_state.selections[ind.id]
            is_custom = ind.id.startswith("custom-")
            df_rows.append({
                "Select": sel["selected"],
                "Indicator": ("⭐ " if is_custom else "") + ind.title,
                "Definition": ind.definition,
                "Category": ind.category,
                "Unit": ind.unit,
                "Frequency": sel["frequency"],
                "Source": ind.source_url,
                "Framework": ind.framework_source,
                "Baseline": sel["baseline"],
                "Target": sel["target"],
            })

        df = pd.DataFrame(df_rows) if df_rows else pd.DataFrame(
            columns=["Select", "Indicator", "Definition", "Category",
                     "Unit", "Frequency", "Source", "Framework", "Baseline", "Target"]
        )

        if df_rows:
            edited_df = st.data_editor(
                df,
                column_config={
                    "Select": st.column_config.CheckboxColumn("✓", width="small"),
                    "Indicator": st.column_config.TextColumn("Indicator", width="large", disabled=True),
                    "Definition": st.column_config.TextColumn("Definition", width="large", disabled=True),
                    "Category": st.column_config.TextColumn("Category", width="small", disabled=True),
                    "Unit": st.column_config.TextColumn("Unit", width="small", disabled=True),
                    "Frequency": st.column_config.SelectboxColumn(
                        "Frequency",
                        options=FREQUENCY_OPTIONS,
                        width="medium",
                    ),
                    "Source": st.column_config.LinkColumn(
                        "Source",
                        display_text=r"https?://([^/]+)",
                        width="medium",
                        disabled=True,
                    ),
                    "Framework": st.column_config.TextColumn("Framework", width="medium", disabled=True),
                    "Baseline": st.column_config.TextColumn("Baseline", width="small"),
                    "Target": st.column_config.TextColumn("Target", width="small"),
                },
                hide_index=True,
                use_container_width=True,
                key="indicator_editor",
            )

            # Sync edits back to session state (runs on every rerun so state
            # is always up-to-date before any other widget interaction)
            for i, row in edited_df.iterrows():
                ind_id = indicator_ids[i]
                st.session_state.selections[ind_id] = {
                    "selected": bool(row["Select"]),
                    "baseline": str(row["Baseline"]) if row["Baseline"] else "",
                    "target": str(row["Target"]) if row["Target"] else "",
                    "frequency": str(row["Frequency"]),
                }
        else:
            st.info("No indicators match the current filters.")

        # --- Download bar (shown as soon as anything is selected) ---
        selected_indicators = _get_selected_indicators()

        filename_base = (
            f"{project_info.project_name or 'me-framework'}"
            .lower()
            .replace(" ", "-")
        )

        if selected_indicators:
            xlsx_bytes = export_to_excel(selected_indicators, project_info)
            csv_bytes = export_to_csv(selected_indicators, project_info).encode("utf-8")

            st.divider()
            dl_col1, dl_col2, dl_col3 = st.columns([3, 1.5, 1.5])
            with dl_col1:
                st.markdown(f"**{len(selected_indicators)} indicator(s) selected** — ready to export")
            with dl_col2:
                st.download_button(
                    label="📊 Download Excel",
                    data=xlsx_bytes,
                    file_name=f"{filename_base}.xlsx",
                    mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    use_container_width=True,
                    type="primary",
                )
            with dl_col3:
                st.download_button(
                    label="📄 Download CSV",
                    data=csv_bytes,
                    file_name=f"{filename_base}.csv",
                    mime="text/csv",
                    use_container_width=True,
                )

            with st.expander("Preview selected indicators"):
                preview_rows = [
                    {
                        "Indicator": si.indicator.title,
                        "Category": si.indicator.category,
                        "Unit": si.indicator.unit,
                        "Frequency": si.effective_frequency,
                        "Source": si.indicator.source_url,
                        "Framework": si.indicator.framework_source,
                        "Baseline": si.baseline,
                        "Target": si.target,
                    }
                    for si in selected_indicators
                ]
                st.dataframe(pd.DataFrame(preview_rows), use_container_width=True, hide_index=True)

# ===========================================================================
# PAGE 2 — KPI Library
# ===========================================================================

elif page == "KPI Library":
    st.title("KPI Library")
    st.markdown(
        "Browse cross-sector and sector-specific KPIs by category. "
        "Use the filters below to narrow results."
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
        # Add all sector-specific KPIs that match selected categories
        for sector_kpi_list in SECTOR_SPECIFIC_KPIS.values():
            for kpi in sector_kpi_list:
                if kpi.category in selected_categories:
                    kpis.append(kpi)
    else:
        kpis = get_kpis_for_sector_and_categories(selected_sector, selected_categories)

    # Apply complexity filter
    if complexity_filter == "Basic":
        kpis = [k for k in kpis if k.complexity == "basic"]
    elif complexity_filter == "Advanced":
        kpis = [k for k in kpis if k.complexity == "advanced"]

    st.caption(f"**{len(kpis)}** KPI(s) found")

    if not kpis:
        st.info("No KPIs match the selected filters.")
    else:
        kpi_df = pd.DataFrame([
            {
                "KPI": k.name,
                "Category": k.category,
                "Description": k.description,
                "Calculation": k.calculation_method,
                "Unit": k.unit,
                "Data Source": k.data_source,
                "Complexity": k.complexity.capitalize(),
                "Data Availability": k.data_availability.capitalize(),
            }
            for k in kpis
        ])
        st.dataframe(kpi_df, use_container_width=True, hide_index=True)

        # CSV download of the KPI list
        csv_out = kpi_df.to_csv(index=False).encode("utf-8")
        st.download_button(
            label="📄 Download KPI list (CSV)",
            data=csv_out,
            file_name="kpi-library.csv",
            mime="text/csv",
        )
