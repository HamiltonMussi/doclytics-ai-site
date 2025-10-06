import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import Link from "next/link";
import { SparklesIcon, EnvelopeIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const { signUp } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError("");
      await signUp(data.name, data.email, data.password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAFBFF] px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl border border-[#88A0B0]/20 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#B1EC04]/20 rounded-full mb-4">
              <SparklesIcon className="w-8 h-8 text-[#0F555A]" />
            </div>
            <h2 className="text-3xl font-bold text-[#263743]">Doclytics</h2>
            <p className="mt-2 text-sm text-[#456478]">Crie sua conta</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#263743] mb-2">
                Nome
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-[#88A0B0]" />
                </div>
                <input
                  {...register("name")}
                  type="text"
                  className="block w-full pl-10 pr-4 py-3 border-2 border-[#88A0B0]/40 rounded-xl focus:outline-none focus:border-[#0F555A] transition-colors text-[#263743] placeholder:text-[#88A0B0]"
                  placeholder="Seu nome"
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#263743] mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-[#88A0B0]" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  className="block w-full pl-10 pr-4 py-3 border-2 border-[#88A0B0]/40 rounded-xl focus:outline-none focus:border-[#0F555A] transition-colors text-[#263743] placeholder:text-[#88A0B0]"
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#263743] mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-[#88A0B0]" />
                </div>
                <input
                  {...register("password")}
                  type="password"
                  className="block w-full pl-10 pr-4 py-3 border-2 border-[#88A0B0]/40 rounded-xl focus:outline-none focus:border-[#0F555A] transition-colors text-[#263743] placeholder:text-[#88A0B0]"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-[#263743] bg-[#B1EC04] hover:bg-[#9dd604] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F555A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-[#263743] border-t-transparent rounded-full"></div>
                  Criando conta...
                </>
              ) : (
                "Criar conta"
              )}
            </button>

            <p className="text-center text-sm text-[#456478] pt-2">
              Já tem uma conta?{" "}
              <Link href="/" className="font-semibold text-[#0F555A] hover:text-[#263743] transition-colors">
                Faça login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
