import axios from "@/plugins/axios";

export function getAllMissions() {
  return axios.get("/api/missions");
}

export function getMissionsByPlaceId(placeId) {
  return axios.get(`/api/missions/place/${placeId}`);
}

export function getMissionById(id) {
  return axios.get(`/api/missions/${id}`);
}

export function createMission(payload) {
  // payload: { placeId, memberId, title, description, type, score, referenceUrl, status }
  return axios.post("/api/missions", payload);
}

export function deleteMission(id) {
  return axios.delete(`/api/missions/${id}`);
}

export function getMissionStatusByPlace(memberId) {
  return axios.get(`/api/missions/place-status/${memberId}`);
}
