import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { AuthLayout } from "@/components/AuthLayout";
import { AuthCard } from "@/components/AuthCard";
import { AuthHeader } from "@/components/AuthHeader";
import { FormInput } from "@/components/FormInput";
import { FormButton } from "@/components/FormButton";
import { AlertMessage } from "@/components/AlertMessage";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Home = () => {
  const { signIn } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError("");
      await signIn(data.email, data.password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Doclytics</title>
      </Head>
      <AuthLayout
        showHero
        heroTitle={
          <>
            Transforme seus documentos em
            <span className="block text-[#0F555A] mt-2">conhecimento</span>
          </>
        }
        heroSubtitle={
          <>
            Análise inteligente de documentos com IA.
            <span className="block mt-2">Pergunte, aprenda e descubra.</span>
          </>
        }
      >
        <AuthCard>
          <AuthHeader subtitle="Entre na sua conta" />

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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

            <FormButton isLoading={isLoading} loadingText="Entrando...">
              Entrar
            </FormButton>

            <p className="text-center text-sm text-[#456478] pt-2">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#0F555A] hover:text-[#263743] transition-colors"
              >
                Cadastre-se
              </Link>
            </p>
          </form>
        </AuthCard>
      </AuthLayout>
    </>
  );
};

export default Home;
