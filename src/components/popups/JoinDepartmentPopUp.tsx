import { useState, useEffect } from "react";
import PopUp from "../ui/PopUp";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Form from "../ui/Form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (invitationCode: string) => Promise<void>;
  isLoading?: boolean;
};

const JoinDepartmentPopUp = ({ isOpen, onClose, onSubmit, isLoading = false }: Props) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCode("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      return setError("Mã mời là bắt buộc");
    }

    try {
      await onSubmit(code);
      onClose();
    } catch (err) { }
  };

  return (
    <PopUp
      isOpen={isOpen}
      onClose={onClose}
      title="Tham Gia Phòng Ban"
    >
      <div className="space-y-6">
        <p className="text-primary-400 text-sm">
          Nhập mã mời bạn đã nhận được để tham gia vào phòng ban.
        </p>

        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Mã mời"
              placeholder="VD: DEPT-123-ABC"
              value={code}
              onChange={(val) => {
                setCode(val);
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
              {isLoading ? "Đang tham gia..." : "Tham Gia"}
            </Button>
          </div>
        </Form>
      </div>
    </PopUp>
  );
};

export default JoinDepartmentPopUp;