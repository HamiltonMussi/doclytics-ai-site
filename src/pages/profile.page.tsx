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

        <div className="bg-white rounded-2xl shadow-2xl border border-[#88A0B0]/20 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#263743]">Editar Perfil</h1>
            <p className="text-[#456478] mt-2">Atualize suas informações pessoais</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#263743] mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-[#88A0B0]" />
                </div>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="block w-full pl-10 pr-4 py-3 border-2 border-[#88A0B0]/30 rounded-xl bg-[#88A0B0]/10 text-[#88A0B0] cursor-not-allowed"
                />
              </div>
              <p className="mt-2 text-sm text-[#88A0B0]">O email não pode ser alterado</p>
            </div>

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
                  className="block w-full pl-10 pr-4 py-3 border-2 border-[#88A0B0]/40 rounded-xl focus:outline-none focus:border-[#0F555A] transition-colors text-[#263743]"
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.name.message}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-2 border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm font-medium">
                {success}
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
                  Salvando...
                </>
              ) : (
                "Salvar alterações"
              )}
            </button>
          </form>
        </div>
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
