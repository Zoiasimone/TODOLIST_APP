import AuthHeader from './auth-header'
import http from '../config/http-common'

class UserService {

  getPublicContent() {
    return http.get('/api/tasks', { headers: AuthHeader.authHeader() })
  }

  saveImageForUser(id, data) {
    return http.put(`/api/users/${id}`, data)
  }

  get(id) {
    return http.get(`/api/users/${id}`)
  }

  getAll() {
    return http.get("/api/users")
  }

  findByUsername(username) {
    return http.get(`/api/users?username=${username}`)
  }
}

export default new UserService()