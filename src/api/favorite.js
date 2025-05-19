import axios from "@/plugins/axios";

export function getAllFavorites() {
  return axios.get("/api/favorites");
}

export function getFavoriteById(id) {
  return axios.get(`/api/favorites/${id}`);
}

export function createFavorite({ boardId, memberId }) {
  return axios.post("/api/favorites", { boardId, memberId });
}

export function deleteFavorite(id) {
  return axios.delete(`/api/favorites/${id}`);
}
