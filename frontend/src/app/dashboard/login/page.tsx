"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2, Lock } from "lucide-react";

import { login } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    try {
      const access = await login(usuario, senha);
      setToken(access);
      router.push("/dashboard");
    } catch {
      setErro("Usuário ou senha inválidos.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="card-elegant w-full max-w-sm p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image src="/images/logo.png" alt="Bellas Nail Designer" width={64} height={64} className="rounded-full" />
          <h1 className="font-display text-2xl font-bold text-ink">Painel Bellas Nail</h1>
          <p className="text-sm text-ink-soft">Acesso restrito à administração</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="usuario" className="mb-1.5 block text-sm font-medium text-ink">
              Usuário
            </label>
            <input
              id="usuario"
              type="text"
              autoComplete="username"
              required
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="senha" className="mb-1.5 block text-sm font-medium text-ink">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="input-field"
            />
          </div>

          {erro && <p className="text-sm text-brand-600">{erro}</p>}

          <button type="submit" disabled={carregando} className="btn-primary w-full disabled:opacity-60">
            {carregando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
