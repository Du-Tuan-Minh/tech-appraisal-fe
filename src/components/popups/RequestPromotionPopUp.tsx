import { useState, useEffect, useMemo } from "react";
import PopUp from "@/components/ui/PopUp";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import FormField from "@/components/ui/FormField";
import { UserRole, USER_ROLE_MAP } from "@/constants/enum/UserRole";
import { getEnumMapValue } from "@/utils/enumHelper";

interface RequestPromotionPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { currentRole: UserRole; requestedRole: UserRole; reason: string }) => void;
  currentRole: UserRole;
  isLoading: boolean;
}

const RequestPromotionPopUp = ({ isOpen, onClose, onSubmit, currentRole, isLoading }: RequestPromotionPopUpProps) => {
  const currentRoleInfo = getEnumMapValue(USER_ROLE_MAP, UserRole, currentRole);

  const roleOptions = useMemo(() => {
    return Object.entries(USER_ROLE_MAP).map(([value, info]) => ({
      value: String(value),
      label: info.label,
    }));
  }, []);

  const [formData, setFormData] = useState({
    currentRole: currentRole,
    requestedRole: (roleOptions[0] ? Number(roleOptions[0].value) : currentRole) as UserRole,
    reason: "",
  });

  useEffect(() => {
    if (isOpen) {
      const defaultRole = roleOptions[0] ? Number(roleOptions[0].value) : currentRole;
      setFormData({
        currentRole: currentRole,
        requestedRole: defaultRole as UserRole,
        reason: "",
      });
    }
  }, [isOpen, currentRole, roleOptions]);

  return (
    <PopUp isOpen={isOpen} onClose={onClose} title="Yêu Cầu Thăng Cấp">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}
        className="space-y-4"
      >
        <FormField label="Vai trò hiện tại">
          <div className="px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-gray-400 font-medium">
            {currentRoleInfo?.label || "Không xác định"}
          </div>
        </FormField>

        <Select
          label="Vai trò mong muốn"
          value={formData.requestedRole.toString()}
          onChange={(v) =>
            setFormData((p) => ({
              ...p,
              requestedRole: Number(v) as UserRole,
            }))
          }
          options={roleOptions}
        />

        <FormField label="Lý do" required>
          <textarea
            className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500/20 outline-none resize-none"
            rows={4}
            placeholder="Nhập lý do chi tiết..."
            value={formData.reason}
            onChange={(e) => setFormData((p) => ({ ...p, reason: e.target.value }))}
            required
          />
        </FormField>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="ghost" onClick={onClose} type="button">
            Hủy
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            Gửi yêu cầu
          </Button>
        </div>
      </form>
    </PopUp>
  );
};

export default RequestPromotionPopUp;