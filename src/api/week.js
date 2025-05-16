import axios from "@/plugins/axios";

export function getAllWeeks() {
  return axios.get("/api/weeks");
}

export function getWeekById(id) {
  return axios.get(`/api/weeks/${id}`);
}

export function createWeek({ weekStart, weekEnd }) {
  return axios.post("/api/weeks", { weekStart, weekEnd });
}

export function deleteWeek(id) {
  return axios.delete(`/api/weeks/${id}`);
}
