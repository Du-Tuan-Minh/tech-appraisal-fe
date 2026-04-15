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

const InviteMemberPopUp = ({
  isOpen,
  onClose,
  onSubmit,
  departmentName,
  departmentId,
  isLoading = false
}: Props) => {
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

    if (!employeeCode.trim()) {
      return setError("Mã nhân viên là bắt buộc");
    }

    try {
      await onSubmit({
        employeeCode: employeeCode.trim()
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể gửi lời mời. Vui lòng thử lại.");
    }
  };

  return (
    <PopUp
      isOpen={isOpen}
      onClose={onClose}
      title="Mời Thành Viên"
    >
      <div className="space-y-6">
        <div className="bg-primary-900/20 p-3 rounded-lg border border-primary-500/20">
          <p className="text-primary-400 text-sm">
            Đang mời tham gia:{" "}
            <span className="text-white font-semibold">{departmentName}</span>
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Mã Nhân Viên"
              type="text"
              placeholder="Ví dụ: VTS_123456"
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
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              type="button"
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isLoading}
            >
              Gửi Lời Mời
            </Button>
          </div>
        </Form>
      </div>
    </PopUp>
  );
};

export default InviteMemberPopUp;