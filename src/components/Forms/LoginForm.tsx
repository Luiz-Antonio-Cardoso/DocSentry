"use client";
import React, { useState } from "react";
import Input from "../Input/Input";
import Box from "../Box/Box";
import Typography from "../Typography/Typography";
import Button from "../Buttons/Buttons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { delay } from "@/utils/delay";
import { setCookie } from "nookies";
import Link from "next/link";

export default function LoginForm() {
  const loginSchema = z.object({
    username: z.string().nonempty("Campo obrigatório"),
    password: z.string().nonempty("Campo obrigatório"),
  });

  type LoginCredentials = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const { push } = useRouter();

  const [loading, setLoading] = useState(false);

  const submitLoginForm = async ({ username, password }: LoginCredentials) => {
    setLoading(true);
    try {
      await delay(1000);

      const response = await fetch("http://localhost:3000/users");

      const result = await response.json();

      const user = result.find(
        (user: UserCredentials) => user.username === username
      );

      if (user && user.password === password) {
        setCookie(null, "user", JSON.stringify(user), {
          maxAge: 60 * 60 * 6, //6 hours
        });
        setCookie(null, "logged_in", "true")

        setLoading(false);
        push("/dashboard");
        setLoading(false);
        return user;
      } else {
        setLoading(false);
        alert("Credenciais inválidas");
      }

      setLoading(false);
      return;
    } catch (error) {
      setLoading(false);
      alert(error);
    }
  };

  return (
    <Box>
      <fieldset disabled={loading} className="grid gap-4 place-items-center">
        <Typography variant="h5" className="text-center">
          Login
        </Typography>
        <form onSubmit={handleSubmit(submitLoginForm)}>
          <div>
            <Input
              {...register("username")}
              placeholder="Usuário"
              errorMessage={errors.username?.message}
              label="Usuário"
              type="text"
              className="w-full p-2 text-black border border-gray-300 rounded"
            />
          </div>
          <div className="mb-2">
            <Input
              {...register("password")}
              placeholder="Senha"
              errorMessage={errors.password?.message}
              label="Senha"
              labelColor="black"
              type="password"
            />
          </div>
          <Button type="submit">Entrar</Button>
          <div className="flex items-center justify-center w-full mt-5">
            <Link href="/register">Cadastre-se</Link>
          </div>
        </form>
      </fieldset>
    </Box>
  );
}
