export interface DepartmentResponseDto {
    id: string;
    name: string;
    description?: string;
    managerName?: string;
}

export interface DepartmentCreateDto {
    name: string;
    description?: string;
}

export interface DepartmentUpdateDto {
    name: string;
    description?: string;
}

export interface DepartmentInvitationResponseDto {
    id: string;
    email: string;
    invitationCode: string;
    expiryDate: string;
    isUsed: boolean;
    departmentName: string;
    inviterName: string;
}

export interface DepartmentInvitationCreateDto {
    email: string;
}