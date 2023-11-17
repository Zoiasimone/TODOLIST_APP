import axios from 'axios'
import AuthHeader from './auth-header'
import http from '@/config/http-common'

const API_URL = 'http://localhost:8080/api/'

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'tasks', { headers: AuthHeader.authHeader() })
  }

  saveImage(id, data) {
    return http.put(`api/users/${id}`, data, { headers: AuthHeader.authHeaderImage() })
  }

}
export default new UserService()