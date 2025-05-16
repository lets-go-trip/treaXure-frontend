import axios from "@/plugins/axios";

export function getAllVotes() {
  return axios.get("/api/votes");
}

export function getVoteById(id) {
  return axios.get(`/api/votes/${id}`);
}

export function createVote({ weekId, memberId, boardId, field }) {
  return axios.post("/api/votes", { weekId, memberId, boardId, field });
}

export function deleteVote(id) {
  return axios.delete(`/api/votes/${id}`);
}
