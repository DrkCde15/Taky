import streamlit as st
import os

_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_LOGO_PATH = os.path.join(_THIS_DIR, "public", "logo.png")

st.set_page_config(page_title="Taky", page_icon=":clipboard:", layout="wide")

from pages.login import show as show_login
from pages.register import show as show_register
from pages.kanban import show as show_kanban
from pages.calendar_view import show as show_calendar
from pages.teams import show as show_teams
from pages.admin import show as show_admin
from pages.profile import show as show_profile


st.markdown("""
<style>
    .stApp { background: #0f0f16; }
    .block-container { padding-top: 0 !important; max-width: 100% !important; padding-left: 2rem !important; padding-right: 2rem !important; }
    h1, h2, h3 { color: #e8e8f0 !important; font-weight: 600 !important; }
    .st-bb, .st-dg, .st-br, .st-e1 { border-color: #2a2a3e !important; }
    div[data-testid="stForm"] { background: #16161f; border: 1px solid #2a2a3e; border-radius: 12px; padding: 1.5rem; }
    div[data-testid="stMetric"] { background: #16161f; border: 1px solid #2a2a3e; border-radius: 10px; padding: 1rem; }
    div[data-testid="stMetric"] label { color: #8888aa !important; font-size: 0.8rem !important; }
    div[data-testid="stMetric"] div { color: #e8e8f0 !important; font-size: 1.5rem !important; }
    div.stTabs [data-baseweb="tab-list"] { background: #16161f; border-radius: 10px; padding: 4px; gap: 2px; border: 1px solid #2a2a3e; }
    div.stTabs [data-baseweb="tab"] { border-radius: 8px; color: #8888aa; font-size: 0.9rem; padding: 8px 20px; }
    div.stTabs [aria-selected="true"] { background: #3a3a5e !important; color: #fff !important; }
    div.stTabs [data-baseweb="tab-highlight"] { display: none; }
    textarea, input:not([type="file"]) { background: #16161f !important; color: #e8e8f0 !important; border: 1px solid #2a2a3e !important; border-radius: 8px !important; }
    textarea:focus, input:focus { border-color: #5a5a8e !important; box-shadow: 0 0 0 2px #3a3a5e44 !important; }
    div[data-testid="stTextInput"] label, div[data-testid="stTextArea"] label, div[data-testid="stSelectbox"] label, div[data-testid="stDateInput"] label, div[data-testid="stNumberInput"] label { color: #8888aa !important; font-size: 0.8rem !important; }
    .st-bx { background: #16161f; border: 1px solid #2a2a3e; border-radius: 10px; padding: 1rem; }
    hr { border-color: #2a2a3e !important; margin: 1rem 0 !important; }
    section[data-testid="stSidebar"] { display: none; }
    .st-emotion-cache-1wrcr25, div[data-testid="stToolbar"], footer, #MainMenu { display: none !important; }
    div[data-testid="stAlert"] { background: #16161f !important; border: 1px solid #2a2a3e !important; border-radius: 10px !important; color: #e8e8f0 !important; }
    .stAlert > div { color: #e8e8f0 !important; }
    div.stButton > button { border-radius: 8px !important; font-weight: 500 !important; font-size: 0.85rem !important; transition: all 0.15s !important; }
    div.stButton > button[kind="primary"] { background: #3a3a5e !important; color: #fff !important; border: none !important; }
    div.stButton > button[kind="primary"]:hover { background: #4a4a7e !important; }
    div.stButton > button[kind="secondary"] { background: transparent !important; color: #8888aa !important; border: 1px solid #2a2a3e !important; }
    div.stButton > button[kind="secondary"]:hover { background: #1a1a2a !important; color: #e8e8f0 !important; border-color: #3a3a5e !important; }
    div.stSelectbox > div { background: #16161f !important; border: 1px solid #2a2a3e !important; border-radius: 8px !important; color: #e8e8f0 !important; }
    div.stSelectbox > div:hover { border-color: #3a3a5e !important; }
    .st-cx { color: #a0a0c0 !important; }
    .st-bw { background: #16161f !important; border: 1px solid #2a2a3e !important; border-radius: 10px !important; }
    .st-bv { border-color: #2a2a3e !important; }
    .row-widget.stButton { margin: 0 !important; }
</style>
""", unsafe_allow_html=True)


def logout():
    for key in ["user", "token", "refresh_token", "page"]:
        st.session_state.pop(key, None)
    st.rerun()


if "token" not in st.session_state:
    page = st.session_state.get("page", "login")
    if page == "register":
        show_register()
    else:
        show_login()
else:
    user = st.session_state.user

    nav_options = [
        ("kanban", "Kanban"),
        ("calendar", "Calendário"),
        ("teams", "Equipes"),
    ]
    if user.get("role") in ("admin", "owner"):
        nav_options.append(("admin", "Admin"))
    nav_options.append(("profile", "Perfil"))

    current = st.session_state.get("current_page", "kanban")

    bar_cols = st.columns([0.3] + [1] * len(nav_options) + [2, 0.6, 0.5])

    with bar_cols[0]:
        st.markdown("<img src='public/logo.png' style='width:32px;height:32px;border-radius:6px'>", unsafe_allow_html=True)

    for i, (key, label) in enumerate(nav_options):
        with bar_cols[i + 1]:
            kind = "primary" if current == key else "secondary"
            if st.button(label, key=f"nav_{key}", use_container_width=True, type=kind):
                st.session_state.current_page = key
                st.rerun()

    with bar_cols[-3]:
        st.markdown(
            f"<span style='color:#8888aa;font-size:0.85rem'>{user.get('name', '')}</span>",
            unsafe_allow_html=True,
        )

    with bar_cols[-2]:
        avatar = user.get("avatar", "")
        if avatar:
            st.image(avatar, width=28)
        else:
            st.markdown(
                f"<div style='width:28px;height:28px;border-radius:50%;background:#3a3a5e;display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff'>{user.get('name', '?')[0].upper()}</div>",
                unsafe_allow_html=True,
            )

    with bar_cols[-1]:
        if st.button("Sair", use_container_width=True, key="logout_btn"):
            logout()

    st.markdown("<hr style='margin:0.3rem 0 1.5rem 0'>", unsafe_allow_html=True)

    page_map = {
        "kanban": show_kanban,
        "calendar": show_calendar,
        "teams": show_teams,
        "admin": show_admin,
        "profile": show_profile,
    }
    page_map[current]()
