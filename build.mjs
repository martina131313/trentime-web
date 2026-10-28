// Gradi statičnu web stranicu trentime.eu iz istog teksta kao u aplikaciji (TRENtime-app/src/lib/legalText.ts).
// Pokretanje: node build.mjs  (Node 22+, čita .ts izravno)
import { writeFileSync } from 'node:fs';
const L = await import(new URL('../TRENtime-app/src/lib/legalText.ts', import.meta.url).href);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const link = (s) => esc(s).replace(/(www\.azop\.hr)/g, '<a href="https://$1">$1</a>').replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<a href="mailto:$1">$1</a>')
  .replace(/trentime\.eu\/([a-z]+\.html)/g, '<a href="$1">trentime.eu/$1</a>');

const css = `
:root{--bg:#10161F;--card:#18212E;--text:#E7E4DE;--muted:#A39C92;--accent:#ACA597;--border:#2B3544;--red:#7A2E34}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.6 'DM Sans',system-ui,sans-serif}
main{max-width:760px;margin:0 auto;padding:32px 16px 64px}
a{color:var(--accent)}h1,h2{font-family:Archivo,system-ui,sans-serif;letter-spacing:-.3px}
h1{font-size:34px;margin:24px 0 4px}h2{font-size:19px;margin:0 0 8px}
.logo{font-family:Archivo,sans-serif;font-weight:800;font-size:30px;text-decoration:none;color:var(--text)}
.logo span{font-family:Allura,cursive;font-weight:400;font-size:46px;color:var(--accent);margin-left:2px}
section{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:18px 20px;margin:14px 0}
p{margin:0 0 10px}.muted{color:var(--muted);font-size:14px}nav{display:flex;gap:16px;flex-wrap:wrap;margin-top:8px;font-size:15px}
.lang{float:right;font-size:14px}footer{margin-top:40px;color:var(--muted);font-size:13px}`;

function page({ file, lang, title, intro, sections, other }) {
  const hr = lang === 'hr';
  const body = sections.map((s) => `<section><h2>${esc(s.h)}</h2>${s.p.map((x) => `<p>${link(x)}</p>`).join('')}</section>`).join('\n');
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · TRENtime</title><meta name="description" content="${esc(title)} – TRENtime">
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Allura&family=Archivo:wght@700;800&family=DM+Sans:wght@400;600&display=swap" rel="stylesheet">
<style>${css}</style></head><body><main>
<a class="logo" href="${hr ? 'index.html' : 'en.html'}">TREN<span>time</span></a><a class="lang" href="${other}">${hr ? 'English' : 'Hrvatski'}</a>
<h1>${esc(title)}</h1>${intro ? `<p class="muted">${intro}</p>` : ''}
${body}
<footer>© 2026 ${esc(L.CONTROLLER_NAME)} · <a href="mailto:${L.CONTACT_EMAIL}">${L.CONTACT_EMAIL}</a></footer>
</main></body></html>`;
  writeFileSync(new URL(file, import.meta.url), html);
}

const home = (lang) => {
  const hr = lang === 'hr';
  const sections = hr
    ? [{ h: 'Što je TRENtime', p: ['Aplikacija za osobne trenere i njihove klijente: kalendar termina, rezervacije, paketi treninga, nadoknade, otkazivanja po pravilu 24 h i poruke – sve na jednom mjestu.', 'Trenutno je u zatvorenom beta testiranju. Besplatno do 28. 2. 2027.'] },
       { h: 'Dokumenti', p: ['Politika privatnosti: trentime.eu/privatnost.html', 'Uvjeti korištenja: trentime.eu/uvjeti.html'] }]
    : [{ h: 'What is TRENtime', p: ['An app for personal trainers and their clients: session calendar, bookings, session packages, make-up sessions, 24-hour cancellation rule and messages – all in one place.', 'Currently in closed beta. Free until 28 February 2027.'] },
       { h: 'Documents', p: ['Privacy policy: trentime.eu/privacy.html', 'Terms of use: trentime.eu/terms.html'] }];
  return sections.map((s) => ({ ...s }));
};

const hrUpd = `Verzija 1.0 · zadnja izmjena: ${L.LEGAL_UPDATED}`;
const enUpd = `Version 1.0 · last updated: ${L.LEGAL_UPDATED_EN}`;
page({ file: 'index.html', lang: 'hr', title: 'TRENtime', intro: 'Tvoji treninzi. Tvoj ritam.', sections: home('hr'), other: 'en.html' });
page({ file: 'en.html', lang: 'en', title: 'TRENtime', intro: 'Your sessions. Your rhythm.', sections: home('en'), other: 'index.html' });
page({ file: 'privatnost.html', lang: 'hr', title: 'Politika privatnosti', intro: hrUpd, sections: L.legalSections('privacy', 'hr'), other: 'privacy.html' });
page({ file: 'privacy.html', lang: 'en', title: 'Privacy policy', intro: enUpd, sections: L.legalSections('privacy', 'en'), other: 'privatnost.html' });
page({ file: 'uvjeti.html', lang: 'hr', title: 'Uvjeti korištenja', intro: hrUpd, sections: L.legalSections('terms', 'hr'), other: 'terms.html' });
page({ file: 'terms.html', lang: 'en', title: 'Terms of use', intro: enUpd, sections: L.legalSections('terms', 'en'), other: 'uvjeti.html' });
// upute za beta testere (samo HR; poveznica se šalje trenerima uz pozivnicu)
page({
  file: 'beta.html', lang: 'hr', title: 'Upute za beta testere', other: 'en.html',
  intro: 'Hvala što testiraš TRENtime! Beta je besplatna do 28. 2. 2027. Svaka primjedba nam pomaže.',
  sections: [
    { h: '1. Instalacija', p: [
      'iPhone: iz App Storea instaliraj aplikaciju TestFlight (Apple). Zatim otvori pozivnicu koju si dobio/la e-mailom ili poveznicom i dodirni „Instaliraj”. TRENtime se pojavi na početnom zaslonu kao i svaka aplikacija.',
      'Android: otvori poveznicu za instalaciju na mobitelu i preuzmi datoteku. Kad mobitel pita, dopusti instalaciju iz tog izvora („nepoznati izvori”) i dovrši instalaciju.',
      'Kad aplikacija pita smije li slati obavijesti, odaberi „Dopusti” – tako stižu podsjetnici, nove rezervacije i otkazivanja.',
    ] },
    { h: '2. Prvi koraci za trenera', p: [
      'Registriraj se kao trener i potvrdi e-mail (stiže kod od TRENtime <noreply@trentime.eu>).',
      'Postavke: odaberi trajanje termina, upiši standardni tjedni raspored i provjeri „Odsutnost i praznici” (zadano ne radiš na državne praznike; pojedini možeš uključiti).',
      'Klijenti: pozovi klijenta QR kodom, poveznicom ili e-mailom. Osobe bez aplikacije možeš voditi kao goste.',
      'Na kartici klijenta dodaj paket (broj treninga, cijena, rok) i po želji redovni termin.',
      'Tjedni poziv: upiši tekst i dan slanja – klijenti dobiju poruku s gumbom „Otvori kalendar”.',
    ] },
    { h: '3. Za klijente', p: [
      'Klijent se registrira kao klijent i poveže s trenerom skeniranjem QR koda ili preko poveznice. Trener odobri zahtjev.',
      'Rezervacija: „Rezerviraj termin” → odabir slobodne kućice. Otkazivanje više od 24 h prije je besplatno; unutar 24 h se naplaćuje, osim ako se otkaže u roku 5 minuta od rezervacije (zabuna).',
    ] },
    { h: '4. Što posebno testirati', p: [
      'Rezervacije, otkazivanja i promjene termina (posebno manje od 24 h prije).',
      'Pakete: skidanje treninga nakon održanog termina, nadoknade, „Klijent je otkazao”, „Nije došao”.',
      'Grupne termine (do 4 osobe, 50 % cijene) i redovne termine.',
      'Obavijesti na mobitelu i u aplikaciji, tjedni poziv, praznike i odsutnost.',
      'Svijetlu i tamnu temu (Postavke → Izgled).',
    ] },
    { h: '5. Kako prijaviti problem', p: [
      'U aplikaciji: Postavke (trener) ili Profil (klijent) → „Pošalji povratnu informaciju”. Opiši što si radio/la i što se dogodilo; po želji dodaj snimku zaslona.',
      'Ili e-mailom na info@trentime.eu.',
    ] },
    { h: '6. Važno', p: [
      'Beta je testna verzija: moguće su greške i promjene. Ne oslanjaj se još isključivo na aplikaciju za evidenciju plaćanja.',
      'Podaci se obrađuju prema politici privatnosti: trentime.eu/privatnost.html',
    ] },
  ],
});
console.log('ok');
