/* D1D: every illustration is built from React SVG components.
   Animations use SVG SMIL (<animate>, <animateMotion>, <animateTransform>),
   which runs the same in Chrome, Edge, Firefox and Safari on desktop, iOS and Android. */

/* ---------- palettes ---------- */
const GL = '#8C9CC4';                    // ghost line ("today" sketch)
const GF = '#0B0E18';                    // ghost fill (opaque so overlaps stay clean)
const GFT = 'rgba(140,160,215,0.06)';    // see-through fill (piggy bank)
const GIN = '#07090F';                   // inner stroke for ghost limbs
const PAPER = {fill: '#2A3142', stroke: '#D9E2F7', strokeWidth: 2.2}; // mask & card in sketch
const RED = '#FF4D5E';
const TEAL = '#2EE6C5';
const GOLD = '#FFC94A';
const GREEN = '#34D399';

const P = (g, c, extra) => (g ? {fill: GF, stroke: GL, strokeWidth: 2.2} : Object.assign({fill: c}, extra || {}));

/* ---------- animation helpers (SMIL) ---------- */
// Slides its children from (x,y) by (dx,dy), fading in and out.
const Mover = ({x = 0, y = 0, dx = 0, dy = 0, dur = 2.6, delay = 0, children}) => (
  <g transform={`translate(${x} ${y})`}>
    <g opacity="0">
      <animateMotion path={`M0 0 L${dx} ${dy}`} dur={dur + 's'} begin={delay + 's'} repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.85;1" dur={dur + 's'} begin={delay + 's'} repeatCount="indefinite"/>
      {children}
    </g>
  </g>
);

// Travels along any SVG path (absolute coordinates).
const PathMover = ({path, dur = 3, delay = 0, children}) => (
  <g opacity="0">
    <animateMotion path={path} dur={dur + 's'} begin={delay + 's'} repeatCount="indefinite" rotate="0"/>
    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.9;1" dur={dur + 's'} begin={delay + 's'} repeatCount="indefinite"/>
    {children}
  </g>
);

const Bob = ({dy = -4, dur = 1, children}) => (
  <g>
    <animateTransform attributeName="transform" type="translate" values={`0 0;0 ${dy};0 0`} dur={dur + 's'} repeatCount="indefinite"/>
    {children}
  </g>
);

/* ---------- small objects ---------- */
const Coin = ({x = 0, y = 0, r = 12, g}) => {
  const line = g ? GL : '#E0A21C';
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={g ? GF : GOLD} stroke={line} strokeWidth="2"/>
      <circle r={r * 0.55} fill="none" stroke={line} strokeWidth="1.5"/>
    </g>
  );
};

const CoinStack = ({x, y, n = 3, g}) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({length: n}, (_, i) => (
      <ellipse key={i} cx="0" cy={-i * 8} rx="19" ry="7.5" fill={g ? GF : GOLD} stroke={g ? GL : '#E0A21C'} strokeWidth="2"/>
    ))}
  </g>
);

const Note = ({x = 0, y = 0, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-20" y="-11" width="40" height="22" rx="3" fill="#3FCF7D" stroke="#1E9A55" strokeWidth="2"/>
    <circle r="5.5" fill="#A5F3C4" stroke="#1E9A55" strokeWidth="1.5"/>
    <circle cx="-13" r="1.8" fill="#1E9A55"/><circle cx="13" r="1.8" fill="#1E9A55"/>
  </g>
);

const NoteStack = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Note x={-3} y={6}/><Note x={2} y={2}/><Note x={0} y={-3}/>
  </g>
);

// Torn bill / penalty notice with a red stamp
const Notice = ({x = 0, y = 0, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-22 -28 H22 V18 L15 24 L8 17 L1 25 L-6 17 L-13 24 L-22 18 Z" fill="#2A0D14" stroke={RED} strokeWidth="2.4" strokeLinejoin="round"/>
    <path d="M-14 -18 H14 M-14 -10 H6" stroke="#FF8A96" strokeWidth="2.4" strokeLinecap="round"/>
    <circle cx="2" cy="6" r="9" fill="none" stroke={RED} strokeWidth="2.6"/>
    <path d="M-4 12 L8 0" stroke={RED} strokeWidth="2.6" strokeLinecap="round"/>
  </g>
);

const Crate = ({x = 0, y = 0, s = 1, g}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {!g && <g><circle cx="-15" cy="-10" r="9" fill="#86D84A"/><circle cx="2" cy="-13" r="9" fill="#F2C94C"/><circle cx="17" cy="-9" r="8" fill="#86D84A"/></g>}
    <rect x="-28" y="-4" width="56" height="30" rx="4" {...P(g, '#C7843F')} stroke={g ? GL : '#8C5420'} strokeWidth="2"/>
    <path d="M-28 10 H28" stroke={g ? GL : '#8C5420'} strokeWidth="2"/>
  </g>
);

// Thick arrow. dir: 'r' | 'l' | 'both'
const Arrow = ({x1, x2, y, dir = 'r', color = TEAL, w = 9, glow = true}) => {
  const h = 15, len = 24;
  const a = dir !== 'r' ? x1 + len - 2 : x1;
  const b = dir !== 'l' ? x2 - len + 2 : x2;
  return (
    <g filter={glow ? 'url(#soft)' : undefined}>
      <line x1={a} x2={b} y1={y} y2={y} stroke={color} strokeWidth={w}/>
      {dir !== 'l' && <polygon points={`${x2},${y} ${x2 - len},${y - h} ${x2 - len},${y + h}`} fill={color}/>}
      {dir !== 'r' && <polygon points={`${x1},${y} ${x1 + len},${y - h} ${x1 + len},${y + h}`} fill={color}/>}
    </g>
  );
};

const Limb = ({g, d, w = 14, c}) => (g
  ? <g fill="none" strokeLinecap="round" strokeLinejoin="round"><path d={d} stroke={GL} strokeWidth={w + 4.4}/><path d={d} stroke={GIN} strokeWidth={w}/></g>
  : <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"/>);

/* ---------- human ---------- */
// Origin = centre between the feet. ~275 units tall at s = 1.
const Human = ({x, y, s = 1, g, mood = 'happy', pose = 'rest', look = 0, top = '#3D6CF2', hair = '#2B2342', apron, hideLegs}) => {
  const skin = '#F2B48C', pants = '#1E2A5C';
  const ink = g ? GL : '#1B1530';
  let arms = null;
  if (pose === 'hold') {
    arms = (
      <g>
        <Notice x={0} y={-182} s={1.05} rot={-6}/>
        <Limb g={g} c={top} d="M-36 -200 Q-54 -166 -16 -160"/>
        <Limb g={g} c={top} d="M36 -200 Q54 -166 16 -160"/>
        <circle cx="-15" cy="-161" r="8.5" {...P(g, skin)}/><circle cx="15" cy="-161" r="8.5" {...P(g, skin)}/>
      </g>
    );
  } else if (pose === 'notes') {
    arms = (
      <g>
        <Limb g={g} c={top} d="M-36 -200 Q-50 -162 -44 -124"/>
        <circle cx="-44" cy="-121" r="8.5" {...P(g, skin)}/>
        <Limb g={g} c={top} d="M36 -200 Q58 -168 30 -150"/>
        <NoteStack x={38} y={-166} s={1.05}/>
        <circle cx="29" cy="-150" r="8.5" {...P(g, skin)}/>
      </g>
    );
  } else if (pose === 'give') {
    arms = (
      <g>
        <Limb g={g} c={top} d="M-36 -200 Q-50 -162 -44 -124"/>
        <circle cx="-44" cy="-121" r="8.5" {...P(g, skin)}/>
        <Limb g={g} c={top} d="M36 -200 Q64 -206 66 -236"/>
        <Coin x={68} y={-252} r={11} g={g}/>
        <circle cx="66" cy="-238" r="8.5" {...P(g, skin)}/>
      </g>
    );
  } else if (pose === 'counter') {
    arms = (
      <g>
        <Limb g={g} c={top} d="M-36 -200 Q-52 -170 -34 -150"/>
        <Limb g={g} c={top} d="M36 -200 Q52 -170 34 -150"/>
        <circle cx="-33" cy="-149" r="8.5" {...P(g, skin)}/><circle cx="33" cy="-149" r="8.5" {...P(g, skin)}/>
      </g>
    );
  } else {
    arms = (
      <g>
        <Limb g={g} c={top} d="M-36 -200 Q-50 -162 -44 -124"/>
        <Limb g={g} c={top} d="M36 -200 Q50 -162 44 -124"/>
        <circle cx="-44" cy="-121" r="8.5" {...P(g, skin)}/><circle cx="44" cy="-121" r="8.5" {...P(g, skin)}/>
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {!hideLegs && (
        <g>
          <rect x="-25" y="-124" width="21" height="118" rx="10" {...P(g, pants)}/>
          <rect x="4" y="-124" width="21" height="118" rx="10" {...P(g, pants)}/>
          <ellipse cx="-17" cy="-6" rx="15" ry="6.5" {...P(g, '#121734')}/>
          <ellipse cx="17" cy="-6" rx="15" ry="6.5" {...P(g, '#121734')}/>
        </g>
      )}
      <rect x="-8" y="-226" width="16" height="22" rx="5" {...P(g, '#DD9A70')}/>
      <path d="M-40 -186 Q-40 -211 -18 -213 L18 -213 Q40 -211 40 -186 L34 -114 Q0 -106 -34 -114 Z" {...P(g, top)}/>
      <path d="M-11 -213 Q0 -203 11 -213" fill="none" stroke={g ? GL : 'rgba(255,255,255,0.35)'} strokeWidth="2.4" strokeLinecap="round"/>
      {apron && <path d="M-22 -196 H22 L26 -112 Q0 -106 -26 -112 Z" {...P(g, '#E8ECF5')}/>}
      <circle cx="-27" cy="-245" r="5.5" {...P(g, skin)}/><circle cx="27" cy="-245" r="5.5" {...P(g, skin)}/>
      <circle cx="0" cy="-246" r="27" {...P(g, skin)}/>
      <path d="M-28 -244 Q-31 -281 3 -280 Q32 -279 29 -248 Q23 -264 6 -262 Q-10 -260 -17 -268 Q-21 -254 -28 -244Z" {...P(g, hair)}/>
      <g fill={ink}>
        <circle cx={-9 + look} cy="-245" r="2.8"/><circle cx={9 + look} cy="-245" r="2.8"/>
      </g>
      <g fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round">
        {mood === 'worried' && <path d="M-15 -253 L-5 -257 M15 -253 L5 -257"/>}
        {mood === 'worried' && <path d="M-7 -229 Q0 -235 7 -229"/>}
        {mood === 'happy' && <path d="M-9 -234 Q0 -226 9 -234"/>}
        {mood === 'neutral' && <path d={`M${-6 + look} -232 H${6 + look}`}/>}
      </g>
      {mood === 'worried' && <path d="M30 -268 q5 8 0 11 q-5 -3 0 -11Z" fill={g ? 'rgba(160,190,255,0.35)' : '#9CC9FF'} stroke={g ? GL : 'none'} strokeWidth="1.5"/>}
      {mood === 'happy' && !g && <g fill="#F28C8C" opacity="0.45"><circle cx="-15" cy="-236" r="4"/><circle cx="15" cy="-236" r="4"/></g>}
      {arms}
    </g>
  );
};

/* ---------- robot (front view) ---------- */
// Origin = centre between the feet. Shoulders at (±46, -146).
const Robot = ({x, y, s = 1, g, body = '#E9EFF8', shade = '#AEBFD9', accent = TEAL, armL, armR, handL, handR, shakeL, shakeR, lanyard, holdL, holdR, hideLegs}) => {
  const aL = armL || 'M-46 -146 Q-60 -110 -52 -82';
  const aR = armR || 'M46 -146 Q60 -110 52 -82';
  const hL = handL || [-52, -80];
  const hR = handR || [52, -80];
  const hand = (p, shake, hold, k) => {
    const el = <g key={k}>{hold}<circle cx={p[0]} cy={p[1]} r="9.5" {...P(g, body)} stroke={g ? GL : shade} strokeWidth="2"/></g>;
    return shake ? <Bob key={k} dy={-4} dur={0.9}>{el}</Bob> : el;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {!hideLegs && (
        <g>
          <rect x="-28" y="-72" width="19" height="62" rx="9" {...P(g, shade)}/>
          <rect x="9" y="-72" width="19" height="62" rx="9" {...P(g, shade)}/>
          <rect x="-34" y="-16" width="28" height="13" rx="6.5" {...P(g, body)}/>
          <rect x="6" y="-16" width="28" height="13" rx="6.5" {...P(g, body)}/>
        </g>
      )}
      <Limb g={g} c={shade} d={aL}/>
      <Limb g={g} c={shade} d={aR}/>
      <rect x="-9" y="-178" width="18" height="18" rx="4" {...P(g, shade)}/>
      <rect x="-46" y="-164" width="92" height="100" rx="28" {...P(g, body)}/>
      {!g && <rect x="-30" y="-150" width="60" height="6" rx="3" fill="rgba(255,255,255,0.7)"/>}
      {lanyard && (
        <g>
          <path d="M-16 -164 L0 -132 L16 -164" fill="none" stroke={accent} strokeWidth="4"/>
          <IDCard x={0} y={-108} s={0.24}/>
        </g>
      )}
      <line x1="0" y1="-246" x2="0" y2="-262" stroke={g ? GL : shade} strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="0" cy="-265" r="6" fill={g ? GF : accent} stroke={g ? GL : 'none'} strokeWidth="2"/>
      <rect x="-55" y="-226" width="12" height="30" rx="6" {...P(g, accent)}/>
      <rect x="43" y="-226" width="12" height="30" rx="6" {...P(g, accent)}/>
      <rect x="-47" y="-248" width="94" height="74" rx="32" {...P(g, body)}/>
      <rect x="-36" y="-236" width="72" height="48" rx="21" fill={g ? GIN : '#0A1222'} stroke={g ? GL : 'none'} strokeWidth="2"/>
      <g fill={g ? GL : accent}>
        <rect x="-21" y="-222" width="12" height="17" rx="6">
          <animate attributeName="height" values="17;17;3;17" keyTimes="0;0.9;0.95;1" dur="5s" repeatCount="indefinite"/>
          <animate attributeName="y" values="-222;-222;-215;-222" keyTimes="0;0.9;0.95;1" dur="5s" repeatCount="indefinite"/>
        </rect>
        <rect x="9" y="-222" width="12" height="17" rx="6">
          <animate attributeName="height" values="17;17;3;17" keyTimes="0;0.9;0.95;1" dur="5s" repeatCount="indefinite"/>
          <animate attributeName="y" values="-222;-222;-215;-222" keyTimes="0;0.9;0.95;1" dur="5s" repeatCount="indefinite"/>
        </rect>
      </g>
      <path d="M-8 -197 Q0 -192 8 -197" fill="none" stroke={g ? GL : accent} strokeWidth="2.5" strokeLinecap="round"/>
      {hand(hL, shakeL, holdL, 'l')}
      {hand(hR, shakeR, holdR, 'r')}
    </g>
  );
};

// Just the robot's face, used as a logo / portrait
const RobotFace = ({x = 0, y = 0, s = 1, accent = TEAL, body = '#E9EFF8'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-55" y="-17" width="12" height="30" rx="6" fill={accent}/>
    <rect x="43" y="-17" width="12" height="30" rx="6" fill={accent}/>
    <rect x="-47" y="-37" width="94" height="74" rx="32" fill={body}/>
    <rect x="-36" y="-25" width="72" height="48" rx="21" fill="#0A1222"/>
    <rect x="-21" y="-11" width="12" height="17" rx="6" fill={accent}/>
    <rect x="9" y="-11" width="12" height="17" rx="6" fill={accent}/>
    <path d="M-8 14 Q0 19 8 14" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round"/>
  </g>
);

/* ---------- robot (profile, facing right) wearing the user's face ---------- */
const MaskedRobot = ({x, y, s = 1, g = true}) => {
  const ink = '#D9E2F7';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* legs */}
      <rect x="-20" y="-72" width="19" height="62" rx="9" {...P(g, '#AEBFD9')}/>
      <rect x="2" y="-72" width="19" height="62" rx="9" {...P(g, '#AEBFD9')}/>
      <rect x="-20" y="-16" width="30" height="13" rx="6.5" {...P(g, '#E9EFF8')}/>
      <rect x="2" y="-16" width="30" height="13" rx="6.5" {...P(g, '#E9EFF8')}/>
      {/* rear arm reaching back for coins (drawn behind body) */}
      <Limb g={g} c="#AEBFD9" d="M-18 -146 Q-70 -120 -104 -26"/>
      <path d="M-116 -30 Q-104 -12 -90 -26" {...P(g, '#E9EFF8')}/>
      {/* torso */}
      <rect x="-9" y="-178" width="18" height="18" rx="4" {...P(g, '#AEBFD9')}/>
      <rect x="-34" y="-164" width="70" height="100" rx="26" {...P(g, '#E9EFF8')}/>
      {/* the user's credit card, tucked in the chest pocket */}
      <g>
        <g transform="rotate(-10 18 -116)">
          <rect x="1" y="-134" width="34" height="24" rx="3" fill="#323A4E" stroke="#E6ECFA" strokeWidth="2"/>
          <circle cx="10" cy="-124" r="4.5" fill="#4A5470" stroke={ink} strokeWidth="1.5"/>
          <path d="M5.5 -125 Q6 -131 10 -130 Q14 -131 14.5 -126" fill="none" stroke={ink} strokeWidth="1.5"/>
          <path d="M19 -127 H31 M19 -121 H28" stroke={ink} strokeWidth="1.6"/>
        </g>
        <rect x="0" y="-116" width="34" height="26" rx="5" fill={GIN} stroke={GL} strokeWidth="2.2"/>
      </g>
      {/* head in profile */}
      <line x1="-8" y1="-248" x2="-14" y2="-264" stroke={GL} strokeWidth="3" strokeLinecap="round"/>
      <circle cx="-15" cy="-267" r="5.5" fill={GF} stroke={GL} strokeWidth="2"/>
      <rect x="-40" y="-248" width="80" height="74" rx="30" {...P(g, '#E9EFF8')}/>
      <circle cx="-10" cy="-211" r="11" {...P(g, TEAL)}/>
      <rect x="18" y="-236" width="24" height="46" rx="12" fill={GIN} stroke={GL} strokeWidth="2"/>
      {/* elastic band around the head */}
      <path d="M38 -228 C18 -244 -26 -240 -41 -218" fill="none" stroke={ink} strokeWidth="2" strokeDasharray="0" opacity="0.9"/>
      <path d="M38 -196 C18 -190 -26 -196 -41 -214" fill="none" stroke={ink} strokeWidth="2" opacity="0.9"/>
      <circle cx="-41" cy="-216" r="3.5" fill="#D9E2F7"/>
      {/* paper mask of the user's face, facing the shop */}
      <g transform="translate(54 -212) rotate(6) scale(1.18)">
        <ellipse rx="24" ry="33" fill="#323A4E" stroke="#E6ECFA" strokeWidth="2.2"/>
        <path d="M-23 -6 Q-25 -36 2 -35 Q24 -34 23 -8 Q18 -22 4 -21 Q-8 -19 -14 -26 Q-18 -14 -23 -6Z" fill="#4A5470" stroke={ink} strokeWidth="1.8"/>
        <circle cx="-7" cy="0" r="2.4" fill={ink}/><circle cx="8" cy="0" r="2.4" fill={ink}/>
        <path d="M-7 13 Q0 20 7 13" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="-24" cy="-14" r="2.4" fill="none" stroke={ink} strokeWidth="1.6"/>
        <circle cx="-24" cy="14" r="2.4" fill="none" stroke={ink} strokeWidth="1.6"/>
      </g>
      {/* front arm dropping coins into the register */}
      <Limb g={g} c="#AEBFD9" d="M24 -146 Q90 -158 142 -150"/>
      <path d="M140 -160 Q156 -150 142 -138" {...P(g, '#E9EFF8')}/>
    </g>
  );
};

/* ---------- places & machines ---------- */
const Awning = ({x, y, w, h, inset, n, c1, c2, g}) => {
  const sw = w / n, st = (w - 2 * inset) / n, by = y + h;
  return (
    <g>
      {Array.from({length: n}, (_, i) => {
        const bx0 = x + i * sw, bx1 = bx0 + sw, tx0 = x + inset + i * st, tx1 = tx0 + st;
        return <path key={i} d={`M${tx0} ${y} L${tx1} ${y} L${bx1} ${by} Q${(bx0 + bx1) / 2} ${by + 16} ${bx0} ${by}Z`}
          {...(g ? {fill: i % 2 ? 'rgba(140,160,215,0.10)' : GF, stroke: GL, strokeWidth: 2} : {fill: i % 2 ? c2 : c1})} strokeLinejoin="round"/>;
      })}
    </g>
  );
};

const Register = ({x, y, s = 1, g, c = '#2C5BB8'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 -40 L-22 -64 H22 L30 -40Z" {...P(g, '#1C3A78')}/>
    <rect x="-16" y="-60" width="32" height="14" rx="3" fill={g ? GIN : '#7FE7FF'} stroke={g ? GL : 'none'} strokeWidth="1.8"/>
    <rect x="-40" y="-40" width="80" height="40" rx="6" {...P(g, c)}/>
    <rect x="-14" y="-45" width="28" height="5" rx="2.5" fill={g ? GIN : '#0B1430'} stroke={g ? GL : 'none'} strokeWidth="1.5"/>
    <path d="M-30 -18 H30" stroke={g ? GL : 'rgba(255,255,255,0.35)'} strokeWidth="2"/>
  </g>
);

const Piggy = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* two lonely coins inside: nearly empty */}
    <Coin x={18} y={-40} r={10} g/><Coin x={38} y={-44} r={10} g/>
    <rect x="-52" y="-34" width="22" height="34" rx="8" fill={GFT} stroke={GL} strokeWidth="2.2"/>
    <rect x="28" y="-34" width="22" height="34" rx="8" fill={GFT} stroke={GL} strokeWidth="2.2"/>
    <ellipse cx="0" cy="-88" rx="86" ry="62" fill={GFT} stroke={GL} strokeWidth="2.4"/>
    <path d="M-44 -140 L-34 -168 L-12 -146Z" fill={GFT} stroke={GL} strokeWidth="2.2" strokeLinejoin="round"/>
    <ellipse cx="-88" cy="-82" rx="13" ry="18" fill={GFT} stroke={GL} strokeWidth="2.2"/>
    <circle cx="-91" cy="-88" r="2" fill={GL}/><circle cx="-91" cy="-76" r="2" fill={GL}/>
    <circle cx="-56" cy="-104" r="3.5" fill={GL}/>
    <path d="M84 -96 q20 -6 14 -24 q-8 -8 -15 2" fill="none" stroke={GL} strokeWidth="2.2" strokeLinecap="round"/>
    <rect x="-20" y="-153" width="40" height="7" rx="3.5" fill={GIN} stroke={GL} strokeWidth="2"/>
    {/* bottom plug */}
    <rect x="20" y="-30" width="22" height="10" rx="3" fill={GIN} stroke={GL} strokeWidth="2"/>
  </g>
);

const IDCard = ({x = 0, y = 0, s = 1, glow}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter={glow ? 'url(#greenGlow)' : undefined}>
    <rect x="-60" y="-76" width="120" height="152" rx="14" fill="#0E2A26" stroke="#4CF0B0" strokeWidth="4"/>
    <rect x="-46" y="-62" width="92" height="70" rx="10" fill="#1E7F67"/>
    <RobotFace x={0} y={-24} s={0.62}/>
    <circle cx="34" cy="2" r="15" fill="#22C55E" stroke="#EAFFF3" strokeWidth="3"/>
    <path d="M26 2 L32 9 L43 -5" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <g transform="translate(-26 38)">
      <path d="M0 -15 L14 -10 V1 C14 9 7 14 0 17 C-7 14 -14 9 -14 1 V-10Z" fill="#12A66B" stroke="#9CFFD6" strokeWidth="2.4"/>
      <path d="M-6 1 L-1 6 L7 -4" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <g transform="translate(18 40)" fill="none" stroke="#9CFFD6" strokeWidth="2.4" strokeLinecap="round">
      <path d="M-12 6 Q-12 -12 0 -12 Q12 -12 12 6"/><path d="M-7 9 Q-7 -6 0 -6 Q7 -6 7 9"/><path d="M-2 10 Q-2 -1 0 -1 Q2 -1 2 10"/>
    </g>
    <rect x="-46" y="60" width="92" height="7" rx="3.5" fill="url(#holo)"/>
  </g>
);

const Kiosk = ({x, y}) => (
  // origin = bottom-left corner on the ground; 190 wide, 300 tall, flat empty top
  <g transform={`translate(${x} ${y})`}>
    <rect x="182" y="-292" width="14" height="292" fill="#17399C"/>
    <rect x="0" y="-300" width="188" height="300" rx="12" fill="url(#kioskGrad)"/>
    <rect x="10" y="-300" width="168" height="6" rx="3" fill="rgba(255,255,255,0.35)"/>
    <RobotFace x={94} y={-270} s={0.28}/>
    <rect x="18" y="-250" width="152" height="118" rx="10" fill="#0B1A4A"/>
    <rect x="26" y="-242" width="136" height="102" rx="6" fill="#86C2FF"/>
    <RobotFace x={84} y={-193} s={0.66}/>
    <circle cx="136" cy="-160" r="15" fill="#22C55E" stroke="#EAFFF3" strokeWidth="3"/>
    <path d="M128 -160 L134 -153 L145 -167" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    {/* the single front cash slot */}
    <rect x="22" y="-104" width="144" height="20" rx="10" fill="#07102C"/>
    <rect x="34" y="-97" width="120" height="5" rx="2.5" fill="#2EE6C5" opacity="0.8"/>
    {/* four service icons along the bottom edge */}
    <rect x="10" y="-62" width="168" height="52" rx="10" fill="#0B1A4A"/>
    <KioskIcons x={33} y={-36} gap={41}/>
  </g>
);

const KioskIcons = ({x, y, gap, size = 1}) => {
  const st = {fill: 'none', stroke: '#7FF5FF', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round'};
  const icons = [
    <g {...st}><ellipse cx="-3" cy="6" rx="9" ry="3.5"/><ellipse cx="-3" cy="0" rx="9" ry="3.5"/><ellipse cx="-3" cy="-6" rx="9" ry="3.5"/><path d="M10 -2 V-12 M6 -8 L10 -12 L14 -8"/></g>,
    <g {...st}><path d="M-11 10 V4 M-4 10 V-1 M3 10 V-6 M10 10 V-11"/><path d="M-12 -4 L-2 -10 L4 -6 L12 -13"/></g>,
    <g {...st}><path d="M-12 -4 L0 -12 L12 -4Z"/><path d="M-8 -2 V7 M8 -2 V7 M-13 10 H13"/><path d="M-4 3 Q0 0 4 3"/></g>,
    <g {...st}><path d="M0 -12 L10 -8 V1 C10 7 5 11 0 13 C-5 11 -10 7 -10 1 V-8Z"/><path d="M-4 1 L-1 4 L5 -3"/></g>,
  ];
  return (
    <g>
      {icons.map((ic, i) => (
        <g key={i} transform={`translate(${x + i * gap} ${y}) scale(${size})`} opacity="0.55">
          <animate attributeName="opacity" values="0.55;1;0.55;0.55" keyTimes="0;0.15;0.35;1" dur="4s" begin={i * 1 + 's'} repeatCount="indefinite"/>
          {ic}
        </g>
      ))}
    </g>
  );
};

/* ---------- hero scene ---------- */
const W = 1600, H = 900;

const TodayPanel = () => (
  <g>
    {/* human -> piggy bank */}
    <Arrow x1={232} x2={352} y={300} color={GL} glow={false}/>
    {/* coins falling from above into the slot */}
    <Mover x={496} y={180} dy={68} dur={2.4} delay={0}><Coin r={11} g/></Mover>
    <Mover x={508} y={180} dy={68} dur={2.4} delay={1.2}><Coin r={11} g/></Mover>
    <Piggy x={490} y={425}/>
    {/* piggy -> robot */}
    <Arrow x1={598} x2={672} y={300} color={GL} glow={false}/>
    {/* coins pouring from the plug into the robot's rear hand */}
    <PathMover path="M521 400 Q600 430 680 402" dur={1.8} delay={0}><Coin r={9} g/></PathMover>
    <PathMover path="M521 400 Q600 430 680 402" dur={1.8} delay={0.9}><Coin r={9} g/></PathMover>
    <MaskedRobot x={790} y={425}/>
    {/* robot -> shop register */}
    <Arrow x1={846} x2={920} y={330} color={GL} glow={false}/>
    {/* shop */}
    <g>
      <rect x="1010" y="190" width="9" height="152" fill={GF} stroke={GL} strokeWidth="2"/>
      <rect x="1326" y="190" width="9" height="152" fill={GF} stroke={GL} strokeWidth="2"/>
      <Human x={1172} y={452} s={0.86} g mood="neutral" pose="counter" look={-4} apron hideLegs/>
      <Awning x={1000} y={135} w={345} h={55} inset={16} n={8} g/>
      <circle cx="1172" cy="112" r="34" fill="#05070C" stroke={GL} strokeWidth="2.2"/>
      <g transform="translate(1172 112)" fill="none" stroke={GL} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-17 -12 H-10 L-5 7 H12 L17 -6 H-8"/><circle cx="-2" cy="14" r="2.5"/><circle cx="10" cy="14" r="2.5"/>
      </g>
      <rect x="900" y="340" width="440" height="22" rx="5" fill={GF} stroke={GL} strokeWidth="2"/>
      <rect x="915" y="362" width="410" height="63" fill={GF} stroke={GL} strokeWidth="2"/>
      <Register x={970} y={340} g/>
    </g>
    {/* coins dropping from the robot's front hand into the register */}
    <Mover x={941} y={276} dy={22} dur={1.6} delay={0}><Coin r={8} g/></Mover>
    <Mover x={941} y={276} dy={22} dur={1.6} delay={0.8}><Coin r={8} g/></Mover>
    {/* the bill flies straight back to the user */}
    <path d="M968 284 C900 10, 320 -30, 184 210" fill="none" stroke={RED} strokeWidth="5" strokeDasharray="16 12" filter="url(#redGlow)">
      <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="1s" repeatCount="indefinite"/>
    </path>
    <polygon points="178,220 201,206 179,193" fill={RED}/>
    <PathMover path="M968 284 C900 10, 320 -30, 184 210" dur={3.2}><Notice s={0.75}/></PathMover>
    <Human x={150} y={425} g mood="worried" pose="hold"/>
    {/* red X */}
    <g filter="url(#redGlow)">
      <circle cx="1525" cy="84" r="46" fill="#1A050A" stroke={RED} strokeWidth="6">
        <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite"/>
      </circle>
      <path d="M1506 65 L1544 103 M1544 65 L1506 103" stroke={RED} strokeWidth="10" strokeLinecap="round"/>
    </g>
  </g>
);

const SystemPanel = () => (
  <g>
    {/* green check */}
    <g filter="url(#greenGlow)">
      <circle cx="1525" cy="520" r="46" fill="#04170F" stroke={GREEN} strokeWidth="6"/>
      <path d="M1503 520 L1519 536 L1548 504" fill="none" stroke={GREEN} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    </g>

    {/* human <-> kiosk slot */}
    <Human x={130} y={862} mood="happy" pose="notes"/>
    <CoinStack x={226} y={728}/>
    <NoteStack x={300} y={722}/>
    <Arrow x1={200} x2={326} y={768} dir="both"/>
    <Mover x={222} y={768} dx={82} dur={2.4}><Coin r={10}/></Mover>
    <Mover x={304} y={768} dx={-82} dur={2.4} delay={1.2}><Note s={0.8}/></Mover>

    <Kiosk x={332} y={862}/>

    {/* kiosk slot <-> robot's stall */}
    <NoteStack x={558} y={722}/>
    <CoinStack x={628} y={728}/>
    <Arrow x1={530} x2={650} y={768} dir="both"/>
    <Mover x={552} y={768} dx={76} dur={2.4} delay={0.6}><Note s={0.8}/></Mover>
    <Mover x={628} y={768} dx={-76} dur={2.4} delay={1.8}><Coin r={10}/></Mover>

    {/* robot's own stall */}
    <rect x="672" y="530" width="330" height="215" fill="#06231E"/>
    <rect x="664" y="530" width="10" height="215" rx="4" fill="#20B886"/>
    <rect x="998" y="530" width="10" height="215" rx="4" fill="#20B886"/>
    <Register x={864} y={742} s={0.8} c="#1F8F6E"/>

    {/* signed contract between the two robots */}
    <g transform="translate(1080 676) rotate(-4)">
      <rect x="-24" y="-30" width="48" height="60" rx="4" fill="#F4F8FF" stroke="#9DB4D8" strokeWidth="2"/>
      <path d="M-14 -16 H14 M-14 -8 H10 M-14 0 H14" stroke="#B8C6E4" strokeWidth="2.4" strokeLinecap="round"/>
      <path d="M-14 16 q5 -10 10 0 t10 0 t8 -4" fill="none" stroke="#2F6BFF" strokeWidth="2.4" strokeLinecap="round"/>
    </g>

    <Robot x={952} y={822} lanyard
      armL="M-46 -146 Q-76 -116 -70 -76" handL={[-70, -74]}
      armR="M46 -146 Q84 -156 120 -146" handR={[122, -146]} shakeR/>

    <Awning x={650} y={476} w={372} h={54} inset={22} n={9} c1="#22C993" c2="#E9FFF5"/>
    <rect x="652" y="742" width="368" height="22" rx="6" fill="#2FD39A"/>
    <rect x="664" y="764" width="344" height="98" fill="#0D2E2A"/>

    {/* the big verified ID card, mounted like a shop sign */}
    <rect x="757" y="722" width="10" height="22" fill="#4CF0B0"/>
    <IDCard x={762} y={638} s={0.95} glow/>

    {/* customers paying across the counter */}
    <Human x={860} y={862} s={0.62} mood="happy" pose="give" top="#F2A93B" hair="#3A2A20"/>
    <Robot x={922} y={862} s={0.5} body="#DDE7FA" accent="#7FA8FF"
      armR="M46 -146 Q80 -180 70 -226" handR={[70, -228]} holdR={<Coin x={70} y={-246} r={13}/>}/>

    {/* second robot's storefront */}
    <rect x="1162" y="540" width="270" height="210" fill="#3A1A0A"/>
    <rect x="1154" y="540" width="10" height="210" rx="4" fill="#E0761F"/>
    <rect x="1430" y="540" width="10" height="210" rx="4" fill="#E0761F"/>
    <Robot x={1196} y={822} body="#FFC24A" shade="#D9971A" accent="#3B82F6" lanyard
      armL="M-46 -146 Q-84 -156 -110 -146" handL={[-112, -146]} shakeL/>
    <Register x={1290} y={752} c="#2C5BB8"/>
    <Crate x={1380} y={724} s={1.1}/>
    <Awning x={1140} y={484} w={312} h={52} inset={20} n={8} c1="#FF8A2B" c2="#FFF1E2"/>
    <line x1="1392" y1="510" x2="1392" y2="566" stroke="#C9D6EE" strokeWidth="2"/>
    <IDCard x={1392} y={590} s={0.28}/>
    <rect x="1146" y="750" width="300" height="22" rx="6" fill="#FFA24A"/>
    <rect x="1156" y="772" width="280" height="90" fill="#F0742A"/>

    {/* any bill from the supplier lands on our robot's counter */}
    <Arrow x1={1026} x2={1136} y={732} dir="l" color={RED} w={6} glow={false}/>
    <Mover x={1120} y={726} dx={-96} dur={2.6} delay={0.4}><Notice s={0.5}/></Mover>
    <Notice x={1004} y={728} s={0.5} rot={-10}/>

    {/* B2B: crate to our stall, coins to their register */}
    <Arrow x1={1022} x2={1140} y={800} dir="l"/>
    <Arrow x1={1022} x2={1140} y={842} dir="r"/>
    <Mover x={1112} y={796} dx={-64} dur={2.6}><Crate s={0.5}/></Mover>
    <Mover x={1046} y={842} dx={70} dur={2.6} delay={1.3}><Coin r={10}/></Mover>
  </g>
);

const Defs = () => (
  <svg width="0" height="0" style={{position: 'absolute'}} aria-hidden="true" focusable="false">
    <defs>
      <filter id="soft" x="-20%" y="-60%" width="140%" height="220%">
        <feGaussianBlur stdDeviation="4" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="greenGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="7" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <linearGradient id="kioskGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4C9BFF"/><stop offset="1" stopColor="#1E4FD6"/>
      </linearGradient>
      <linearGradient id="holo" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#2EE6C5"/><stop offset="0.35" stopColor="#8B7CFF"/>
        <stop offset="0.7" stopColor="#FFC94A"/><stop offset="1" stopColor="#2EE6C5"/>
        <animateTransform attributeName="gradientTransform" type="translate" values="-1 0;1 0" dur="4s" repeatCount="indefinite"/>
      </linearGradient>
    </defs>
  </svg>
);

const HeroScene = () => (
  <svg className="scene" viewBox={`0 0 ${W} ${H}`} role="img"
    aria-label="Today: an AI agent wears a paper mask of its user's face and carries the user's card, spends from the user's savings, and the shop's bill flies back to the user. With our system: the agent has its own verified ID and its own account, trades with people and other agents, and bills land on the agent.">
    <TodayPanel/>
    <line x1="40" x2={W - 40} y1="450" y2="450" stroke="#262E44" strokeWidth="2"/>
    <SystemPanel/>
  </svg>
);

/* ---------- feature illustrations: how D1D solves each problem ---------- */
const Label = ({x, y, children, anchor = 'middle', color = '#A3AFCB'}) => (
  <text x={x} y={y} textAnchor={anchor} fill={color} fontSize="15" fontWeight="500" fontFamily="Figtree, system-ui, sans-serif">{children}</text>
);

// 1. The agent's own account: earn, deposit, withdraw, and bills land on the agent
const ArtAccount = () => (
  <svg viewBox="0 0 760 420" role="img" aria-label="The user withdraws profits from the agent's own account, the agent deposits what it earns, and a bill lands on the agent instead of the user">
    <Human x={78} y={404} s={0.85} mood="happy" pose="notes"/>
    <Arrow x1={142} x2={240} y={318} dir="both"/>
    <Mover x={162} y={318} dx={58} dur={2.4}><Coin r={10}/></Mover>
    <Mover x={222} y={318} dx={-58} dur={2.4} delay={1.2}><Note s={0.8}/></Mover>
    <g transform="translate(252 404) scale(0.9)"><Kiosk x={0} y={0}/></g>
    <Arrow x1={434} x2={540} y={318} dir="both"/>
    <Mover x={456} y={318} dx={62} dur={2.4} delay={0.6}><Note s={0.8}/></Mover>
    <Mover x={520} y={318} dx={-62} dur={2.4} delay={1.8}><Coin r={10}/></Mover>
    <Robot x={620} y={404} s={0.88} lanyard
      armR="M46 -146 Q84 -150 92 -186" handR={[92, -188]} holdR={<Coin x={92} y={-206} r={13}/>}/>
    {/* a customer pays the agent: it earns, not only spends */}
    <Robot x={716} y={404} s={0.42} body="#DDE7FA" accent="#7FA8FF"
      armL="M-46 -146 Q-80 -170 -86 -210" handL={[-86, -212]}/>
    <Mover x={680} y={312} dx={-20} dy={-30} dur={2.2}><Coin r={7}/></Mover>
    {/* any bill lands on the agent, not the user */}
    <path d="M744 40 Q560 20 600 172" fill="none" stroke={RED} strokeWidth="4" strokeDasharray="10 8">
      <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1s" repeatCount="indefinite"/>
    </path>
    <polygon points="601,182 607,156 585,161" fill={RED}/>
    <PathMover path="M744 40 Q560 20 600 172" dur={2.6}><Notice s={0.55}/></PathMover>
  </svg>
);

// 2. Behavioral identity: counterparties and behaviour become instant KYC, fraud screening and a credit score
const ArtIdentity = () => {
  const nodes = [[80, 86], [60, 210], [80, 334]];
  const target = [282, 214];
  const badges = [
    {y: 98, label: 'KYC', icon: <path d="M-9 0 L-2 7 L10 -7" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>},
    {y: 210, label: 'Fraud', icon: <g><path d="M0 -12 L10 -8 V1 C10 7 5 11 0 13 C-5 11 -10 7 -10 1 V-8Z" fill="none" stroke="#fff" strokeWidth="2.6"/><path d="M-4 1 L-1 4 L5 -3" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/></g>},
    {y: 322, label: 'Credit', icon: <g fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round"><path d="M-11 6 A11 11 0 0 1 11 6"/><path d="M0 6 L7 -4"/></g>},
  ];
  return (
    <svg viewBox="0 0 760 420" role="img" aria-label="The agent's own counterparties and behaviour form its identity, giving instant KYC, fraud screening and a credit score">
      {nodes.map(([x, y], i) => {
        const d = `M${x + 34} ${y} Q${(x + target[0]) / 2} ${(y + target[1]) / 2 + (i - 1) * -20} ${target[0] - 44} ${target[1]}`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke={TEAL} strokeWidth="2.5" opacity="0.45"/>
            <PathMover path={d} dur={2.2} delay={i * 0.7}><circle r="6" fill={TEAL} filter="url(#soft)"/></PathMover>
          </g>
        );
      })}
      {/* counterparties: another agent, a person, a shop */}
      <circle cx="80" cy="86" r="34" fill="#0F1A2E" stroke="#2A3A5E" strokeWidth="2"/>
      <RobotFace x={80} y={86} s={0.42} body="#FFC24A" accent="#3B82F6"/>
      <circle cx="60" cy="210" r="34" fill="#0F1A2E" stroke="#2A3A5E" strokeWidth="2"/>
      <g transform="translate(60 210)">
        <path d="M-18 26 Q-18 8 0 8 Q18 8 18 26" fill="#3D6CF2"/>
        <circle cy="-6" r="13" fill="#F2B48C"/>
        <path d="M-14 -6 Q-15 -22 1 -22 Q15 -21 14 -8 Q9 -15 1 -14 Q-6 -13 -9 -17 Q-11 -10 -14 -6Z" fill="#2B2342"/>
      </g>
      <circle cx="80" cy="334" r="34" fill="#0F1A2E" stroke="#2A3A5E" strokeWidth="2"/>
      <g transform="translate(80 334)">
        <Awning x={-22} y={-18} w={44} h={12} inset={4} n={4} c1="#FF8A2B" c2="#FFF1E2"/>
        <rect x="-18" y="-2" width="36" height="20" rx="2" fill="#F0742A"/>
        <rect x="-6" y="4" width="12" height="14" fill="#3A1A0A"/>
      </g>
      <Robot x={282} y={392} s={0.72} lanyard/>
      <Arrow x1={350} x2={420} y={214}/>
      <IDCard x={510} y={214} s={1.15} glow/>
      {badges.map((b, i) => (
        <g key={i} transform={`translate(680 ${b.y})`}>
          <g opacity="0.5">
            <animate attributeName="opacity" values="0.5;1;1;0.5" keyTimes="0;0.15;0.75;1" dur="3.6s" begin={i * 0.5 + 's'} repeatCount="indefinite"/>
            <circle r="26" fill="#12A66B" stroke="#9CFFD6" strokeWidth="3" filter="url(#greenGlow)"/>
            {b.icon}
          </g>
          <Label x={0} y={50}>{b.label}</Label>
        </g>
      ))}
    </svg>
  );
};

// 3. One profile, every check: one vector, one lookup, four answers
const ArtProfile = () => {
  const colors = [TEAL, '#3B82F6', GOLD, '#8B7CFF'];
  const cells = Array.from({length: 12}, (_, i) => i);
  const checks = [
    {y: 64, label: 'Identity'}, {y: 160, label: 'Fraud'}, {y: 256, label: 'Dispute'}, {y: 352, label: 'Credit'},
  ];
  const branch = (y) => `M500 210 C540 210, 540 ${y}, 584 ${y}`;
  return (
    <svg viewBox="0 0 760 420" role="img" aria-label="One feature vector describes the agent, so identity, fraud, dispute and credit checks are answered in a single lookup">
      <IDCard x={80} y={210} s={0.9}/>
      <Arrow x1={150} x2={196} y={210} w={7}/>
      {/* the feature vector */}
      <rect x="204" y="176" width="268" height="68" rx="14" fill="#0B1428" stroke="#2A3A5E" strokeWidth="2"/>
      {cells.map((i) => (
        <rect key={i} x={216 + i * 21} y="190" width="16" height="40" rx="4" fill={colors[i % 4]} opacity="0.85">
          <animate attributeName="opacity" values="0.85;0.4;0.85" dur="2.4s" begin={(i * 0.15).toFixed(2) + 's'} repeatCount="indefinite"/>
        </rect>
      ))}
      <line x1="472" x2="500" y1="210" y2="210" stroke={TEAL} strokeWidth="4"/>
      <circle cx="500" cy="210" r="8" fill={TEAL} filter="url(#soft)"/>
      {checks.map((c, i) => (
        <g key={i}>
          <path d={branch(c.y)} fill="none" stroke={TEAL} strokeWidth="3" opacity="0.5"/>
          <PathMover path={branch(c.y)} dur={2.4}><circle r="6" fill={TEAL}/></PathMover>
          <g transform={`translate(584 ${c.y - 30})`}>
            <rect width="160" height="60" rx="14" fill="#0B1428" stroke="#2A3A5E" strokeWidth="2"/>
            <rect width="160" height="60" rx="14" fill="none" stroke={GREEN} strokeWidth="3" opacity="0">
              <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.8;0.88;0.97;1" dur="2.4s" repeatCount="indefinite"/>
            </rect>
            <circle cx="30" cy="30" r="14" fill="#12A66B"/>
            <path d="M23 30 L28 35 L37 25" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
            <Label x={56} y={36} anchor="start" color="#E8EEFF">{c.label}</Label>
          </g>
        </g>
      ))}
    </svg>
  );
};

// 4. Learnable transaction approval: a boundary learned per agent, not a fixed cap
const ArtApproval = () => {
  const zoneA = 'M170 370 L170 160 C290 96 410 220 540 150 C620 108 690 120 744 150 L744 370 Z';
  const zoneB = 'M170 370 L170 182 C290 118 410 196 540 126 C620 92 690 146 744 124 L744 370 Z';
  const edgeA = 'M170 160 C290 96 410 220 540 150 C620 108 690 120 744 150';
  const edgeB = 'M170 182 C290 118 410 196 540 126 C620 92 690 146 744 124';
  return (
    <svg viewBox="0 0 760 420" role="img" aria-label="Each agent's approval boundary is learned from its behaviour and keeps adapting, approving normal payments and flagging unusual ones">
      <path d={zoneA} fill="rgba(46,230,197,0.10)">
        <animate attributeName="d" values={`${zoneA};${zoneB};${zoneA}`} dur="7s" repeatCount="indefinite"/>
      </path>
      <path d={edgeA} fill="none" stroke={TEAL} strokeWidth="4" filter="url(#soft)">
        <animate attributeName="d" values={`${edgeA};${edgeB};${edgeA}`} dur="7s" repeatCount="indefinite"/>
      </path>
      <path d="M170 30 V370 H744" fill="none" stroke="#2A3A5E" strokeWidth="2"/>
      <Robot x={86} y={392} s={0.6} lanyard/>
      {/* everyday payments flow through */}
      {[300, 260, 222].map((y, i) => (
        <PathMover key={i} path={`M170 ${y} L716 ${y}`} dur={3} delay={i}><Coin r={9}/></PathMover>
      ))}
      <g filter="url(#greenGlow)">
        <circle cx="720" cy="262" r="22" fill="#04170F" stroke={GREEN} strokeWidth="4"/>
        <path d="M710 262 L717 269 L731 254" fill="none" stroke={GREEN} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      {/* an unusual payment outside the learned boundary is held */}
      <PathMover path="M170 66 L430 66" dur={3} delay={1.5}><circle r="9" fill="#2A0D14" stroke={RED} strokeWidth="3"/></PathMover>
      <g transform="translate(456 66)">
        <circle r="18" fill="#1A050A" stroke={RED} strokeWidth="3"/>
        <path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke={RED} strokeWidth="3.5" strokeLinecap="round"/>
      </g>
    </svg>
  );
};

/* ---------- page ---------- */
const FEATURES = [
  {id: 'account', Art: ArtAccount,
    title: 'Agent’s own account',
    text: 'Agents deposit and withdraw, closing the full circle of agentic commerce: agents earn as well as spend, users withdraw the profits, and mistakes no longer hit the user’s card.',
    problem: 'Agent Errs, User Bleeds',
    problemText: 'Agents spend on the user’s credentials, so the user is liable for every mistake.'},
  {id: 'identity', Art: ArtIdentity,
    title: 'Behavioral identity',
    text: 'Identity defined by an agent’s own behavior and counterparties, giving every agent instant KYC, fraud screening, and a credit score.',
    problem: 'Unscorable Agents',
    problemText: 'Agent activity is scattered and mixed with the user’s, so there’s no track record or credit score, which lending and insurance depend on.'},
  {id: 'profile', Art: ArtProfile,
    title: 'One Profile, Every Check',
    text: 'One feature vector embeds everything about an agent, so identity, fraud, dispute, and credit checks become a single lookup, with no costly queries across separate services.',
    problem: 'Fragmented Services',
    problemText: 'Identity, KYC, fraud, disputes and payments are separate services, so the overhead can exceed a micropayment.'},
  {id: 'approval', Art: ArtApproval,
    title: 'Learnable Transaction Approval',
    text: 'Per-agent learned metrics replace hard rules, so agents extrapolate to smarter financial decisions faster, with minimal user intervention even in high-volume businesses.',
    problem: 'Guardrails or Handcuffs?',
    problemText: 'Spending caps and hard rules are the only safeguards, reducing agents to mere autopay.'},
];

const Feature = ({f, flip}) => (
  <section id={f.id} className={'band' + (flip ? ' flip' : '')}>
    <div className="band-inner">
      <div className="band-copy">
        <h2>{f.title}</h2>
        <p className="lead">{f.text}</p>
        <div className="solves">
          <p className="solves-label">Solves <strong>{f.problem}</strong></p>
          <p className="solves-text">{f.problemText}</p>
        </div>
      </div>
      <div className="band-art"><f.Art/></div>
    </div>
  </section>
);

/* ---------- links: replace any '#' with a real URL ---------- */
const LINKS = {
  paper: 'https://openreview.net/forum?id=Xs7JM4VGHv',   // NeurIPS 2025 paper
  dataset: 'https://eba.b1aab.ai',                       // Bitcoin ML-ready dataset
  github: 'https://github.com/B1AAB/EBA',                // dataset code on GitHub
  patent: 'https://patents.google.com/patent/US12647279B2/en', // patent
  prototype: '#',                                        // private preview prototype download (core method)
  demo: '#',                                             // private preview demo download (agent explorer)
};

/* ---------- milestone icons ---------- */
const MsIcon = ({kind}) => {
  const st = {fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round'};
  const icons = {
    data: <g {...st}><ellipse cx="18" cy="12" rx="11" ry="4.5"/><path d="M7 12 V30 C7 33 12 34.5 18 34.5 C24 34.5 29 33 29 30 V12"/><path d="M7 21 C7 24 12 25.5 18 25.5 C24 25.5 29 24 29 21"/><circle cx="38" cy="16" r="3.5"/><circle cx="40" cy="34" r="3.5"/><path d="M29 18 L34.6 16.6 M29 28 L36.8 32.6 M38.6 19.4 L39.6 30.5"/></g>,
    proto: <g {...st}><circle cx="10" cy="14" r="4"/><circle cx="34" cy="10" r="4"/><circle cx="14" cy="36" r="4"/><path d="M14 14 H30 M11 18 L13 32 M31 13 L17 33"/><rect x="28" y="28" width="16" height="12" rx="2.5"/><path d="M31.5 28 V24.5 A4.5 4.5 0 0 1 40.5 24.5 V28"/></g>,
    patent: <g {...st}><circle cx="24" cy="18" r="12"/><circle cx="24" cy="18" r="6.5"/><path d="M17 28 L13 42 L19 39 L22 44 L24 30 M31 28 L35 42 L29 39 L26 44 L24 30"/></g>,
    explorer: <g {...st}><circle cx="9" cy="12" r="3.5"/><circle cx="26" cy="8" r="3.5"/><circle cx="12" cy="30" r="3.5"/><path d="M12.4 11 L22.6 9 M9.6 15.4 L11.4 26.6"/><circle cx="29" cy="27" r="9"/><path d="M35.5 33.5 L43 41"/><path d="M25 27 h8 M29 23 v8"/></g>,
    cycle: <g {...st}><circle cx="12" cy="12" r="4"/><circle cx="36" cy="12" r="4"/><circle cx="24" cy="34" r="4"/><path d="M16 12 H32 M34 15.5 L26 30.5 M22 30.5 L14 15.5"/><path d="M29 9 L32 12 L29 15"/></g>,
    vector: <g {...st}><rect x="6" y="20" width="6" height="14" rx="1.5"/><rect x="15" y="12" width="6" height="22" rx="1.5"/><rect x="24" y="16" width="6" height="18" rx="1.5"/><rect x="33" y="8" width="6" height="26" rx="1.5"/><path d="M5 40 H41"/></g>,
    layers: <g {...st}><path d="M24 6 L42 15 L24 24 L6 15 Z"/><path d="M6 24 L24 33 L42 24"/><path d="M6 33 L24 42 L42 33" strokeDasharray="3 4"/></g>,
  };
  return <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true" focusable="false">{icons[kind]}</svg>;
};

const Ext = ({href, strong, children}) => {
  const real = href && href !== '#';
  return <a href={href || '#'} className={strong ? 'strong' : undefined}
    target={real ? '_blank' : undefined} rel={real ? 'noopener noreferrer' : undefined}>{children}</a>;
};

const MILESTONES = [
  {year: '2025', icon: 'data', title: 'Built the cold-start training data',
    body: (
      <div>
        <p>A learning platform has no transaction history on day one. That is the classic cold-start problem. So that our models can learn before the first agent ever transacts, we turned Bitcoin’s complete on-chain history, 16 years with more than 2.4 billion nodes and 39.7 billion time-stamped edges, into an ML-ready temporal graph and published it in the NeurIPS 2025 Datasets and Benchmarks Track. Reviewers and the area chair were unanimous in their praise.</p>
        <p className="ms-links">
          <Ext href={LINKS.dataset} strong>Take a peek at the data</Ext>
          <Ext href={LINKS.paper} strong>Read the NeurIPS 2025 spotlight paper</Ext>
          <Ext href={LINKS.github}>Browse the code on GitHub</Ext>
        </p>
      </div>
    )},
  {year: '2025', icon: 'proto', title: 'Prototyped the core method',
    body: (
      <div>
        <p>We argue that agentic commerce needs a payment platform that evolves as fast as the agentic ecosystem itself, and we believe a core enabler is letting the platform evolve autonomously. Our solution defines every entity by an evolving feature vector. The challenge is an underlying representation that scales and cryptographically guarantees that every approved vector stays immutable. Together with preventing double-spending, these are the core pillars of trustworthy payment. The science for this did not exist, so we developed it first, and it is now the state of the art.</p>
        <p className="ms-lead2">Our feasibility prototype validates three ideas.</p>
        <ul className="ms-bullets">
          <li>
            <span className="ms-point-icon"><MsIcon kind="cycle"/></span>
            <div><h4>Security on a full graph</h4><p>Transactions are cryptographically secured on a general graph, not a blockchain and not a single DAG, so cycles are allowed. Each node chains its own signatures with its incoming and outgoing edges.</p></div>
          </li>
          <li>
            <span className="ms-point-icon"><MsIcon kind="vector"/></span>
            <div><h4>Evolving, tamper-proof profiles</h4><p>Every node, whether a wallet or an agent, carries a feature vector computed by a graph neural network from its n-hop neighborhood. The vector keeps evolving, yet every approved version stays cryptographically immutable.</p></div>
          </li>
          <li>
            <span className="ms-point-icon"><MsIcon kind="layers"/></span>
            <div><h4>Built for volume and velocity</h4><p>Distinct communities are verified, validated and processed independently, with no graph-wide sync. Each agent’s older transactions can be pruned from hot storage into a cold archive, leaving a signed snapshot behind. You choose how much recent history stays hot, which sharply cuts storage and compute.</p></div>
          </li>
        </ul>
        <p className="ms-links"><Ext href={LINKS.prototype} strong>Download the private preview prototype</Ext></p>
      </div>
    )},
  {year: '2026', icon: 'patent', title: 'Granted a U.S. patent',
    body: (
      <div>
        <p>The method for creating and validating cryptographically secured graphs in distributed and decentralized networks is now U.S. Patent No. 12,647,279.</p>
        <p className="ms-links"><Ext href={LINKS.patent} strong>Read the patent</Ext></p>
      </div>
    )},
  {year: '2026', icon: 'explorer', title: 'Prototyped the agent explorer',
    body: (
      <div>
        <p>A platform to view and analyze agent activity. It works like the block explorers built for blockchains, with custom-designed and agentic analysis of the graph added on top.</p>
        <p className="ms-links"><Ext href={LINKS.demo} strong>Download the private preview demo</Ext></p>
      </div>
    )},
];

const Milestones = () => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = root.querySelectorAll('.ms');
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;
    root.classList.add('reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, {rootMargin: '0px 0px -12% 0px'});
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <section id="milestones" className="ready" ref={ref}>
      <div className="ready-inner">
        <div className="ready-head">
          <h2>Milestones already reached</h2>
          <p>We’re building D1D on solid ground: peer-reviewed data, a granted patent, and working prototypes.</p>
        </div>
        <ol className="timeline">
          {MILESTONES.map((m, i) => (
            <li className="ms" key={i}>
              <div className={'ms-year' + (i > 0 && MILESTONES[i - 1].year === m.year ? ' repeat' : '')}>{m.year}</div>
              <div className="ms-node" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M6 12.5 L10.5 17 L18 8" fill="none" stroke="#04140E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <article className="ms-card">
                <div className="ms-head">
                  <span className="ms-icon"><MsIcon kind={m.icon}/></span>
                  <div>
                    <span className="ms-chip">{m.year}</span>
                    <h3>{m.title}</h3>
                  </div>
                </div>
                <div className="ms-body">{m.body}</div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

const App = () => (
  <React.Fragment>
    <Defs/>
    <header className="hero">
      <div className="nav">
        <svg width="36" height="30" viewBox="-58 -40 116 80" aria-hidden="true" focusable="false"><RobotFace/></svg>
        <span>D1D</span>
      </div>
      <h1>The First Self-Learning Currency For Agentic Commerce</h1>
      <div className="scene-wrap"><HeroScene/></div>
      <p className="swipe">Swipe sideways to see the whole scene</p>
    </header>
    <main>
      {FEATURES.map((f, i) => <Feature key={f.id} f={f} flip={i % 2 === 1}/>)}
      <Milestones/>
    </main>
    <footer><div>D1D</div></footer>
  </React.Fragment>
);

/* ---------- boot ---------- */
if (typeof window !== 'undefined' && window.document && window.ReactDOM) {
  const root = document.getElementById('root');
  ReactDOM.createRoot(root).render(<App/>);
  // Respect "reduce motion": freeze every SVG animation.
  const rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  const freeze = () => {
    if (rm && rm.matches) document.querySelectorAll('svg').forEach((s) => s.pauseAnimations && s.pauseAnimations());
  };
  setTimeout(freeze, 50);
}
if (typeof module !== 'undefined') module.exports = {App};
