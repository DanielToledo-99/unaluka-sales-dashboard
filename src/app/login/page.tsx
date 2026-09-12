import Image from "next/image";
import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";

export default async function LoginPage() {
  const session = await auth();

  // Si ya inició sesión, lo mandamos directamente al dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* =========================
            LADO IZQUIERDO
        ========================== */}
        <section className="relative hidden overflow-hidden bg-[#F52D30] lg:flex lg:flex-col lg:justify-between">
          {/* Decoraciones */}
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10" />
          <div className="absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-black/10" />

          <div className="absolute left-[18%] top-[22%] h-20 w-20 rounded-full border border-white/20" />
          <div className="absolute right-[15%] top-[15%] h-32 w-32 rounded-full border border-white/10" />

          {/* Marca */}
          <div className="relative z-10 p-12">
            <div className="inline-flex rounded-2xl bg-white px-6 py-4 shadow-xl">
              <Image
                src="/logo.png"
                alt="Unaluka"
                width={190}
                height={65}
                priority
                className="h-auto w-[190px] object-contain"
              />
            </div>
          </div>

          {/* Texto */}
          <div className="relative z-10 max-w-xl px-12 pb-16">
            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              Plataforma Comercial
            </div>

            <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-white xl:text-6xl">
              Tu información comercial en un solo lugar.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-white/80">
              Gestiona productos, vendedores, usuarios y analiza el rendimiento
              comercial de Unaluka desde un dashboard centralizado.
            </p>

            <div className="mt-10 flex items-center gap-8 text-white">
              <div>
                <div className="text-2xl font-bold">100%</div>
                <div className="mt-1 text-sm text-white/70">
                  Información centralizada
                </div>
              </div>

              <div className="h-12 w-px bg-white/20" />

              <div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="mt-1 text-sm text-white/70">
                  Acceso al dashboard
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            LOGIN
        ========================== */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-16">
          <div className="w-full max-w-[460px]">
            {/* Logo móvil */}
            <div className="mb-10 flex justify-center lg:hidden">
              <Image
                src="/logo.svg"
                alt="Unaluka"
                width={190}
                height={65}
                priority
                className="h-auto w-[180px] object-contain"
              />
            </div>

            {/* Card */}
            <div className="rounded-[28px] border border-gray-200/80 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-10">
              {/* Icono */}
              <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-[#F52D30]"
                >
                  <path
                    d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M18.5 10.5V8A6.5 6.5 0 0 0 5.5 8v2.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <rect
                    x="3.5"
                    y="10"
                    width="17"
                    height="11"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#F52D30]">
                  Bienvenido
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-[#171717] sm:text-4xl">
                  Iniciar sesión
                </h2>

                <p className="mt-3 text-[15px] leading-6 text-gray-500">
                  Accede al panel comercial de Unaluka utilizando tu cuenta
                  autorizada de Google.
                </p>
              </div>

              {/* Google Login */}
              <form
                className="mt-8"
                action={async () => {
                  "use server";

                  await signIn("google", {
                    redirectTo: "/dashboard",
                  });
                }}
              >
                <button
                  type="submit"
                  className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-6 text-[15px] font-semibold text-gray-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md active:translate-y-0"
                >
                  {/* Google icon */}
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.805 10.023h-9.18v3.955h5.278c-.228 1.272-.918 2.35-1.958 3.073v2.551h3.17c1.856-1.708 2.927-4.225 2.927-7.21 0-.798-.071-1.569-.237-2.369Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12.625 22c2.646 0 4.864-.877 6.486-2.398l-3.17-2.551c-.88.59-2.004.939-3.316.939-2.553 0-4.715-1.724-5.49-4.04H3.86v2.633A9.8 9.8 0 0 0 12.625 22Z"
                      fill="#34A853"
                    />
                    <path
                      d="M7.135 13.95a5.96 5.96 0 0 1-.31-1.95c0-.678.116-1.338.31-1.95V7.417H3.86A9.998 9.998 0 0 0 2.8 12c0 1.609.384 3.133 1.06 4.583l3.275-2.633Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.625 6.01c1.44 0 2.73.496 3.747 1.468l2.81-2.81C17.484 3.086 15.266 2 12.625 2A9.8 9.8 0 0 0 3.86 7.417l3.275 2.633c.775-2.316 2.937-4.04 5.49-4.04Z"
                      fill="#EA4335"
                    />
                  </svg>

                  Continuar con Google

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="ml-auto h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1"
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>

              {/* Separador */}
              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Acceso seguro
                </span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>

              {/* Info */}
              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4 text-gray-600"
                    >
                      <path
                        d="M12 3l7 3v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6l7-3Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      <path
                        d="m9 12 2 2 4-4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Acceso restringido
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Solo los usuarios autorizados pueden acceder al dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="mt-7 text-center text-xs text-gray-400">
              © 2026 Unaluka. Todos los derechos reservados.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}