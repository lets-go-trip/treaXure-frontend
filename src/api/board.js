import axios from "@/plugins/axios";

export function getAllBoards() {
  return axios.get("/api/boards");
}

export function getBoardById(id) {
  return axios.get(`/api/boards/${id}`);
}

export function getMyBoards() {
  return axios.get("/api/boards/my");
}

export function getMyBoardByMissionId(missionId) {
  return axios.get(`/api/boards/my/${missionId}`);
}

export function getRankingBoards(days = 7) {
  return axios.get(`/api/boards/ranking?days=${days}`);
}

export function createBoard({ missionId, imageUrl, title, memberId }) {
  return axios.post("/api/boards", {
    missionId,
    imageUrl,
    title,
    memberId,
  });
}

export function deleteBoard(id) {
  return axios.delete(`/api/boards/${id}`);
}
