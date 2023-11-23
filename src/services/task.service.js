import http from "../config/http-common"

class TasksDataService {
  getAll() {
    return http.get("/api/tasks")
  }

  get(id) {
    return http.get(`/api/tasks/${id}`)
  }

  create(data) {
    return http.post("/api/tasks", data)
  }

  update(id, data) {
    return http.put(`/api/tasks/${id}`, data)
  }

  delete(id) {
    return http.delete(`/api/tasks/${id}`)
  }

  deleteAll() {
    return http.delete(`/api/tasks`)
  }

  findByTitle(title) {
    return http.get(`/api/tasks?title=${title}`)
  }
}

export default new TasksDataService()