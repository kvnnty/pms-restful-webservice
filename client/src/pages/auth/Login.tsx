import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import axiosClient from "@/config/axios.config";
import { login } from "@/store/features/auth/auth.slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, type LoginForm } from "./validation";

const Login = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setLoading(true);
    toast
      .promise(
        axiosClient.post("/auth/login", data).then((response) => {
          dispatch(login({ token: response.data.data.token, user: response.data.data.user }));
          navigate("/dashboard");
        }),
        {
          loading: "Logging in...",
          success: "Login successful!",
          error: (err) => err.response?.data?.message || err.message || "Login failed. Please try again later.",
        }
      )
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="relative z-[20] mx-auto w-full max-w-[500px] flex flex-col">
      <div className="pb-5 w-full flex flex-col items-center space-y-2">
        <Car size={40} color="#3b82f6" />
        <h1 className="font-bold text-xl text-blue-500">PMS Portal</h1>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-gray-100 w-full flex flex-col space-y-5">
        <h2 className="text-3xl font-semibold text-center mb-4">Welcome back</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <div className="space-y-1">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <Input type="email" placeholder="Enter your email" {...register("email")} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <Input type="password" placeholder="Enter your password" {...register("password")} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember-me" />
              <label htmlFor="remember-me" className="mt-0.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Remember me
              </label>
            </div>
            <p className="text-blue-500 cursor-pointer">Forgot Password?</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer flex justify-center items-center px-2 h-14 bg-blue-500 text-white rounded-xl disabled:opacity-80">
            {loading ? <Spinner /> : "Sign in"}
          </button>
        </form>
      </div>
      <p className="text-center mt-3">
        Don't have an account{" "}
        <Link to="/auth/register" className="underline">
          Sign up
        </Link>{" "}
      </p>
    </div>
  );
};

export default Login;
