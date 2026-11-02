const API_BASE = import.meta.env.VITE_API_BASE || '';
export async function apiRequest(path, options={}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials:'include',
    headers:{'Content-Type':'application/json', ...(options.headers||{})},
    ...options
  });
  const data = await response.json().catch(()=>({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}
export const api = {
  login: password => apiRequest('/api/auth/login',{method:'POST',body:JSON.stringify({password})}),
  me: () => apiRequest('/api/auth/me'),
  logout: () => apiRequest('/api/auth/logout',{method:'POST'}),
  getContent: () => apiRequest('/api/content'),
  saveContent: content => apiRequest('/api/content',{method:'PUT',body:JSON.stringify(content)}),
  submitInquiry: inquiry => apiRequest('/api/inquiries',{method:'POST',body:JSON.stringify(inquiry)}),
  getInquiries: () => apiRequest('/api/inquiries'),
  updateInquiry: (id, update) => apiRequest(`/api/inquiries/${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify(update)}),
  trackEvent: event => apiRequest('/api/analytics/event',{method:'POST',body:JSON.stringify(event)}),
  getAnalytics: () => apiRequest('/api/analytics/summary')
};
