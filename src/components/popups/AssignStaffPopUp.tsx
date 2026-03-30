import { useState } from "react";
import PopUp from "../ui/PopUp";
import Button from "../ui/Button";
import Input from "../ui/Input";
import type { UserResponseDto } from "@/types/user";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    users: UserResponseDto[];
    selectedIds: string[];
    onConfirm: (ids: string[]) => void;
    isLoading?: boolean;
}

const AssignStaffPopUp = ({ isOpen, onClose, users, selectedIds, onConfirm, isLoading }: Props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [tempSelected, setTempSelected] = useState<string[]>(selectedIds);

    // Lọc nhân viên theo tên hoặc email
    const filteredUsers = users.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleUser = (id: string) => {
        setTempSelected(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    return (
        <PopUp isOpen={isOpen} onClose={onClose} title="Phân Công Thẩm Định Viên">
            <div className="space-y-4">
                <Input
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                />

                <div className="max-h-80 overflow-y-auto border border-dark-700 rounded-lg divide-y divide-dark-800 bg-dark-900/50 custom-scrollbar">
                    {filteredUsers.length === 0 ? (
                        <p className="p-8 text-center text-gray-500 italic">Không tìm thấy nhân viên phù hợp.</p>
                    ) : (
                        filteredUsers.map(user => (
                            <div
                                key={user.id}
                                className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${tempSelected.includes(user.id) ? 'bg-primary-500/10' : 'hover:bg-dark-800'}`}
                                onClick={() => toggleUser(user.id)}
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-white">{user.firstName} {user.lastName}</span>
                                    <span className="text-xs text-gray-500">{user.email}</span>
                                </div>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${tempSelected.includes(user.id) ? 'bg-primary-500 border-primary-500' : 'border-dark-600'}`}>
                                    {tempSelected.includes(user.id) && <span className="text-white text-xs">✓</span>}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-dark-800">
                    <span className="text-xs text-primary-400 font-bold uppercase">
                        Đã chọn: {tempSelected.length} người
                    </span>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClose} type="button">Hủy</Button>
                        <Button
                            variant="primary"
                            onClick={() => onConfirm(tempSelected)}
                            disabled={tempSelected.length === 0}
                            isLoading={isLoading}
                        >
                            Xác nhận phân công
                        </Button>
                    </div>
                </div>
            </div>
        </PopUp>
    );
};

export default AssignStaffPopUp;