import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Form from "../ui/Form";
import PopUp from "../ui/PopUp";
import type { DepartmentCreateDto } from "../../types/department";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DepartmentCreateDto) => Promise<void>;
  isLoading?: boolean;
};

const CreateDepartmentPopUp = ({ isOpen, onClose, onSubmit, isLoading = false }: Props) => {
  // Khởi tạo form đúng với DTO: ParentCode
  const initialForm: DepartmentCreateDto = {
    nameDepartment: "",
    codeDepartment: "",
    description: "",
  };

  const [formData, setFormData] = useState<DepartmentCreateDto>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form khi đóng/mở popup
  useEffect(() => {
    if (isOpen) {
      setFormData(initialForm);
      setErrors({});
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.nameDepartment.trim()) {
      newErrors.nameDepartment = "Tên phòng ban là bắt buộc";
    }
    if (!formData.codeDepartment.trim()) {
      newErrors.codeDepartment = "Mã phòng ban là bắt buộc";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const submitData = {
        ...formData
      };

      await onSubmit(submitData);
      onClose();
    } catch (err) { }
  };

  const handleInputChange = (field: keyof DepartmentCreateDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <PopUp isOpen={isOpen} onClose={onClose} title="Tạo Phòng Ban Mới">
      <Form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Tên phòng ban"
            placeholder="Ví dụ: Trung tâm Kỹ thuật"
            value={formData.nameDepartment}
            onChange={(v) => handleInputChange("nameDepartment", v)}
            error={errors.nameDepartment}
            required
          />

          <Input
            label="Mã phòng ban"
            placeholder="Ví dụ: TTKT_01"
            value={formData.codeDepartment}
            onChange={(v) => handleInputChange("codeDepartment", v)}
            error={errors.codeDepartment}
            required
          />

          <Input
            label="Mô tả"
            placeholder="Nhập mô tả ngắn gọn..."
            value={formData.description ?? ""}
            onChange={(v) => handleInputChange("description", v)}
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="ghost" onClick={onClose} type="button" disabled={isLoading}>
            Hủy
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={isLoading}
          >
            Tạo Phòng Ban
          </Button>
        </div>
      </Form>
    </PopUp>
  );
};

export default CreateDepartmentPopUp;