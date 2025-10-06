import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { WithAuth } from "@/components/WithAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/services/api";
import { useRouter } from "next/router";
import Head from "next/head";
import { ArrowLeftIcon, UserIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { AuthCard } from "@/components/AuthCard";
import { FormInput } from "@/components/FormInput";
import { FormButton } from "@/components/FormButton";
import { AlertMessage } from "@/components/AlertMessage";

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      await api.patch("/users/me", { name: data.name });

      updateUser({ name: data.name });

      setSuccess("Perfil atualizado com sucesso!");

      setTimeout(() => {
        router.push("/chat");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Perfil - Doclytics</title>
      </Head>
      <div className="min-h-screen bg-[#EAFBFF] py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push("/chat")}
            className="flex items-center gap-2 text-[#456478] hover:text-[#263743] font-medium mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Voltar
          </button>

          <AuthCard maxWidth="lg">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#263743]">Editar Perfil</h1>
              <p className="text-[#456478] mt-2">Atualize suas informações pessoais</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormInput
                label="Email"
                icon={<EnvelopeIcon className="h-5 w-5 text-[#88A0B0]" />}
                type="email"
                value={user?.email}
                disabled
                helperText="O email não pode ser alterado"
              />

              <FormInput
                label="Nome"
                icon={<UserIcon className="h-5 w-5 text-[#88A0B0]" />}
                type="text"
                register={register("name")}
                error={errors.name?.message}
              />

              {error && <AlertMessage message={error} variant="error" />}
              {success && <AlertMessage message={success} variant="success" />}

              <FormButton isLoading={isLoading} loadingText="Salvando...">
                Salvar alterações
              </FormButton>
            </form>
          </AuthCard>
        </div>
      </div>
    </>
  );
};

const Profile = () => {
  return (
    <WithAuth>
      <ProfilePage />
    </WithAuth>
  );
};

export default Profile;
