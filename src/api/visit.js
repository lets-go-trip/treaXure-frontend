import axios from "@/plugins/axios";

/**
 * 장소 방문 기록 저장 (최초 방문 시 등록, 재방문 시 visitCount 증가)
 * @param {number} memberId - 방문한 사용자 ID
 * @param {number} placeId - 방문한 장소 ID
 * @returns {Promise<VisitResponseDto>}
 */
export function recordVisit(memberId, placeId) {
  return axios.post(`/api/visits/${memberId}/${placeId}`);
}

/**
 * 특정 장소의 모든 방문 기록 조회
 * @param {number} placeId - 조회할 장소 ID
 * @returns {Promise<ApiResponseDto<VisitResponseDto[]>>}
 */
export function getVisitsByPlace(placeId) {
  return axios.get(`/api/visits/place/${placeId}`);
}

/**
 * 특정 사용자의 모든 방문 기록 조회
 * @param {number} memberId - 조회할 사용자 ID
 * @returns {Promise<ApiResponseDto<VisitResponseDto[]>>}
 */
export function getVisitsByMember(memberId) {
  return axios.get(`/api/visits/member/${memberId}`);
}
