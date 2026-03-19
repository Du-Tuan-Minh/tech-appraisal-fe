import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Form from "../../components/ui/Form";
import { login } from "../../services/authService";
import { setAuth } from "../../utils/authStorage";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await login({ email, password });
            setAuth(res.accessToken, res.refreshToken);
            navigate("/dashboard");
        } catch (err) {
            setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent-green rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <Card className="p-8 shadow-neon-green">
                    {/* Logo/Title Section */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-green rounded-full mb-4 shadow-dark-green">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Tech Appraisal
                        </h1>
                        <p className="text-primary-400 text-sm">
                            Đăng nhập vào hệ thống đánh giá công nghệ
                        </p>
                    </div>

                    {/* Login Form */}
                    <Form onSubmit={handleSubmit}>
                        <Input
                            type="email"
                            label="Email"
                            placeholder="nhập email của bạn"
                            value={email}
                            onChange={setEmail}
                            required
                            error={error && !email ? "Email là bắt buộc" : ""}
                        />

                        <Input
                            type="password"
                            label="Mật khẩu"
                            placeholder="nhập mật khẩu của bạn"
                            value={password}
                            onChange={setPassword}
                            required
                            error={error && !password ? "Mật khẩu là bắt buộc" : ""}
                        />

                        {error && (
                            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-primary-600 bg-dark-800 border-dark-600 rounded focus:ring-primary-500 focus:ring-2"
                                />
                                <span className="ml-2 text-sm text-primary-400">Ghi nhớ đăng nhập</span>
                            </label>
                            <a href="#" className="text-sm text-primary-600 hover:text-primary-500 transition-colors">
                                Quên mật khẩu?
                            </a>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            disabled={isLoading}
                            className="w-full py-3 text-lg font-semibold shadow-dark-green hover:shadow-neon-green transition-all duration-300"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang đăng nhập...
                                </span>
                            ) : (
                                "Đăng nhập"
                            )}
                        </Button>
                    </Form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-primary-400 text-sm">
                            Chưa có tài khoản?{" "}
                            <a href="#" className="text-primary-600 hover:text-primary-500 font-medium transition-colors">
                                Liên hệ quản trị viên
                            </a>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;