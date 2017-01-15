export function getAccessToken() {
  return localStorage.accessToken
}

export function setAccessToken(accessToken) {
  localStorage.accessToken = accessToken
}
