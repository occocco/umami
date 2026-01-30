import {apiClient} from './client'

interface LoginRequest {
    email: string
    password: string
}

interface LoginResponse {
    accessToken: string
    user: {
        id: string
        name: string
        email: string
    }
}

export interface SignupFormData {
    name: string
    email: string
    password: string
}

export interface SignupResponse {
    result: string
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function signup(data: SignupFormData): Promise<SignupResponse> {
    return apiClient<SignupResponse>('/members', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}