/**
 * Quản lý định danh thiết bị duy nhất của học sinh (đảm bảo 1 thiết bị chỉ làm 1 lần)
 */

export function getOrCreateDeviceId(): string {
  const STORAGE_KEY = 'quiz_device_unique_id';
  let deviceId = localStorage.getItem(STORAGE_KEY);
  
  if (!deviceId) {
    // Tạo ID thiết bị ngẫu nhiên kết hợp timestamp
    const randomPart = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    deviceId = `dev_${Date.now()}_${randomPart}`;
    localStorage.setItem(STORAGE_KEY, deviceId);
  }
  
  return deviceId;
}

export function getLocalSubmission() {
  const key = 'quiz_student_submitted_data';
  const data = localStorage.getItem(key);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveLocalSubmission(submission: any) {
  localStorage.setItem('quiz_student_submitted_data', JSON.stringify(submission));
}
