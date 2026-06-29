import streamlit as st
from utils import api
from collections import Counter

STATUS_MAP = {"todo": "A Fazer", "in_progress": "Em Andamento", "blocked": "Bloqueado", "done": "Concluído"}
PRIORITY_LABELS = {"low": "Baixa", "medium": "Média", "high": "Alta"}


def show():
    user = st.session_state.user
    if user.get("role") not in ("admin", "owner"):
        st.error("Acesso restrito.")
        st.stop()

    try:
        teams = api.get("/teams")
    except Exception:
        teams = []

    try:
        members = api.get("/members")
        members_map = {m["id"]: m["name"] for m in members}
    except Exception:
        members_map = {}

    if not teams:
        st.info("Nenhuma equipe.")
        return

    team_opts = {t["id"]: t["name"] for t in teams}
    sel_team = st.selectbox("Equipe", list(team_opts.keys()), format_func=lambda x: team_opts[x], key="ad_team")

    try:
        projects = api.get(f"/projects/team/{sel_team}")
    except Exception:
        projects = []

    if not projects:
        st.info("Nenhum projeto.")
        return

    proj_opts = {p["id"]: p["name"] for p in projects}
    sel_proj = st.selectbox("Projeto", list(proj_opts.keys()), format_func=lambda x: proj_opts[x], key="ad_proj")

    try:
        all_tasks = api.get("/tasks", params={"project_id": sel_proj})
    except Exception:
        all_tasks = []

    if not all_tasks:
        st.info("Nenhuma tarefa.")
        return

    total = len(all_tasks)
    done = sum(1 for t in all_tasks if t.get("status") == "done")
    blocked = sum(1 for t in all_tasks if t.get("status") == "blocked")
    hours = sum(sum(tl.get("time_spent", 0) for tl in t.get("timelogs", [])) for t in all_tasks)

    k1, k2, k3, k4 = st.columns(4)
    with k1:
        st.metric("Total", total)
    with k2:
        st.metric("Concluídas", done, delta=f"{round(done/total*100)}%" if total else "0%")
    with k3:
        st.metric("Bloqueadas", blocked)
    with k4:
        st.metric("Horas", f"{hours:.1f}h")

    st.markdown("---")

    ca, cb = st.columns(2)
    with ca:
        st.markdown("<h4>Por Status</h4>", unsafe_allow_html=True)
        sc = Counter(t.get("status", "todo") for t in all_tasks)
        sd = {STATUS_MAP.get(s, s): c for s, c in sc.items()}
        if sd:
            st.bar_chart(sd, height=250)
    with cb:
        st.markdown("<h4>Por Prioridade</h4>", unsafe_allow_html=True)
        pc = Counter(t.get("priority", "medium") for t in all_tasks)
        pd = {PRIORITY_LABELS.get(p, p): c for p, c in pc.items()}
        if pd:
            st.bar_chart(pd, height=250)

    st.markdown("<h4>Tarefas por Membro</h4>", unsafe_allow_html=True)
    mtc = Counter()
    mhc = Counter()
    for t in all_tasks:
        uid = t.get("user_id")
        if uid:
            mtc[uid] += 1
            mhc[uid] += sum(tl.get("time_spent", 0) for tl in t.get("timelogs", []))
    md = {}
    for uid, c in mtc.items():
        name = members_map.get(uid, f"ID {uid}")
        md[f"{name}\n({mhc[uid]:.1f}h)"] = c
    if md:
        st.bar_chart(md, height=250)

    st.markdown("<h4>Gerenciar Membros</h4>", unsafe_allow_html=True)
    for m in members:
        st.markdown(
            f"<div style='background:#16161f;border:1px solid #2a2a3e;border-radius:10px;padding:10px 14px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between'>"
            f"<div><span style='font-weight:500;color:#e8e8f0'>{m.get('name', '')}</span>"
            f"<span style='color:#8888aa;margin-left:12px;font-size:0.85rem'>{m.get('email', '')}</span>"
            f"<span style='background:#2a2a3e;padding:2px 8px;border-radius:4px;font-size:0.75rem;color:#8888aa;margin-left:8px'>{m.get('role', 'member')}</span></div>"
            f"</div>",
            unsafe_allow_html=True,
        )
        if m["id"] != st.session_state.user["id"]:
            if st.button(f"Remover {m['name']}", key=f"adrm_{m['id']}", use_container_width=True):
                api.delete(f"/members/{m['id']}")
                st.rerun()
