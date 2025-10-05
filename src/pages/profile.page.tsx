import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { WithAuth } from "@/components/WithAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/services/api";
import { useRouter } from "next/router";

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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Editar Perfil</h1>
            <button
              onClick={() => router.push("/chat")}
              className="text-gray-600 hover:text-gray-900"
            >
              Voltar
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
              <p className="mt-1 text-sm text-gray-500">O email não pode ser alterado</p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                {...register("name")}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </div>
      </div>
    </div>
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
