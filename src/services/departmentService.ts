// import type { 
//     DepartmentResponseDto, 
//     DepartmentCreateDto, 
//     DepartmentUpdateDto,
//     DepartmentInvitationResponseDto,
//     DepartmentInvitationCreateDto 
// } from "../types/department";

// const API_BASE = "/api/departments";

// export const departmentService = {
//     getDepartments: async (page: number = 1, limit: number = 10) => {
//         const response = await fetch(`${API_BASE}?page=${page}&limit=${limit}`);
//         if (!response.ok) throw new Error("Failed to fetch departments");
//         return response.json();
//     },

//     // Create department
//     createDepartment: async (data: DepartmentCreateDto): Promise<DepartmentResponseDto> => {
//         const response = await fetch(API_BASE, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(data)
//         });
//         if (!response.ok) throw new Error("Failed to create department");
//         return response.json();
//     },

//     // Update department
//     updateDepartment: async (id: string, data: DepartmentUpdateDto): Promise<DepartmentResponseDto> => {
//         const response = await fetch(`${API_BASE}/${id}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(data)
//         });
//         if (!response.ok) throw new Error("Failed to update department");
//         return response.json();
//     },

//     // Delete department
//     deleteDepartment: async (id: string): Promise<void> => {
//         const response = await fetch(`${API_BASE}/${id}`, {
//             method: "DELETE"
//         });
//         if (!response.ok) throw new Error("Failed to delete department");
//     },

//     // Get department invitations
//     getInvitations: async (departmentId: string): Promise<DepartmentInvitationResponseDto[]> => {
//         const response = await fetch(`${API_BASE}/${departmentId}/invitations`);
//         if (!response.ok) throw new Error("Failed to fetch invitations");
//         return response.json();
//     },

//     // Create invitation
//     createInvitation: async (departmentId: string, data: DepartmentInvitationCreateDto): Promise<DepartmentInvitationResponseDto> => {
//         const response = await fetch(`${API_BASE}/${departmentId}/invitations`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(data)
//         });
//         if (!response.ok) throw new Error("Failed to create invitation");
//         return response.json();
//     },

//     // Join department by invitation code
//     joinDepartment: async (invitationCode: string): Promise<void> => {
//         const response = await fetch(`${API_BASE}/join/${invitationCode}`, {
//             method: "POST"
//         });
//         if (!response.ok) throw new Error("Failed to join department");
//     }
// };


import axiosClient from "@/services/axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type {
    DepartmentResponseDto,
    DepartmentCreateDto,
    DepartmentUpdateDto,
    DepartmentInvitationResponseDto,
    DepartmentInvitationCreateDto
} from "../types/department";
import type { PagedResult } from "../types/paginationResult";

export const departmentService = {
    getDepartments: async (page: number = 1, pageSize: number = 10, searchTerm?: string): Promise<PagedResult<DepartmentResponseDto>> => {
        const response = await axiosClient.get(
            API_ENDPOINTS.departments.getAll({ page, pageSize }, searchTerm)
        );
        return response.data;
    },

    createDepartment: async (data: DepartmentCreateDto): Promise<DepartmentResponseDto> => {
        const response = await axiosClient.post(API_ENDPOINTS.departments.create, data);
        return response.data;
    },

    updateDepartment: async (id: string, data: DepartmentUpdateDto): Promise<DepartmentResponseDto> => {
        const response = await axiosClient.put(API_ENDPOINTS.departments.update(id), data);
        return response.data;
    },

    deleteDepartment: async (id: string): Promise<void> => {
        await axiosClient.delete(API_ENDPOINTS.departments.delete(id));
    },

    createInvitation: async (data: DepartmentInvitationCreateDto): Promise<DepartmentInvitationResponseDto> => {
        const response = await axiosClient.post(API_ENDPOINTS.departments.invite, data);
        return response.data;
    },

    joinDepartment: async (invitationCode: string): Promise<void> => {
        await axiosClient.post(API_ENDPOINTS.departments.join, { invitationCode });
    }
};