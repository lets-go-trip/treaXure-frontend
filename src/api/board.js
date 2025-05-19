import axios from "@/plugins/axios";

export function getAllBoards() {
  return axios.get("/api/boards");
}

export function getBoardById(id) {
  return axios.get(`/api/boards/${id}`);
}

export function createBoard({ missionId, imageUrl, title }) {
  return axios.post("/api/boards", { missionId, imageUrl, title });
}

export function deleteBoard(id) {
  return axios.delete(`/api/boards/${id}`);
}
