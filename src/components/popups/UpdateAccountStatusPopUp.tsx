import { useState, useEffect } from "react";
import PopUp from "@/components/ui/PopUp";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";

interface UpdateAccountStatusPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { isActive: boolean; reason?: string }) => Promise<void>;
  currentStatus: boolean;
  userName: string;
  isLoading?: boolean;
}

const UpdateAccountStatusPopUp = ({
  isOpen,
  onClose,
  onSubmit,
  currentStatus,
  userName,
  isLoading = false
}: UpdateAccountStatusPopUpProps) => {
  const [formData, setFormData] = useState({
    isActive: !currentStatus,
    reason: ""
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        isActive: !currentStatus,
        reason: ""
      });
    }
  }, [isOpen, currentStatus]);

  const isDeactivating = !formData.isActive;

  return (
    <PopUp
      isOpen={isOpen}
      onClose={onClose}
      title={formData.isActive ? "Kích Hoạt Tài Khoản" : "Vô Hiệu Hóa Tài Khoản"}
    >
      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}
        className="space-y-6"
      >
        <div className="p-4 bg-dark-800/50 border border-dark-700 rounded-lg">
          <p className="text-gray-300">
            Bạn đang chuẩn bị {formData.isActive ? "mở lại quyền truy cập" : "chặn truy cập"} cho:
            <br />
            <span className="font-bold text-primary-400 text-lg">{userName}</span>
          </p>
        </div>

        <FormField label="Trạng thái sẽ thay đổi thành">
          <div className={`font-bold ${formData.isActive ? "text-green-400" : "text-red-400"}`}>
            {formData.isActive ? "● Đang hoạt động" : "○ Đã vô hiệu hóa"}
          </div>
        </FormField>

        {isDeactivating && (
          <FormField label="Lý do vô hiệu hóa" required>
            <textarea
              className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
              rows={4}
              placeholder="Vui lòng nhập lý do (vi phạm chính sách, yêu cầu cá nhân...)"
              value={formData.reason}
              onChange={(e) => setFormData(p => ({ ...p, reason: e.target.value }))}
              required
            />
          </FormField>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-dark-800">
          <Button variant="ghost" onClick={onClose} type="button" disabled={isLoading}>
            Hủy
          </Button>
          <Button
            variant={formData.isActive ? "primary" : "outline"}
            type="submit"
            isLoading={isLoading}
            className={isDeactivating ? "border-red-500 text-red-500 hover:bg-red-500/10" : "shadow-neon-green"}
          >
            {formData.isActive ? "Xác nhận kích hoạt" : "Xác nhận vô hiệu hóa"}
          </Button>
        </div>
      </form>
    </PopUp>
  );
};

export default UpdateAccountStatusPopUp;