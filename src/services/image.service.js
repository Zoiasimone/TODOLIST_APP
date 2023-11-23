import http from '../config/http-common'

class ImageService {

  create(formData) {
    return http.post(`/api/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
  }

  update(id, data) {
    return http.put(`/api/images/${id}`, data)
  }

  getAll() {
    return http.get(`/api/images`)
  }

  get(id) {
    return http.get(`/api/images/${id}`)
  }

}

export default new ImageService()