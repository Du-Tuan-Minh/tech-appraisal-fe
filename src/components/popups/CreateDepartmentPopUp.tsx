import { useState } from "react";
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
  const [formData, setFormData] = useState<DepartmentCreateDto>({
    name: "",
    description: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Tên phòng ban là bắt buộc";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({ name: "", description: "" });
      setErrors({});
      onClose();
    } catch (err) { }
  };

  const handleInputChange = (field: keyof DepartmentCreateDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <PopUp isOpen={isOpen} onClose={onClose} title="Tạo Phòng Ban Mới">
      <Form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Tên phòng ban"
            value={formData.name}
            onChange={(v) => handleInputChange("name", v)}
            error={errors.name}
            required
          />
          <Input
            label="Mô tả"
            value={formData.description}
            onChange={(v) => handleInputChange("description", v)}
          />
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>Hủy</Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Đang tạo..." : "Tạo Phòng Ban"}
          </Button>
        </div>
      </Form>
    </PopUp>
  );
};

export default CreateDepartmentPopUp;
