import api from './api'

export const createComplaint = async (payload) => {
  const response = await api.post('/api/complaints', payload)
  return response.data
}

export const getComplaints = async (params) => {
  const response = await api.get('/api/complaints', { params })
  return response.data
}

export const getComplaintById = async (id) => {
  const response = await api.get(`/api/complaints/${id}`)
  return response.data
}

export const searchComplaintsByLocation = async (location) => {
  const response = await api.get('/api/complaints/search', {
    params: { location },
  })
  return response.data
}

export const updateComplaintStatus = async (id, status) => {
  const response = await api.put(`/api/complaints/${id}`, { status })
  return response.data
}

export const deleteComplaint = async (id) => {
  const response = await api.delete(`/api/complaints/${id}`)
  return response.data
}
