import requests
import streamlit as st

API_URL = "http://localhost:8000"


def get_headers():
    headers = {"Content-Type": "application/json"}
    if "token" in st.session_state:
        headers["Authorization"] = f"Bearer {st.session_state.token}"
    return headers


def _request(method, path, **kwargs):
    if "headers" not in kwargs:
        kwargs["headers"] = get_headers()
    url = f"{API_URL}{path}"
    response = requests.request(method, url, **kwargs)

    if response.status_code == 401 and "refresh_token" in st.session_state:
        try:
            refresh_resp = requests.post(
                f"{API_URL}/auth/refresh",
                json={"refresh_token": st.session_state.refresh_token},
            )
            if refresh_resp.ok:
                data = refresh_resp.json()
                st.session_state.token = data["access_token"]
                st.session_state.refresh_token = data["refresh_token"]
                kwargs["headers"]["Authorization"] = f"Bearer {data['access_token']}"
                response = requests.request(method, url, **kwargs)
            else:
                for key in ["user", "token", "refresh_token"]:
                    st.session_state.pop(key, None)
                st.rerun()
        except Exception:
            for key in ["user", "token", "refresh_token"]:
                st.session_state.pop(key, None)
            st.rerun()

    if not response.ok:
        try:
            detail = response.json().get("detail", "Erro desconhecido")
        except Exception:
            detail = f"Erro {response.status_code}"
        if isinstance(detail, list):
            detail = "; ".join(d.get("msg", str(d)) for d in detail)
        st.error(detail)
        raise Exception(detail)

    return response.json() if response.content else {}


def get(path, params=None):
    return _request("GET", path, params=params)


def post(path, json=None):
    return _request("POST", path, json=json)


def put(path, json=None):
    return _request("PUT", path, json=json)


def patch(path, json=None):
    return _request("PATCH", path, json=json)


def delete(path):
    return _request("DELETE", path)


def upload(path, file):
    url = f"{API_URL}{path}"
    headers = {"Authorization": f"Bearer {st.session_state.token}"}
    response = requests.post(url, files={"file": file}, headers=headers)
    if not response.ok:
        detail = response.json().get("detail", "Erro no upload")
        st.error(detail)
        raise Exception(detail)
    return response.json()
