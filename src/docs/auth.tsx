import { createContext, useContext, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { cn } from '@/ds/lib/cn';

/**
 * Login con Supabase — mismo proyecto y mismas cuentas que el sitio original.
 * La URL y la clave `publishable` son públicas por diseño (la seguridad la dan las políticas RLS de Supabase),
 * pero se pueden sobreescribir con VITE_SUPABASE_URL / VITE_SUPABASE_ANON.
 */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://REMOVED.supabase.co';
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON ?? 'REMOVED';
const ALLOWED_DOMAIN = 'dispatchtrack.com';

let client: SupabaseClient | null = null;
const sb = () => (client ??= createClient(SUPABASE_URL, SUPABASE_ANON));

interface AuthCtx { email: string; online: number | null; signOut: () => void }
const Ctx = createContext<AuthCtx>({ email: '', online: null, signOut: () => undefined });
export const useAuth = () => useContext(Ctx);

/** Protege `children`: sin sesión muestra el login; con sesión expone email, "online" (presence realtime) y signOut. */
export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [online, setOnline] = useState<number | null>(null);

  useEffect(() => {
    const c = sb();
    c.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = c.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const uid = session?.user.id;
  const mail = session?.user.email ?? '';
  useEffect(() => {
    if (!uid) return;
    const c = sb();
    const ch = c.channel('ds-online', { config: { presence: { key: uid } } });
    ch.on('presence', { event: 'sync' }, () => setOnline(Object.keys(ch.presenceState()).length))
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') await ch.track({ user_id: uid, name: mail.split('@')[0], at: new Date().toISOString() });
      });
    return () => { void c.removeChannel(ch); };
  }, [uid, mail]);

  const value = useMemo<AuthCtx>(() => ({ email: mail, online, signOut: () => { void sb().auth.signOut(); } }), [mail, online]);

  if (session === undefined) return <div className="min-h-screen bg-n-2" />;
  if (!session) return <Login />;
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* ───────────── Login ───────────── */
type Msg = { text: string; kind: 'error' | 'info' } | null;
const FIELD = 'h-10 w-full rounded-md border-[1.5px] border-n-3 bg-white px-3 text-[14px] leading-[normal] text-n-7 outline-none transition-colors placeholder:text-[#A0ABBB] focus:border-b-5 focus:shadow-[0_0_0_3px_rgba(75,130,250,.15)]';
const LBL = 'mb-1.5 block text-xs font-medium leading-none text-n-7';
const Message = ({ m }: { m: Msg }) => m ? <div className={cn('mb-3.5 rounded-md px-3.5 py-2.5 text-[13px] leading-[1.4]', m.kind === 'error' ? 'bg-[#FFEBE6] text-r-6' : 'bg-[#EDF5FF] text-b-7')}>{m.text}</div> : null;
function Submit({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <button type="submit" disabled={loading} className="mt-1.5 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border-0 bg-b-6 text-[14px] font-semibold text-white transition-colors hover:bg-b-7 disabled:cursor-default disabled:opacity-55">
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : children}
    </button>
  );
}

function Login() {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [msg, setMsg] = useState<Msg>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const swap = (t: 'signin' | 'register') => { setTab(t); setMsg(null); setDone(''); };

  const signIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setMsg(null);
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email') ?? '').trim(), password = String(f.get('password') ?? '');
    if (!email || !password) return setMsg({ text: 'Please fill in all fields.', kind: 'error' });
    setLoading(true);
    const { error } = await sb().auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setMsg({ text: error.message, kind: 'error' });
  };
  const register = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setMsg(null);
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email') ?? '').trim().toLowerCase(), password = String(f.get('password') ?? ''), confirm = String(f.get('confirm') ?? '');
    if (!email.endsWith('@' + ALLOWED_DOMAIN)) return setMsg({ text: `Only @${ALLOWED_DOMAIN} email addresses can register.`, kind: 'error' });
    if (password.length < 8) return setMsg({ text: 'Password must be at least 8 characters.', kind: 'error' });
    if (password !== confirm) return setMsg({ text: 'Passwords do not match.', kind: 'error' });
    setLoading(true);
    const { error } = await sb().auth.signUp({ email, password });
    setLoading(false);
    if (error) return setMsg({ text: error.message, kind: 'error' });
    setDone(email);
  };

  const hint = regEmail.includes('@') ? (regEmail.includes('@' + ALLOWED_DOMAIN) ? { ok: true, t: '✓ Valid DispatchTrack email' } : { ok: false, t: `✗ Only @${ALLOWED_DOMAIN} emails are allowed` }) : null;

  return (
    <div className="docs-root flex min-h-screen flex-col bg-n-2 font-doc text-n-7">
      <div className="flex h-[52px] shrink-0 items-center bg-indigo px-6">
        <img src={`${import.meta.env.BASE_URL}sections/assets/logos/dt-wordmark-white.svg`} alt="DispatchTrack" style={{ height: 18 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-[400px] rounded-xl border border-n-3 bg-white px-9 pb-8 pt-9 shadow-[0_4px_24px_rgba(19,32,69,.07)]">
          <div className="mb-7 flex flex-col items-center gap-2.5">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="8" fill="#132045" /><path d="M10 12h10a6 6 0 0 1 0 12H10V12z" fill="#4B82FA" /><path d="M16 18h4a2 2 0 0 1 0 4h-4v-4z" fill="#fff" /></svg>
            <span className="text-[11px] font-bold uppercase leading-none tracking-[.08em] text-n-5">Design System</span>
          </div>
          <div className="mb-6 flex gap-[3px] rounded-lg border-[1.5px] border-n-3 p-[3px]">
            {([['signin', 'Sign in'], ['register', 'Create account']] as const).map(([k, l]) => (
              <button key={k} type="button" onClick={() => swap(k)} className={cn('h-8 flex-1 cursor-pointer rounded-[5px] border-0 text-[13px] font-semibold transition-all', tab === k ? 'bg-indigo text-white' : 'bg-transparent text-n-5 hover:bg-n-1 hover:text-n-7')}>{l}</button>
            ))}
          </div>

          {tab === 'signin' && (
            <div>
              <p className="mb-1 text-center text-xl font-bold leading-[1.2]">Welcome back</p>
              <p className="mb-[22px] text-center text-[13px] leading-normal text-n-5">Internal access — DispatchTrack team</p>
              <Message m={msg} />
              <form onSubmit={signIn} noValidate>
                <div className="mb-3.5"><label htmlFor="si-email" className={LBL}>Email</label><input id="si-email" name="email" type="email" placeholder="you@dispatchtrack.com" autoComplete="email" className={FIELD} /></div>
                <div className="mb-3.5"><label htmlFor="si-password" className={LBL}>Password</label><input id="si-password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" className={FIELD} /></div>
                <Submit loading={loading}>Sign in</Submit>
              </form>
            </div>
          )}

          {tab === 'register' && done && (
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#E3FCEF]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00875A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
              <p className="text-center text-base font-bold">Check your inbox</p>
              <p className="text-center text-[13px] leading-normal text-n-5">We sent a confirmation link to<br /><strong className="text-n-7">{done}</strong></p>
              <p className="mt-1 text-center text-xs text-n-5">Click the link to activate your account, then sign in.</p>
              <button type="button" onClick={() => swap('signin')} className="mt-2 h-10 w-full cursor-pointer rounded-md border-0 bg-b-6 text-[14px] font-semibold text-white hover:bg-b-7">Back to sign in</button>
            </div>
          )}

          {tab === 'register' && !done && (
            <div>
              <p className="mb-1 text-center text-xl font-bold leading-[1.2]">Create account</p>
              <p className="mb-[22px] text-center text-[13px] leading-normal text-n-5">Only <strong>@{ALLOWED_DOMAIN}</strong> emails allowed</p>
              <Message m={msg} />
              <form onSubmit={register} noValidate>
                <div className="mb-3.5">
                  <label htmlFor="reg-email" className={LBL}>Work email</label>
                  <input id="reg-email" name="email" type="email" placeholder="you@dispatchtrack.com" autoComplete="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value.trim())} className={cn(FIELD, hint && !hint.ok && '!border-r-6')} />
                  {hint && <div className={cn('mt-1 text-[11px]', hint.ok ? 'text-g-6' : 'text-r-6')}>{hint.t}</div>}
                </div>
                <div className="mb-3.5"><label htmlFor="reg-password" className={LBL}>Password</label><input id="reg-password" name="password" type="password" placeholder="Min. 8 characters" autoComplete="new-password" minLength={8} className={FIELD} /></div>
                <div className="mb-3.5"><label htmlFor="reg-confirm" className={LBL}>Confirm password</label><input id="reg-confirm" name="confirm" type="password" placeholder="Repeat password" autoComplete="new-password" className={FIELD} /></div>
                <Submit loading={loading}>Create account</Submit>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
