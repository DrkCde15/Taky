import streamlit as st
from datetime import datetime
from utils import api

STATUS_MAP = {"todo": "A Fazer", "in_progress": "Em Andamento", "blocked": "Bloqueado", "done": "Concluído"}
STATUS_ORDER = ["todo", "in_progress", "blocked", "done"]
STATUS_COLORS = {"todo": "#6b7280", "in_progress": "#3b82f6", "blocked": "#ef4444", "done": "#22c55e"}
PRIORITY_LABELS = {"low": "Baixa", "medium": "Média", "high": "Alta"}
PRIORITY_COLORS = {"low": "#22c55e", "medium": "#f59e0b", "high": "#ef4444"}


def task_card_html(task, members_map):
    pc = PRIORITY_COLORS.get(task.get("priority", "medium"), "#6b7280")
    pl = PRIORITY_LABELS.get(task.get("priority", "medium"), "")
    assignee = members_map.get(task.get("user_id"), "")
    tags = task.get("tags", "")
    tag_html = ""
    if tags:
        for t in [x.strip() for x in tags.split(",") if x.strip()]:
            tag_html += f"<span style='background:#2a2a3e;padding:1px 8px;border-radius:4px;font-size:10px;color:#8888aa;margin-right:4px'>{t}</span>"
    desc = task.get("description", "")
    desc_html = f"<p style='color:#6666aa;font-size:0.8rem;margin:4px 0 0'>{desc[:80]}{'...' if len(desc)>80 else ''}</p>" if desc else ""
    due = task.get("due_date")
    due_html = ""
    if due:
        try:
            d = datetime.fromisoformat(due.replace("Z", ""))
            due_html = f"<span style='color:#8888aa;font-size:0.75rem'>Due: {d.strftime('%d/%m')}</span>"
        except Exception:
            pass
    return f"""
    <div style='background:#1a1a2a;border:1px solid #2a2a3e;border-radius:10px;padding:12px;margin-bottom:8px;cursor:pointer'>
        <div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:6px'>
            <span style='background:{pc};padding:2px 8px;border-radius:4px;font-size:10px;color:#fff;font-weight:600'>{pl}</span>
            <span style='color:#8888aa;font-size:0.75rem'>{assignee}</span>
        </div>
        <div style='font-weight:600;color:#e8e8f0;font-size:0.9rem;margin-bottom:4px'>{task.get("title", "")}</div>
        {desc_html}
        <div style='display:flex;justify-content:space-between;align-items:center;margin-top:6px'>
            <div>{tag_html}</div>
            {due_html}
        </div>
    </div>"""


def show():
    if "teams_cache" not in st.session_state:
        try:
            st.session_state.teams_cache = api.get("/teams")
        except Exception:
            st.session_state.teams_cache = []

    teams = st.session_state.teams_cache
    if not teams:
        st.info("Você não está em nenhuma equipe.")
        return

    team_opts = {t["id"]: t["name"] for t in teams}
    sel_team = st.selectbox("Equipe", list(team_opts.keys()), format_func=lambda x: team_opts[x], key="ks_team")

    if "projects_cache" not in st.session_state or st.session_state.get("last_team_id") != sel_team:
        try:
            st.session_state.projects_cache = api.get(f"/projects/team/{sel_team}")
            st.session_state.last_team_id = sel_team
        except Exception:
            st.session_state.projects_cache = []

    projects = st.session_state.projects_cache
    if not projects:
        st.info("Nenhum projeto. Crie um primeiro.")
        with st.form("new_project"):
            st.text_input("Nome", key="np_name")
            st.text_input("Descrição (opcional)", key="np_desc")
            if st.form_submit_button("Criar Projeto", use_container_width=True):
                api.post("/projects", json={"name": st.session_state.np_name, "description": st.session_state.np_desc, "team_id": sel_team})
                st.session_state.projects_cache = api.get(f"/projects/team/{sel_team}")
                st.rerun()
        return

    proj_opts = {p["id"]: p["name"] for p in projects}
    active_proj = st.selectbox("Projeto", list(proj_opts.keys()), format_func=lambda x: proj_opts[x], key="ks_proj")
    st.session_state.active_project_id = active_proj

    try:
        members = api.get("/members")
        members_map = {m["id"]: m["name"] for m in members}
    except Exception:
        members_map = {}

    try:
        tasks = api.get("/tasks", params={"project_id": active_proj})
    except Exception:
        tasks = []

    filter_member = st.selectbox(
        "Filtrar por membro", ["all"] + list(members_map.keys()),
        format_func=lambda x: "Todos" if x == "all" else members_map.get(x, str(x)), key="ks_filter"
    )

    selected_task_id = st.session_state.get("selected_task_id")
    if selected_task_id:
        task = next((t for t in tasks if str(t["id"]) == str(selected_task_id)), None)
        if task:
            show_task_modal(task, members_map)
            if st.button("← Voltar ao quadro", use_container_width=True):
                st.session_state.selected_task_id = None
                st.rerun()
            return

    with st.expander("+ Nova Tarefa", expanded=False):
        with st.form("new_task"):
            title = st.text_input("Título*")
            desc = st.text_area("Descrição")
            c1, c2 = st.columns(2)
            with c1:
                priority = st.selectbox("Prioridade", ["low", "medium", "high"], format_func=lambda x: PRIORITY_LABELS.get(x, x))
                status = st.selectbox("Status", STATUS_ORDER, format_func=lambda x: STATUS_MAP.get(x, x))
            with c2:
                assignee = st.selectbox("Responsável", [None] + list(members_map.keys()), format_func=lambda x: "—" if x is None else members_map[x])
                tags = st.text_input("Tags (separadas por vírgula)")
            if st.form_submit_button("Criar", use_container_width=True):
                api.post("/tasks", json={
                    "title": title, "description": desc, "status": status,
                    "priority": priority, "tags": tags, "project_id": active_proj,
                    "user_id": assignee,
                })
                st.rerun()

    cols = st.columns(4)
    grouped = {s: [] for s in STATUS_ORDER}
    for t in tasks:
        s = t.get("status", "todo")
        if s not in grouped:
            s = "todo"
        if filter_member != "all" and t.get("user_id") != filter_member:
            continue
        grouped[s].append(t)

    for i, status in enumerate(STATUS_ORDER):
        with cols[i]:
            color = STATUS_COLORS[status]
            st.markdown(
                f"<div style='background:{color};padding:8px 14px;border-radius:8px;color:#fff;font-weight:600;font-size:0.9rem;text-align:center;margin-bottom:10px'>{STATUS_MAP[status]} ({len(grouped[status])})</div>",
                unsafe_allow_html=True,
            )
            for task in grouped[status]:
                st.markdown(task_card_html(task, members_map), unsafe_allow_html=True)
                if st.button(f"Abrir #{task['id']}", key=f"open_{task['id']}", use_container_width=True):
                    st.session_state.selected_task_id = task["id"]
                    st.rerun()


def show_task_modal(task, members_map):
    st.markdown(f"<h2 style='margin-bottom:0.5rem'>{task.get('title', '')}</h2>", unsafe_allow_html=True)

    tab1, tab2, tab3, tab4 = st.tabs(["Detalhes", "Comentários", "Histórico", "Arquivos"])

    with tab1:
        c1, c2 = st.columns([2, 1])
        with c1:
            desc = task.get("description", "")
            new_desc = st.text_area("Descrição", value=desc, height=150, key=f"td_{task['id']}")
        with c2:
            si = STATUS_ORDER.index(task["status"]) if task["status"] in STATUS_ORDER else 0
            new_status = st.selectbox("Status", STATUS_ORDER, index=si, format_func=lambda x: STATUS_MAP[x], key=f"ts_{task['id']}")
            pi = ["low", "medium", "high"].index(task["priority"]) if task["priority"] in ["low", "medium", "high"] else 1
            new_priority = st.selectbox("Prioridade", ["low", "medium", "high"], index=pi, format_func=lambda x: PRIORITY_LABELS[x], key=f"tp_{task['id']}")
            mo = list(members_map.keys())
            mi = mo.index(task["user_id"]) if task["user_id"] in mo else 0
            new_user = st.selectbox("Responsável", mo, index=mi, format_func=lambda x: members_map.get(x, "—"), key=f"tu_{task['id']}")
            due = task.get("due_date")
            due_val = None
            if due:
                try:
                    due_val = datetime.fromisoformat(due.replace("Z", ""))
                except Exception:
                    pass
            new_due = st.date_input("Data de entrega", value=due_val, key=f"tdu_{task['id']}")
            new_tags = st.text_input("Tags", value=task.get("tags", ""), key=f"tt_{task['id']}")

        if st.button("Salvar alterações", use_container_width=True, key=f"tsave_{task['id']}"):
            api.put(f"/tasks/{task['id']}", json={
                "title": task["title"], "description": new_desc, "status": new_status,
                "priority": new_priority, "tags": new_tags,
                "due_date": new_due.isoformat() if new_due else None,
                "project_id": st.session_state.active_project_id, "user_id": new_user,
            })
            st.success("Salvo!")
            st.rerun()

    with tab2:
        for c in task.get("comments", []):
            un = members_map.get(c.get("user_id"), "?")
            st.markdown(
                f"<div style='background:#16161f;border:1px solid #2a2a3e;border-radius:8px;padding:10px;margin-bottom:8px'>"
                f"<span style='color:#8888aa;font-size:0.75rem'>{un} · {str(c.get('created_at', ''))[:10]}</span>"
                f"<p style='color:#e8e8f0;margin:4px 0 0'>{c.get('content', '')}</p></div>",
                unsafe_allow_html=True,
            )
        new_c = st.text_area("Comentário", key=f"tc_{task['id']}")
        if st.button("Comentar", use_container_width=True, key=f"tcc_{task['id']}"):
            api.post(f"/tasks/{task['id']}/comments", json={"content": new_c, "user_id": st.session_state.user["id"]})
            st.rerun()

    with tab3:
        for h in task.get("history", []):
            st.markdown(
                f"<div style='background:#16161f;border:1px solid #2a2a3e;border-radius:8px;padding:8px 12px;margin-bottom:4px;font-size:0.85rem'>"
                f"<span style='color:#e8e8f0'>{h.get('action', '')}</span>"
                f"<span style='color:#8888aa;margin-left:12px'>{str(h.get('created_at', ''))[:16]}</span></div>",
                unsafe_allow_html=True,
            )

    with tab4:
        for f in task.get("files", []):
            st.markdown(f"<div style='color:#8888aa;font-size:0.85rem'>📎 {f.get('filename', '')}</div>", unsafe_allow_html=True)
        up = st.file_uploader("Upload", key=f"tup_{task['id']}")
        if up and st.button("Enviar", key=f"tsf_{task['id']}"):
            api.upload(f"/tasks/{task['id']}/files", up)
            st.rerun()

    st.markdown("---")
    ca, cb = st.columns(2)
    with ca:
        with st.form(key=f"tl_{task['id']}"):
            hrs = st.number_input("Horas", min_value=0.0, step=0.5)
            tld = st.text_input("Descrição")
            if st.form_submit_button("Registrar"):
                api.post(f"/tasks/{task['id']}/timelogs", json={"time_spent": hrs, "description": tld})
                st.rerun()
    with cb:
        total = sum(tl.get("time_spent", 0) for tl in task.get("timelogs", []))
        st.metric("Total de horas", f"{total:.1f}h")
        for tl in task.get("timelogs", []):
            st.caption(f"{tl.get('time_spent', 0)}h — {tl.get('description', '')}")

    if st.button("Excluir tarefa", type="primary", use_container_width=True):
        st.warning("Confirme a exclusão marcando abaixo e clicando novamente.")
        if st.checkbox("Confirmar exclusão", key=f"cd_{task['id']}"):
            api.delete(f"/tasks/{task['id']}")
            st.rerun()
