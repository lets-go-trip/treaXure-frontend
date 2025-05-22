import axios from "@/plugins/axios";

export function getAllMembers() {
  return axios.get("/api/members");
}

export function getMemberById(id) {
  return axios.get(`/api/members/${id}`);
}

export function createMember({ email, password, nickname }) {
  return axios.post("/api/members", { email, password, nickname });
}

export function deleteMember(id) {
  return axios.delete(`/api/members/${id}`);
}
