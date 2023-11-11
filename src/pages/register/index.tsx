import { useEffect, useContext } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { auth } from "../../services/firebaseConnection";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import { AuthContext } from "../../contexts/AuthContext";

import { toast } from "react-hot-toast/headless";

import { Container } from "../../components/container";
import { Input } from "../../components/input";

import logoImg from "../../assets/logo.svg";

const schema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  email: z
    .string()
    .email("Insira um email válido")
    .min(1, "O campo email é obrigatório"),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .min(1, "O campo senha é obrigatório"),
});

type FormData = z.infer<typeof schema>;

export function Register() {
  const { handleInfoUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }

    handleLogout();
  }, []);

  async function onSubmit(data: FormData) {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (user) => {
        await updateProfile(user.user, {
          displayName: data.name,
        });

        handleInfoUser({
          name: data.name,
          email: data.email,
          uid: user.user.uid,
        });

        toast.success("Bem-vindo ao WebCarros!");
        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        toast.error("Erro ao fazer o cadastro!");
      });
  }

  return (
    <Container>
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
        <Link to="/" className="mb-6 w-full max-w-sm">
          <img className="w-full" src={logoImg} alt="Logo do site" />
        </Link>

        <form
          className="w-full max-w-xl rounded-lg bg-white p-4 shadow-md"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="text"
              placeholder="Digite seu nome completo..."
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu email..."
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite sua senha..."
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button
            type="submit"
            className="h-10 w-full rounded-md bg-zinc-900 font-medium text-white transition-opacity hover:opacity-95"
          >
            Cadastrar
          </button>
        </form>

        <Link to="/login">Já possuí uma conta? Faça o login!</Link>
      </div>
    </Container>
  );
}
