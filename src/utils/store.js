export function getAccessToken() {
  return localStorage.accessToken
}

export function setAccessToken(accessToken) {
  localStorage.accessToken = accessToken
}

export function saveAuth(username, accessToken) {
  localStorage.accessToken = accessToken
  localStorage.username = username
}

export function getAuth() {
  const username = localStorage.username
  const accessToken = localStorage.accessToken
  if (username && accessToken) {
    return {
      username: localStorage.username,
      accessToken: localStorage.accessToken
    }
  } else {
    return null
  }
}
