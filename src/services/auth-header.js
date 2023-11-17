

class AuthHeader {

  authHeader() {
    let user = JSON.parse(localStorage.getItem('user'))

    if (user && user.accessToken) {
      return { 'x-access-token': user.accessToken }
    } else {
      return {}
    }
  }

  authHeaderImage() {
    let user = JSON.parse(localStorage.getItem('user'))

    if (user && user.accessToken) {
      return { 
        'x-access-token': user.accessToken,
        'Content-Type': 'multipart/form-data'
      }
    } else {
      return {}
    }
  }
}

export default new AuthHeader()