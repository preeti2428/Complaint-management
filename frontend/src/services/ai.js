import api from './api'

export const analyzeComplaint = async (payload) => {
  const response = await api.post('/api/ai/analyze', payload)
  return response.data
}

export const assistUser = async (payload) => {
  const response = await api.post('/api/ai/assist', payload)
  return response.data
}

export const triageComplaints = async (payload) => {
  const response = await api.post('/api/ai/triage', payload)
  return response.data
}
