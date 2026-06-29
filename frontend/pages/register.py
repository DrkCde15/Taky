import streamlit as st
from utils import api


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
            "<h3 style='margin-top:0'>Criar Conta</h3>",
            unsafe_allow_html=True,
        )

        with st.form("register_form"):
            name = st.text_input("Nome", placeholder="Seu nome")
            email = st.text_input("E-mail", placeholder="seu@email.com")
            pwd = st.text_input("Senha", type="password", placeholder="••••••••")
            role = st.selectbox("Perfil", ["member", "admin"], format_func=lambda x: "Membro" if x == "member" else "Administrador")
            if st.form_submit_button("Cadastrar", use_container_width=True):
                if not name or not email or not pwd:
                    st.error("Preencha todos os campos")
                else:
                    try:
                        api.post("/auth/register", json={"name": name, "email": email, "password": pwd, "role": role})
                        st.success("Conta criada! Faça login.")
                        st.session_state.page = "login"
                        st.rerun()
                    except Exception:
                        pass

        st.markdown(
            "<div style='text-align:center;margin-top:1rem'>"
            "<span style='color:#8888aa'>Já tem conta? </span>"
            "</div>",
            unsafe_allow_html=True,
        )
        if st.button("Fazer Login", use_container_width=True):
            st.session_state.page = "login"
            st.rerun()

        st.markdown("</div>", unsafe_allow_html=True)
