export interface DepartmentResponseDto {
    id: string;
    nameDepartment: string;
    codeDepartment: string;
    description: string | null;
    managerName: string | null;
    managerId: string | null;
    parentId: string | null;
    createdAt: string;
}

export interface DepartmentCreateDto {
    nameDepartment: string;
    codeDepartment: string;
    description?: string | null;
}

export interface DepartmentUpdateDto {
    nameDepartment: string;
    description?: string | null;
    parentId: string | null;
}

export interface DepartmentInvitationResponseDto {
    id: string;
    inviteeEmployeeCode: string;
    invitationCode: string;
    expiresAt: string;
    isUsed: boolean;
    departmentName: string;
    inviterName: string;
}

export interface DepartmentInvitationCreateDto {
    employeeCode: string;
}