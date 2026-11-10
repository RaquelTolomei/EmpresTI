export default function LoginPage() {
  return (
    <main
      className="grid min-h-screen bg-[#080C1A] text-[#E6EAF6] xl:grid-cols-[560px_minmax(0,1fr)]"
      data-screen-label="01 Login"
    >
      <section
        aria-label="Sobre o EmpresTI"
        className="flex min-h-[420px] flex-col justify-between gap-14 bg-[linear-gradient(160deg,#001449_0%,#00102F_60%,#080C1A_100%)] px-6 py-8 md:min-h-[480px] md:px-14 md:py-14 xl:min-h-screen"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-[34px] items-center justify-center rounded-lg border border-[#25408F] bg-[#001449] text-[#8AA6EE]">
            <svg
              aria-hidden="true"
              className="size-[18px]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.6"
              />
              <path
                d="m4.5 7.7 7.5 4.2 7.5-4.2M12 12v9"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.6"
              />
            </svg>
          </span>
          <span className="text-base font-semibold tracking-[0.02em]">
            EmpresTI
          </span>
        </div>

        <div className="flex max-w-[420px] flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="max-w-[20ch] text-[34px] leading-[1.15] font-semibold tracking-[-0.01em]">
              Equipamentos para sua rotina.
            </h2>
            <p className="max-w-[38ch] text-sm leading-6 text-[#93A0C6]">
              Consulte o catálogo e acompanhe seus empréstimos em um só lugar.
            </p>
          </div>

          <div className="h-px w-20 bg-gradient-to-r from-[#3C5DBE] to-transparent" />

          <div className="flex flex-wrap gap-x-10 gap-y-5">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-semibold">3</span>
              <span className="text-xs text-[#93A0C6]">itens por pessoa</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-semibold">14 dias</span>
              <span className="text-xs text-[#93A0C6]">
                prazo de empréstimo
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-[#7C86A2]">Operações · v1</p>
      </section>

      <section
        aria-labelledby="login-heading"
        className="flex items-center justify-center px-6 py-14 md:px-14"
      >
        <div className="flex w-full max-w-[372px] flex-col gap-8">
          <header className="flex flex-col gap-2">
            <h1
              className="text-[22px] leading-tight font-semibold"
              id="login-heading"
            >
              Entrar
            </h1>
            <p className="text-[13px] leading-5 text-[#8A93B2]">
              Acesse com seu e-mail corporativo.
            </p>
          </header>

          <div className="flex flex-col gap-[18px]">
            <label className="flex flex-col gap-2 text-xs text-[#9AA3BC]">
              E-mail
              <input
                autoComplete="username"
                className="h-[42px] rounded-lg border border-[#2B3450] bg-[#0B1128] px-3 text-[13px] text-[#E6EAF6] outline-none placeholder:text-[#5E6884] focus:border-[#5B7FE0] focus:ring-1 focus:ring-[#5B7FE0]"
                name="email"
                placeholder="nome@empresa.com"
                type="email"
              />
            </label>

            <label className="flex flex-col gap-2 text-xs text-[#9AA3BC]">
              Senha
              <input
                autoComplete="current-password"
                className="h-[42px] rounded-lg border border-[#2B3450] bg-[#0B1128] px-3 text-[13px] text-[#E6EAF6] outline-none placeholder:text-[#5E6884] focus:border-[#5B7FE0] focus:ring-1 focus:ring-[#5B7FE0]"
                name="password"
                placeholder="Sua senha"
                type="password"
              />
            </label>

            <button
              className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#5B7FE0] bg-transparent px-5 text-[13px] font-semibold text-[#B4C6F6] transition-colors hover:border-[#8AA6EE] hover:text-[#EEF2FE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8AA6EE]"
              type="button"
            >
              Entrar
              <svg
                aria-hidden="true"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
              </svg>
            </button>
          </div>

          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(to right, rgba(230,234,246,0), #222C4A 48px, #222C4A calc(100% - 48px), rgba(230,234,246,0))",
            }}
          />

          <p className="text-center text-xs leading-5 text-[#5E6884]">
            Problemas para acessar? Procure a equipe de Operações.
          </p>
        </div>
      </section>
    </main>
  );
}
