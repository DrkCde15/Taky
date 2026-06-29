import streamlit as st
from utils import api


def show():
    try:
        teams = api.get("/teams")
    except Exception:
        teams = []

    try:
        members = api.get("/members")
        members_map = {m["id"]: m for m in members}
    except Exception:
        members_map = {}

    c1, c2 = st.columns([1, 1.8])

    with c1:
        st.markdown("<h3 style='margin-bottom:1rem'>Equipes</h3>", unsafe_allow_html=True)

        for team in teams:
            is_owner = team.get("owner_id") == st.session_state.user["id"]
            st.markdown(
                f"<div style='background:#16161f;border:1px solid #2a2a3e;border-radius:10px;padding:12px;margin-bottom:8px'>"
                f"<div style='display:flex;justify-content:space-between;align-items:center'>"
                f"<span style='font-weight:600;color:#e8e8f0'>{team['name']}</span>"
                f"<span style='background:#2a2a3e;padding:2px 10px;border-radius:4px;font-size:0.75rem;color:#8888aa'>{'Proprietário' if is_owner else 'Membro'}</span>"
                f"</div>"
                f"<span style='color:#8888aa;font-size:0.8rem'>{len(team.get('members', []))} membro(s)</span>"
                f"</div>",
                unsafe_allow_html=True,
            )

            if is_owner:
                col_a, col_b, col_c = st.columns([1, 1, 1])
                with col_a:
                    if st.button("Renomear", key=f"rn_{team['id']}", use_container_width=True):
                        st.session_state[f"ren_{team['id']}"] = True
                with col_b:
                    if st.button("Excluir", key=f"del_{team['id']}", use_container_width=True, type="primary"):
                        api.delete(f"/teams/{team['id']}")
                        st.session_state.teams_cache = api.get("/teams")
                        st.rerun()

                if st.session_state.get(f"ren_{team['id']}"):
                    nn = st.text_input("Novo nome", value=team["name"], key=f"nn_{team['id']}")
                    if st.button("Salvar", key=f"sv_{team['id']}", use_container_width=True):
                        api.put(f"/teams/{team['id']}", json={"name": nn})
                        st.session_state[f"ren_{team['id']}"] = False
                        st.session_state.teams_cache = api.get("/teams")
                        st.rerun()

        with st.container(border=True):
            st.markdown("<b style='color:#e8e8f0'>Criar Equipe</b>", unsafe_allow_html=True)
            with st.form("new_team"):
                tn = st.text_input("Nome")
                if st.form_submit_button("Criar", use_container_width=True):
                    api.post("/teams", json={"name": tn})
                    st.session_state.teams_cache = api.get("/teams")
                    st.rerun()

        if teams:
            user_tids = {tm.get("team_id") for tm in st.session_state.user.get("team_memberships", [])}
            available = [t for t in teams if t["id"] not in user_tids and t.get("owner_id") != st.session_state.user["id"]]
            if available:
                st.markdown("<h4 style='margin-top:1rem'>Entrar em Equipe</h4>", unsafe_allow_html=True)
                join_opts = {t["id"]: t["name"] for t in available}
                jid = st.selectbox("Selecione", list(join_opts.keys()), format_func=lambda x: join_opts[x], key="join_team")
                if st.button("Entrar", use_container_width=True):
                    api.post(f"/teams/{jid}/join")
                    ms = st.session_state.user.get("team_memberships", [])
                    ms.append({"team_id": jid})
                    st.session_state.user["team_memberships"] = ms
                    st.session_state.teams_cache = api.get("/teams")
                    st.rerun()

    with c2:
        st.markdown("<h3 style='margin-bottom:1rem'>Membros</h3>", unsafe_allow_html=True)
        sel = st.selectbox("Equipe", [t["id"] for t in teams], format_func=lambda x: next((t["name"] for t in teams if t["id"] == x), ""), key="mt")
        team = next((t for t in teams if t["id"] == sel), None)
        if team:
            is_owner = team.get("owner_id") == st.session_state.user["id"]
            for tm in team.get("members", []):
                u = members_map.get(tm["user_id"], {})
                role_label = "Admin" if tm.get("role") == "admin" else "Membro"
                if tm.get("user_id") == team.get("owner_id"):
                    role_label = "Proprietário"
                st.markdown(
                    f"<div style='background:#16161f;border:1px solid #2a2a3e;border-radius:10px;padding:10px 14px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between'>"
                    f"<div style='display:flex;align-items:center;gap:10px'>"
                    f"<div style='width:32px;height:32px;border-radius:50%;background:#3a3a5e;display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff;font-weight:600'>{u.get('name', '?')[0].upper()}</div>"
                    f"<div><div style='font-weight:500;color:#e8e8f0;font-size:0.9rem'>{u.get('name', '?')}</div>"
                    f"<div style='color:#8888aa;font-size:0.75rem'>{u.get('email', '')}</div></div></div>"
                    f"<span style='background:#2a2a3e;padding:2px 10px;border-radius:4px;font-size:0.75rem;color:#8888aa'>{role_label}</span>"
                    f"</div>",
                    unsafe_allow_html=True,
                )
                if is_owner and tm["user_id"] != st.session_state.user["id"]:
                    if st.button("Remover", key=f"rm_{tm['id']}", use_container_width=True):
                        api.delete(f"/members/{tm['user_id']}")
                        st.rerun()
