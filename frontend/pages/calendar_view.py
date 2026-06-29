import streamlit as st
from datetime import datetime, date
from calendar import monthrange
from utils import api

STATUS_MAP = {"todo": "A Fazer", "in_progress": "Em Andamento", "blocked": "Bloqueado", "done": "Concluído"}
PRIORITY_COLORS = {"low": "#22c55e", "medium": "#f59e0b", "high": "#ef4444"}
MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]


def show():
    if "teams_cache" not in st.session_state:
        try:
            st.session_state.teams_cache = api.get("/teams")
        except Exception:
            st.session_state.teams_cache = []

    teams = st.session_state.teams_cache
    if not teams:
        st.info("Nenhuma equipe.")
        return

    team_opts = {t["id"]: t["name"] for t in teams}
    sel_team = st.selectbox("Equipe", list(team_opts.keys()), format_func=lambda x: team_opts[x], key="cl_team")

    if "projects_cache" not in st.session_state or st.session_state.get("last_team_id") != sel_team:
        try:
            st.session_state.projects_cache = api.get(f"/projects/team/{sel_team}")
            st.session_state.last_team_id = sel_team
        except Exception:
            st.session_state.projects_cache = []

    projects = st.session_state.projects_cache
    if not projects:
        st.info("Nenhum projeto.")
        return

    proj_opts = {p["id"]: p["name"] for p in projects}
    sel_proj = st.selectbox("Projeto", list(proj_opts.keys()), format_func=lambda x: proj_opts[x], key="cl_proj")

    try:
        tasks = api.get("/tasks", params={"project_id": sel_proj})
    except Exception:
        tasks = []

    tasks_with_due = [t for t in tasks if t.get("due_date")]
    today = date.today()

    if "cal_month" not in st.session_state:
        st.session_state.cal_month = today.month
        st.session_state.cal_year = today.year

    cal_month = st.session_state.cal_month
    cal_year = st.session_state.cal_year

    h_cols = st.columns([1, 2, 1])
    with h_cols[0]:
        if st.button("← Anterior", use_container_width=True):
            if cal_month == 1:
                st.session_state.cal_month = 12
                st.session_state.cal_year -= 1
            else:
                st.session_state.cal_month -= 1
            st.rerun()
    with h_cols[1]:
        st.markdown(f"<h3 style='text-align:center'>{MONTHS[cal_month-1]} {cal_year}</h3>", unsafe_allow_html=True)
    with h_cols[2]:
        if st.button("Próximo →", use_container_width=True):
            if cal_month == 12:
                st.session_state.cal_month = 1
                st.session_state.cal_year += 1
            else:
                st.session_state.cal_month += 1
            st.rerun()

    days_in_month = monthrange(cal_year, cal_month)[1]
    first_weekday = monthrange(cal_year, cal_month)[0]

    tasks_by_day = {}
    for t in tasks_with_due:
        try:
            d = datetime.fromisoformat(t["due_date"].replace("Z", "")).date()
            if d.month == cal_month and d.year == cal_year:
                tasks_by_day.setdefault(d.day, []).append(t)
        except Exception:
            pass

    day_names = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
    header_html = "".join(f"<th style='color:#8888aa;font-size:0.8rem;padding:8px;text-align:center;font-weight:500'>{d}</th>" for d in day_names)

    cal_days = [""] * first_weekday + list(range(1, days_in_month + 1))
    rows = [cal_days[i:i + 7] for i in range(0, len(cal_days), 7)]

    table_rows = ""
    for row in rows:
        table_rows += "<tr>"
        for day in row:
            if day:
                dtasks = tasks_by_day.get(day, [])
                has_high = any(t.get("priority") == "high" for t in dtasks)
                is_today = day == today.day and cal_month == today.month and cal_year == today.year
                bg = "#ef444420" if has_high else ("#2a2a3e" if dtasks else "transparent")
                border = "2px solid #5a5a8e" if is_today else "1px solid #2a2a3e"
                dots = ""
                for t_ in dtasks[:4]:
                    p_ = t_.get("priority", "medium")
                    c_ = PRIORITY_COLORS.get(p_, "#fff")
                    dots += f"<span style='color:{c_};font-size:8px'>\u25cf</span> "
                suffix = f"<span style='font-size:9px;color:#8888aa'>+{len(dtasks)-4}</span>" if len(dtasks) > 4 else ""
                table_rows += f"<td style='background:{bg};border:{border};border-radius:8px;padding:8px;text-align:center;vertical-align:top;cursor:pointer' onclick=''>"
                table_rows += f"<div style='font-weight:{'700' if is_today else '500'};color:#e8e8f0;font-size:0.9rem'>{day}</div>"
                table_rows += f"<div style='margin-top:4px'>{dots}{suffix}</div></td>"
            else:
                table_rows += "<td style='border:1px solid transparent;padding:8px'></td>"
        table_rows += "</tr>"

    st.markdown(
        f"<table style='width:100%;border-collapse:separate;border-spacing:4px'>{header_html}{table_rows}</table>",
        unsafe_allow_html=True,
    )

    st.markdown("---")

    sel_day = st.session_state.get("cal_selected_day")
    if sel_day and sel_day in tasks_by_day:
        st.markdown(f"<h4>Tarefas de {sel_day}/{cal_month}/{cal_year}</h4>", unsafe_allow_html=True)
        for t in tasks_by_day[sel_day]:
            pc = PRIORITY_COLORS.get(t.get("priority", "medium"), "#fff")
            st.markdown(
                f"<div style='background:#16161f;border:1px solid #2a2a3e;border-radius:8px;padding:10px 14px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center'>"
                f"<span style='color:#e8e8f0;font-weight:500'>{t['title']}</span>"
                f"<span style='color:{pc};font-size:0.85rem'>{STATUS_MAP.get(t.get('status',''),'')}</span>"
                f"</div>",
                unsafe_allow_html=True,
            )
    elif sel_day:
        st.caption("Nenhuma tarefa neste dia.")

    if tasks_by_day:
        sel = st.selectbox("Ver tarefas do dia", ["—"] + sorted(tasks_by_day.keys()), key="cal_day_sel")
        if sel != "—":
            st.session_state.cal_selected_day = sel
            st.rerun()
