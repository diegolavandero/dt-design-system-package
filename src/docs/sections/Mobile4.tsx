import { useEffect, useRef, useState, type ReactNode } from 'react';
import { SectionHeader } from '../ui';
import { cn } from '@/ds/lib/cn';
import { MIcon as I, LOGO_BRAND, MPhone, MStage, MWrap, MComponentCard, MRules, MSpecTable, MToast } from './mobile/kit';

/* eslint-disable @typescript-eslint/no-explicit-any */
type D = any;
const W = 300; const H = 600;
const Lbl = ({ children, req }: { children: ReactNode; req?: boolean }) => <div className="mb-[5px] text-xs font-medium leading-[normal] text-n-6">{req && '*'}{children}</div>;
const Footer = () => (
  <div className="absolute inset-x-5 bottom-3.5 text-center text-[11px] leading-normal text-n-5">
    Al usar DispatchTrack, estás de acuerdo con nuestras:<br />
    <span className="font-medium text-b-6">Términos y condiciones</span> | <span className="font-medium text-b-6">Políticas de privacidad</span>
  </div>
);
const Cta = ({ label, onClick, disabled }: { label: string; onClick?: () => void; disabled?: boolean }) => (
  <button onClick={onClick} disabled={disabled} className={cn('box-border h-11 w-full rounded-full border-0 text-[14px] font-bold leading-none text-white', disabled ? 'cursor-not-allowed bg-n-3' : 'cursor-pointer bg-b-6')}>{label}</button>
);
/** Campo estático (variantes del flujo). */
const Fld = ({ value, placeholder, border = 'border-n-3', pw, readOnly }: { value?: string; placeholder?: string; border?: string; pw?: boolean; readOnly?: boolean }) => (
  <input readOnly={readOnly} type={pw ? 'password' : 'text'} defaultValue={value} placeholder={placeholder} className={cn('box-border h-11 w-full rounded-md border bg-white text-[14px] leading-none text-n-7 outline-none', pw ? 'pl-3 pr-10' : 'px-3', border)} />
);
const Screen = ({ children, className }: { children: ReactNode; className?: string }) => <div className={cn('relative box-border bg-n-2 px-5 pt-[60px]', className)} style={{ height: H }}>{children}</div>;
const Logo = ({ h = 26, dim, mb = 40 }: { h?: number; dim?: boolean; mb?: number }) => <div className={cn('text-center', dim && 'opacity-40')} style={{ marginBottom: mb }}><img src={LOGO_BRAND} alt="DispatchTrack" style={{ height: h }} className="inline-block" /></div>;
const Overlay = ({ children }: { children: ReactNode }) => <div className="absolute inset-0 box-border flex items-center justify-center bg-[rgba(19,32,69,.5)] p-5">{children}</div>;
const AlertCard = ({ title, body, children }: { title: string; body: string; children: ReactNode }) => (
  <div className="w-full max-w-[260px] rounded-xl bg-white p-5 shadow-[0_8px_32px_rgba(19,32,69,.24)]">
    <div className="mb-2 text-[15px] font-bold leading-[normal] text-n-7">{title}</div>
    <div className="mb-3.5 text-[13px] leading-normal text-n-5">{body}</div>
    {children}
  </div>
);

/* ── Demo funcional ── */
type Modal = { title: string; body: string; btn: string; seconds: number } | null;
function LiveLogin({ creds, onReset }: { creds: D; onReset: (fn: () => void) => void }) {
  const PIN = creds.pin || '0000';
  const [user, setUser] = useState(creds.user || 'Pedro Perez'); const [pin, setPin] = useState(''); const [show, setShow] = useState(false);
  const [focus, setFocus] = useState<'' | 'user' | 'pin'>(''); const [err, setErr] = useState(false);
  const [attempts, setAttempts] = useState(0); const [tier, setTier] = useState(0);
  const [toast, setToast] = useState<{ text: string; tone: 'success' | 'error' } | null>(null);
  const [modal, setModal] = useState<Modal>(null); const [remain, setRemain] = useState(0);
  const tt = useRef<ReturnType<typeof setTimeout>>(); const cd = useRef<ReturnType<typeof setInterval>>();

  const showToast = (text: string, tone: 'success' | 'error') => { setToast({ text, tone }); if (tt.current) clearTimeout(tt.current); tt.current = setTimeout(() => setToast(null), 5000); };
  const openModal = (m: NonNullable<Modal>) => {
    setModal(m); setRemain(m.seconds); if (cd.current) clearInterval(cd.current);
    if (m.seconds > 0) cd.current = setInterval(() => setRemain((r) => { if (r <= 1) { clearInterval(cd.current); return 0; } return r - 1; }), 1000);
  };
  useEffect(() => () => { if (tt.current) clearTimeout(tt.current); if (cd.current) clearInterval(cd.current); }, []);
  useEffect(() => { onReset(() => { setAttempts(0); setTier(0); setPin(''); setErr(false); setToast(null); setModal(null); if (cd.current) clearInterval(cd.current); if (tt.current) clearTimeout(tt.current); }); }, [onReset]);

  const attempt = () => {
    if (tier >= 3) return;
    if (pin === PIN) { setAttempts(0); showToast(`Ingreso exitoso. Bienvenido, ${user || 'conductor'}.`, 'success'); return; }
    const n = attempts + 1; setAttempts(n); setErr(true);
    const inCycle = ((n - 1) % 5) + 1;
    if (inCycle < 5) { showToast(inCycle === 4 ? 'Credenciales incorrectas. Intentos 4/5. 1 falla más y serás bloqueado.' : `Credenciales incorrectas. Intentos ${inCycle}/5.`, 'error'); return; }
    const t = tier + 1; setTier(t);
    const tryIn = (m: string) => `Has excedido el número de intentos de ingreso. Por favor vuelve a intentarlo en ${m} y contacta a tu supervisor para verificar que tu PIN es correcto.`;
    if (t === 1) openModal({ title: 'Alerta de seguridad', body: tryIn('1 minuto'), btn: 'Continuar', seconds: 60 });
    else if (t === 2) openModal({ title: 'Alerta de seguridad', body: tryIn('5 minutos'), btn: 'Continuar', seconds: 300 });
    else openModal({ title: 'Alerta de seguridad', body: 'Has excedido el número de intentos de inicio de sesión. Por favor contacta a tu supervisor para saber cómo proceder.', btn: 'Entendido', seconds: 0 });
  };
  const close = () => { setModal(null); if (tier < 3) { setPin(''); setErr(false); } };
  const bd = (f: 'user' | 'pin', _v: string) => (focus === f ? 'border-2 border-b-6 bg-b-1' : err ? 'border border-r-6' : 'border border-n-3');
  const counting = !!modal && modal.seconds > 0;
  return (
    <MPhone width={W} height={H}>
      <div className="relative box-border overflow-hidden bg-n-2 px-5 pt-[60px]" style={{ height: H }}>
        <Logo />
        <div className="mb-3.5"><Lbl>Código de negocio</Lbl><input readOnly value={creds.businessCode || '1234'} className="box-border h-11 w-full rounded-md border border-n-3 bg-white px-3 text-[14px] leading-none text-n-7 outline-none" /></div>
        <div className="mb-3.5"><Lbl>Usuario</Lbl><input value={user} onChange={(e) => setUser(e.target.value)} onFocus={() => setFocus('user')} onBlur={() => { setFocus(''); setErr(false); }} placeholder="Ingresa tu usuario" className={cn('box-border h-11 w-full rounded-md px-3 text-[14px] leading-none text-n-7 outline-none', bd('user', user), focus === 'user' ? '' : 'bg-white')} /></div>
        <div className="mb-[18px]"><Lbl>PIN</Lbl>
          <div className="relative"><input type={show ? 'text' : 'password'} value={pin} onChange={(e) => setPin(e.target.value)} onFocus={() => setFocus('pin')} onBlur={() => { setFocus(''); setErr(false); }} placeholder="Ingresa tu PIN" className={cn('box-border h-11 w-full rounded-md pl-3 pr-10 text-[14px] leading-none text-n-7 outline-none', bd('pin', pin), focus === 'pin' ? '' : 'bg-white')} />
            <span onClick={() => setShow((s) => !s)} className="absolute right-2.5 top-1/2 flex -translate-y-1/2 cursor-pointer"><I n={show ? 'view--off' : 'view'} s={18} c="var(--n5)" /></span></div>
        </div>
        <Cta label="Ingresar" onClick={attempt} />
        {toast && <div className="absolute inset-x-4 bottom-20 z-[5]"><MToast text={toast.text} tone={toast.tone} close={false} /></div>}
        {modal && (
          <div className="absolute inset-0 z-10 box-border flex items-center justify-center bg-[rgba(19,32,69,.5)] p-5">
            <AlertCard title={modal.title} body={modal.body}>
              {modal.seconds > 0 ? (
                <div className="flex items-center justify-between gap-2.5">
                  <span className={cn('text-xs font-medium leading-[normal]', remain === 0 ? 'text-g-6' : 'text-n-6')}>{remain === 0 ? 'Desbloqueado' : `Desbloqueado en ${remain} segundos…`}</span>
                  <button disabled={counting && remain > 0} onClick={close} className={cn('h-9 rounded-full border-0 px-[18px] text-[13px] font-bold leading-none text-white', remain > 0 ? 'cursor-not-allowed bg-n-3' : 'cursor-pointer bg-b-6')}>{modal.btn}</button>
                </div>
              ) : <button onClick={close} className="h-10 w-full cursor-pointer rounded-full border-0 bg-b-6 text-[13px] font-bold leading-none text-white">{modal.btn}</button>}
            </AlertCard>
          </div>
        )}
        <Footer />
      </div>
    </MPhone>
  );
}

export function MScreenLogin({ data }: { data: D }) {
  const c = data.components || {}; const demo = data.demo || {}; const creds = demo.credentials || {};
  const resetRef = useRef<() => void>(() => {});
  const [key, setKey] = useState(0);
  const P = ({ children }: { children: ReactNode }) => <MPhone width={W} height={H}>{children}</MPhone>;
  const w = (label: string, node: ReactNode) => <MWrap label={label} w={320}>{node}</MWrap>;
  const fieldsStatic = (border: string, user: string, pinVal: boolean, dim?: boolean) => (
    <div className={dim ? 'opacity-40' : undefined}>
      <div className="mb-3.5"><Lbl>Código de negocio</Lbl><Fld value="1234" readOnly border="border-n-5" /></div>
      <div className="mb-3.5"><Lbl>Usuario</Lbl><Fld value={user} border={border} /></div>
      <div className="mb-[18px]"><Lbl>PIN</Lbl><Fld pw value={pinVal ? '••••' : undefined} placeholder="Ingresa tu PIN" border={pinVal ? border : 'border-n-3'} /></div>
      <Cta label="Ingresar" />
    </div>
  );
  return (
    <>
      <SectionHeader data={data} />
      <MComponentCard name="DTMLoginScreen — demo funcional" tag="NEW" specs={c.screen?.specs}
        notes={`Demo en vivo del flujo de login. PIN correcto: ${creds.pin || '0000'}. Después de 5 fallas se activa el bloqueo de 1 minuto, después de 10 el de 5 minutos, y a la falla 15 el bloqueo es permanente.`}
        preview={
          <div className="mb-3.5 flex flex-col items-center gap-3.5 rounded-lg border border-n-3 bg-n-1 p-5">
            <div className="w-full max-w-[380px] text-center text-[13px] leading-normal text-n-6">{demo.intro || 'Prueba el flujo real ingresando un PIN incorrecto repetidamente.'}</div>
            <LiveLogin key={key} creds={creds} onReset={(fn) => { resetRef.current = fn; }} />
            <button onClick={() => { resetRef.current(); setKey((k) => k + 1); }} className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-n-4 bg-white px-4 text-xs font-bold leading-none text-n-6"><I n="refresh" s={14} c="var(--n6)" /> Reiniciar demo</button>
          </div>} />
      <MComponentCard name="DTMLoginScreen — variantes estáticas" tag="NEW" specs={[]}
        notes="Galería de las 7 pantallas del flujo: paso 1, paso 1 con modal de error, paso 2 vacío, paso 2 con toast, modal de bloqueo temporal, modal permanente y usuario bloqueado por admin."
        preview={<MStage>
          {w('Paso 1 · Código de negocio', <P><Screen><Logo h={28} mb={48} /><div className="mb-3.5"><Lbl>Código de negocio</Lbl><Fld value={creds.businessCode || '1234'} /></div><Cta label="Siguiente" /><Footer /></Screen></P>)}
          {w('Paso 1 · Error de código activación', <P><Screen>
            <Logo h={28} mb={48} dim /><div className="mb-3.5 opacity-40"><Lbl>Código de negocio</Lbl><Fld value="9999" /></div><div className="opacity-40"><Cta label="Siguiente" /></div>
            <div className="absolute inset-0 box-border flex items-center justify-center bg-[rgba(19,32,69,.4)] p-5"><div className="w-full rounded-xl bg-white p-5">
              <div className="mb-2 text-[15px] font-bold leading-[normal] text-n-7">Código de activación incorrecto</div>
              <div className="mb-[18px] text-[13px] leading-normal text-n-5">Por ahora podrás ingresar a la app, pero próximamente si no ingresas tu código correcto no podrás ingresar a tu cuenta. Para obtener tu código de negocio correcto, contacta a tu agente de soporte o administrador en tu empresa.</div>
              <Cta label="Siguiente" /></div></div>
          </Screen></P>)}
          {w('Paso 2 · Login vacío', <P><Screen><Logo />
            <div className="mb-3.5"><Lbl>Código de negocio</Lbl><Fld value="1234" readOnly border="border-n-5" /></div>
            <div className="mb-3.5"><Lbl>Usuario</Lbl><Fld placeholder="Ingresa tu usuario" /></div>
            <div className="mb-[18px]"><Lbl>PIN</Lbl><Fld pw placeholder="Ingresa tu PIN" /></div><Cta label="Ingresar" /><Footer /></Screen></P>)}
          {w('Toast de error (intentos 4/5)', <P><Screen><Logo />{fieldsStatic('border-r-6', 'Pedro Perez', true)}
            <div className="absolute inset-x-4 bottom-20 z-[5]"><MToast text="Credenciales incorrectas. Intentos 4/5. 1 falla más y serás bloqueado." tone="error" /></div><Footer /></Screen></P>)}
          {w('Modal bloqueo temporal (1 min)', <P><Screen><Logo dim />{fieldsStatic('border-r-6', 'Pedro Perez', true, true)}
            <Overlay><AlertCard title="Alerta de seguridad" body="Has excedido el número de intentos de ingreso. Por favor vuelve a intentarlo en 1 minuto y contacta a tu supervisor para verificar que tu PIN es correcto.">
              <div className="flex items-center justify-between gap-2.5"><span className="text-xs font-medium leading-[normal] text-n-6">Desbloqueado en 47 segundos…</span><button disabled className="h-9 cursor-not-allowed rounded-full border-0 bg-n-3 px-[18px] text-[13px] font-bold leading-none text-white">Continuar</button></div>
            </AlertCard></Overlay></Screen></P>)}
          {w('Modal bloqueo permanente', <P><Screen><Logo dim />{fieldsStatic('border-n-5', 'Pedro Perez', true, true)}
            <Overlay><AlertCard title="Alerta de seguridad" body="Has excedido el número de intentos de inicio de sesión. Por favor contacta a tu supervisor para saber cómo proceder."><button className="h-10 w-full cursor-pointer rounded-full border-0 bg-b-6 text-[13px] font-bold leading-none text-white">Entendido</button></AlertCard></Overlay></Screen></P>)}
          {w('Usuario bloqueado por admin', <P><Screen><Logo dim />{fieldsStatic('border-n-5', 'Pedro Perez', false, true)}
            <Overlay><AlertCard title="Usuario bloqueado" body="Este usuario móvil ha sido bloqueado. Por favor contacta a tu supervisor si quieres ingresar."><button className="h-10 w-full cursor-pointer rounded-full border-0 bg-b-6 text-[13px] font-bold leading-none text-white">Cerrar</button></AlertCard></Overlay></Screen></P>)}
        </MStage>} />
      {data.bruteForceLogic?.length > 0 && <div className="mb-5 rounded-lg border border-n-3 bg-white p-5"><h3 className="m-0 mb-3 text-[15px] font-bold leading-[normal] text-n-7">Lógica de fuerza bruta</h3><MSpecTable rows={data.bruteForceLogic} /></div>}
      <MRules rules={data.rules} />
    </>
  );
}
