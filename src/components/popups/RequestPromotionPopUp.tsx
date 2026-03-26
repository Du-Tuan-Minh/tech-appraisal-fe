import { useState, useEffect } from "react";
import PopUp from "@/components/ui/PopUp";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import FormField from "@/components/ui/FormField";
import { UserRole, USER_ROLE_LABELS } from "@/constants/enum/UserRole";

interface RequestPromotionPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { currentRole: UserRole; requestedRole: UserRole; reason: string }) => void;
  currentRole: UserRole;
  isLoading: boolean;
}

const RequestPromotionPopUp = ({ isOpen, onClose, onSubmit, currentRole, isLoading }: RequestPromotionPopUpProps) => {
  const roleOptions = Object.entries(USER_ROLE_LABELS).map(([value, label]) => ({
    value,
    label
  }));

  const [formData, setFormData] = useState({
    currentRole: currentRole,
    requestedRole: (currentRole + 1) as UserRole,
    reason: ""
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      currentRole: currentRole,
      requestedRole: (currentRole + 1) as UserRole,
      reason: ""
    }));
  }, [currentRole]);

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
          <div className="px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-gray-400">
            {USER_ROLE_LABELS[currentRole]}
          </div>
        </FormField>

        <Select
          label="Vai trò mong muốn"
          value={formData.requestedRole.toString()}
          onChange={(v) => setFormData(p => ({
            ...p,
            requestedRole: Number(v) as UserRole
          }))}
          options={roleOptions.filter(r => Number(r.value) > currentRole)}
        />

        <FormField label="Lý do" required>
          <textarea
            className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500/20 outline-none"
            rows={4}
            value={formData.reason}
            onChange={(e) => setFormData(p => ({ ...p, reason: e.target.value }))}
            required
          />
        </FormField>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="ghost" onClick={onClose} type="button">Hủy</Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>Gửi yêu cầu</Button>
        </div>
      </form>
    </PopUp>
  );
};

export default RequestPromotionPopUp;