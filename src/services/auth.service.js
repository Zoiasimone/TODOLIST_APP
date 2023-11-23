import http from '../config/http-common'

class AuthService {
  login(user) {
    return http.post('/api/auth/signin', {
      username: user.username,
      password: user.password
    })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data))
        }
        return response.data;
      })
  }

  logout() {
    localStorage.removeItem('user')
  }

  register(user) {
    return http.post('/api/auth/signup', {
      username: user.username,
      email: user.email,
      password: user.password,
      image: user.image
    })
  }
}

export default new AuthService()