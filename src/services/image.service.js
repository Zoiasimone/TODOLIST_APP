import http from '../config/http-common'

class ImageService {

  createImage(formData) {
    return http.post(`/api/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
  }

  updateImage(userId, formData) {
    return http.put(`/api/images?userId=${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })

  }

  getAll() {
    return http.get(`/api/images`, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }

  findImageByUserId(userId) {
    return http.get(`/api/images?userId=${userId}`, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }
}

export default new ImageService()