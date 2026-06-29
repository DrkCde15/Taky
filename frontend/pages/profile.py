import streamlit as st
from utils import api


def show():
    user = st.session_state.user

    ca, cb = st.columns([1, 2])

    with ca:
        avatar = user.get("avatar", "")
        if avatar:
            st.image(avatar, width=140)
        else:
            st.markdown(
                f"<div style='width:140px;height:140px;border-radius:50%;background:#3a3a5e;display:flex;align-items:center;justify-content:center;font-size:48px;color:#fff;font-weight:700'>{user.get('name', '?')[0].upper()}</div>",
                unsafe_allow_html=True,
            )
        role_label = "Administrador" if user.get("role") == "admin" else "Membro"
        st.markdown(f"<h3 style='margin-top:0.5rem'>{user.get('name', '')}</h3>", unsafe_allow_html=True)
        st.markdown(f"<span style='background:#2a2a3e;padding:2px 12px;border-radius:4px;font-size:0.8rem;color:#8888aa'>{role_label}</span>", unsafe_allow_html=True)
        st.caption(user.get("email", ""))

    with cb:
        st.markdown("<h3>Editar Perfil</h3>", unsafe_allow_html=True)
        with st.form("profile_form"):
            name = st.text_input("Nome", value=user.get("name", ""))
            email = st.text_input("E-mail", value=user.get("email", ""))
            avatar_url = st.text_input("URL do Avatar", value=user.get("avatar", ""))
            if st.form_submit_button("Salvar", use_container_width=True):
                resp = api.put("/auth/me", json={"name": name, "email": email, "avatar": avatar_url})
                st.session_state.user.update(resp)
                st.success("Perfil atualizado!")
                st.rerun()

    st.markdown("---")
    st.markdown("<h3>Equipes</h3>", unsafe_allow_html=True)
    memberships = user.get("team_memberships", [])
    if memberships:
        try:
            teams = api.get("/teams")
            team_map = {t["id"]: t["name"] for t in teams}
        except Exception:
            team_map = {}
        for tm in memberships:
            tn = team_map.get(tm["team_id"], f"#{tm['team_id']}")
            rl = "Admin" if tm.get("role") == "admin" else "Membro"
            st.markdown(
                f"<div style='background:#16161f;border:1px solid #2a2a3e;border-radius:8px;padding:8px 12px;margin-bottom:4px'>"
                f"<span style='color:#e8e8f0;font-weight:500'>{tn}</span>"
                f"<span style='background:#2a2a3e;padding:2px 8px;border-radius:4px;font-size:0.75rem;color:#8888aa;margin-left:8px'>{rl}</span>"
                f"</div>",
                unsafe_allow_html=True,
            )
    else:
        st.info("Você não está em nenhuma equipe.")
