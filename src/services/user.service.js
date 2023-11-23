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

}

export default new UserService()