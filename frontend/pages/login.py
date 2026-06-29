import streamlit as st
import requests

API_URL = "http://localhost:8000"


def show():
    st.markdown(
        "<div style='display:flex;align-items:center;gap:12px;margin-bottom:2rem'>"
        "<img src='public/logo.png' style='width:40px;height:40px;border-radius:10px'>"
        "<span style='font-size:1.8rem;font-weight:700;color:#e8e8f0'>Taky</span>"
        "</div>",
        unsafe_allow_html=True,
    )

    ca, cb, cc = st.columns([1, 1.2, 1])
    with cb:
        st.markdown(
            "<div style='background:#16161f;border:1px solid #2a2a3e;border-radius:14px;padding:2rem'>"
            "<h3 style='margin-top:0'>Entrar</h3>",
            unsafe_allow_html=True,
        )

        with st.form("login_form"):
            email = st.text_input("E-mail", placeholder="seu@email.com")
            pwd = st.text_input("Senha", type="password", placeholder="••••••••")
            if st.form_submit_button("Entrar", use_container_width=True):
                if not email or not pwd:
                    st.error("Preencha todos os campos")
                else:
                    try:
                        r = requests.post(f"{API_URL}/auth/token", data={"username": email, "password": pwd})
                        if r.ok:
                            d = r.json()
                            st.session_state.token = d["access_token"]
                            st.session_state.refresh_token = d["refresh_token"]
                            st.session_state.user = {
                                "id": d["user"]["id"], "name": d["user"]["name"],
                                "email": d["user"]["email"], "role": d["user"]["role"],
                                "avatar": d["user"].get("avatar", ""),
                                "team_memberships": d["user"].get("team_memberships", []),
                            }
                            st.rerun()
                        else:
                            st.error(r.json().get("detail", "Erro no login"))
                    except Exception as e:
                        st.error(f"Erro de conexão: {e}")

        st.markdown(
            "<div style='text-align:center;margin-top:1rem'>"
            "<span style='color:#8888aa'>Não tem conta? </span>"
            "</div>",
            unsafe_allow_html=True,
        )
        if st.button("Cadastrar-se", use_container_width=True):
            st.session_state.page = "register"
            st.rerun()

        st.markdown("</div>", unsafe_allow_html=True)
