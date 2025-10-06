import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { EnvelopeIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";
import { AuthLayout } from "@/components/AuthLayout";
import { AuthCard } from "@/components/AuthCard";
import { AuthHeader } from "@/components/AuthHeader";
import { FormInput } from "@/components/FormInput";
import { FormButton } from "@/components/FormButton";
import { AlertMessage } from "@/components/AlertMessage";

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
    <>
      <Head>
        <title>Cadastro - Doclytics</title>
      </Head>
      <AuthLayout>
        <AuthCard>
          <AuthHeader subtitle="Crie sua conta" />

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              label="Nome"
              icon={<UserIcon className="h-5 w-5 text-[#88A0B0]" />}
              type="text"
              placeholder="Seu nome"
              register={register("name")}
              error={errors.name?.message}
            />

            <FormInput
              label="Email"
              icon={<EnvelopeIcon className="h-5 w-5 text-[#88A0B0]" />}
              type="email"
              placeholder="seu@email.com"
              register={register("email")}
              error={errors.email?.message}
            />

            <FormInput
              label="Senha"
              icon={<LockClosedIcon className="h-5 w-5 text-[#88A0B0]" />}
              type="password"
              placeholder="••••••••"
              register={register("password")}
              error={errors.password?.message}
            />

            {error && <AlertMessage message={error} variant="error" />}

            <FormButton isLoading={isLoading} loadingText="Criando conta...">
              Criar conta
            </FormButton>

            <p className="text-center text-sm text-[#456478] pt-2">
              Já tem uma conta?{" "}
              <Link href="/" className="font-semibold text-[#0F555A] hover:text-[#263743] transition-colors">
                Faça login
              </Link>
            </p>
          </form>
        </AuthCard>
      </AuthLayout>
    </>
  );
};

export default Register;
