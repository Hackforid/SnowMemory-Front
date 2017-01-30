import SHA256 from 'js-sha256'

export function passwordHash(password) {
  return SHA256.sha256(password + 'tcfyNXf3Swg7erXPvBBYWWwCTuxDLP0NQYoN')
}
