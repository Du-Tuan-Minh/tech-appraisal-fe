import { useState, useEffect } from "react";
import PopUp from "../ui/PopUp";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Form from "../ui/Form";
import type { DepartmentInvitationCreateDto } from "../../types/department";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DepartmentInvitationCreateDto) => Promise<void>;
  departmentName: string;
  departmentId: string;
  isLoading?: boolean;
};

const InviteMemberPopUp = ({ isOpen, onClose, onSubmit, departmentName, departmentId, isLoading = false }: Props) => {
  const [employeeCode, setEmployeeCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setEmployeeCode("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeCode.trim()) return setError("mã nhân viên là bắt buộc");

    try {
      await onSubmit({ departmentId, employeeCode });
      onClose();
    } catch (err) { }
  };

  return (
    <PopUp
      isOpen={isOpen}
      onClose={onClose}
      title="Mời Thành Viên"
    >
      <div className="space-y-6">
        <p className="text-primary-400 text-sm">
          Mời thành viên tham gia phòng ban:{" "}
          <span className="text-white font-medium">{departmentName}</span>
        </p>

        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Mã Nhân Viên"
              type="text"
              placeholder="Nhập mã nhân viên"
              value={employeeCode}
              onChange={(val) => {
                setEmployeeCode(val);
                if (error) setError("");
              }}
              error={error}
              required
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Đang gửi..." : "Gửi Lời Mời"}
            </Button>
          </div>
        </Form>
      </div>
    </PopUp>
  );
};

export default InviteMemberPopUp;