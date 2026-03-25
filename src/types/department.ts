export interface DepartmentResponseDto {
    id: string;
    name: string;
    description: string | null;
    managerName: string | null;
}

export interface DepartmentCreateDto {
    name: string;
    description: string | null;
}

export interface DepartmentUpdateDto {
    name: string;
    description: string | null;
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