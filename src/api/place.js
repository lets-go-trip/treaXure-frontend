import axios from "@/plugins/axios";

export function getAllPlaces() {
  return axios.get("/api/places");
}

export function getPlaceById(id) {
  return axios.get(`/api/places/${id}`);
}

export function createPlace(
  payload /* { name, category, description, address, latitude, longitude, thumbnailUrl } */
) {
  return axios.post("/api/places", payload);
}

export function deletePlace(id) {
  return axios.delete(`/api/places/${id}`);
}
