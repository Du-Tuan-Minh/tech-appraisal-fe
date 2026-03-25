import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Form from "@/components/ui/Form";
import { register } from "@/services/authService";
import type { UserCreateDto } from "@/types/user";
import { Link } from "react-router-dom";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<UserCreateDto>({
        email: "",
        password: "",
        firstName: "",
        lastName: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = "Email là bắt buộc";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ";
        }

        if (!formData.password) {
            newErrors.password = "Mật khẩu là bắt buộc";
        } else if (formData.password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }

        if (!formData.firstName) newErrors.firstName = "Họ là bắt buộc";
        if (!formData.lastName) newErrors.lastName = "Tên là bắt buộc";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;
        setIsLoading(true);
        setErrors({});

        try {
            await register(formData);
            navigate("/login", {
                state: { message: "Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay." }
            });
        } catch (err) {
            setErrors({ general: "Đăng ký thất bại. Vui lòng thử lại." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof UserCreateDto, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent-green rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative z-10 w-full max-w-2xl">
                <Card className="p-8 shadow-neon-green">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-green rounded-full mb-4 shadow-dark-green">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Đăng Ký Tài Khoản
                        </h1>
                        <p className="text-primary-400 text-sm">
                            Tạo tài khoản mới để tham gia hệ thống đánh giá công nghệ
                        </p>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        {errors.general && (
                            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 mb-6">
                                <p className="text-red-400 text-sm text-center">{errors.general}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                type="text"
                                label="Họ"
                                placeholder="Nhập họ của bạn"
                                value={formData.firstName}
                                onChange={(value) => handleInputChange("firstName", value)}
                                required
                                error={errors.firstName}
                            />

                            <Input
                                type="text"
                                label="Tên"
                                placeholder="Nhập tên của bạn"
                                value={formData.lastName}
                                onChange={(value) => handleInputChange("lastName", value)}
                                required
                                error={errors.lastName}
                            />

                            <Input
                                type="email"
                                label="Email"
                                placeholder="nhập email của bạn"
                                value={formData.email}
                                onChange={(value) => handleInputChange("email", value)}
                                required
                                error={errors.email}
                            />

                            <Input
                                type="password"
                                label="Mật khẩu"
                                placeholder="nhập mật khẩu của bạn"
                                value={formData.password}
                                onChange={(value) => handleInputChange("password", value)}
                                required
                                error={errors.password}
                            />
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            disabled={isLoading}
                            className="w-full py-3 text-lg font-semibold shadow-dark-green hover:shadow-neon-green transition-all duration-300 mt-6">
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang đăng ký...
                                </span>
                            ) : (
                                "Đăng Ký"
                            )}
                        </Button>
                    </Form>

                    <div className="mt-6 text-center">
                        <p className="text-primary-400 text-sm">
                            Đã có tài khoản?{" "}
                            <Link
                                to="/login"
                                className="text-primary-600 hover:text-primary-500 font-medium transition-colors"
                            >
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default RegisterPage;