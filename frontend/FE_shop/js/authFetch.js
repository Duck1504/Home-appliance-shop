function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  options.headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };

  return fetch(url, options);
}
