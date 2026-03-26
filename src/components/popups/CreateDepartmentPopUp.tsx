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
  const [formData, setFormData] = useState<DepartmentCreateDto>({ name: "", description: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrors({ name: "Tên phòng ban là bắt buộc" });
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
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

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
            value={formData.description ?? ""}
            onChange={(v) => handleInputChange("description", v)}
          />
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="ghost" onClick={onClose} type="button">Hủy</Button>
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
