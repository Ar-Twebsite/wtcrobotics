DOCUMENTO DI SPECIFICA: WTC ROBOTICS - INTERACTIVE HOSPITALITY BOT
1. Identità Visiva e Interfaccia (UI/UX)
L'interfaccia deve riflettere il brand WTC Robotics. Deve essere moderna, pulita e "industrial-tech".
Palette Colori:
Primary (Sfondo/Struttura): Nero #1A1A1A o Grigio Scuro #222222.
Accent (Brand): Arancione WTC #FF6600 (o simile #F37021). Usato per pulsanti attivi, bordi, e indicatori di stato.
Text & Elements: Bianco #FFFFFF per il testo principale; Grigio chiaro #CCCCCC per i sottotitoli.
Layout:
Sfondo: Gradiente scuro o nero piatto per far risaltare il modello 3D.
Canvas 3D: A tutto schermo o centrato.
Overlay UI:
Logo "WTC ROBOTICS" in alto a sinistra (Bianco/Arancione).
Box Dialogo: In basso al centro. Stile "Glassmorphism" scuro con bordo sottile Arancione.
Feedback Vocale: Un visualizzatore audio (onda sonora) che diventa Arancione quando il robot ascolta e Bianco quando parla.
2. Stack Tecnologico
Gli agenti devono creare una Single Page Application (SPA) statica.
Rendering 3D: Three.js.
Utilizzo di FBXLoader per importare il robot e le animazioni.
Setup di luci semplice (Ambient + Directional) per evidenziare i materiali del robot.
Input Vocale (STT): Web Speech API (SpeechRecognition).
Leggera, gratuita, integrata nel browser.
Lingua impostata su it-IT.
Output Vocale (TTS): Web Speech API (SpeechSynthesis).
Voce italiana standard.
Logica: JavaScript Vanilla (ES6+). Nessun framework pesante richiesto.
Animazioni: Sistema di blending (mix) tra animazioni .fbx (Idle, Talk, Listen, Gestures).
3. Trascrizione Completa dei Flussi (Logica Condizionale)
Questa sezione sostituisce il diagramma visivo. Gli agenti devono implementare questa esatta macchina a stati.
Legenda Variabili:
[ASCOLTO] = Il robot attiva il microfono e attende input.
[TTS] = Il robot parla (Text-to-Speech).
[ANIM] = Animazione da eseguire.
FASE 0: Rilevamento
Stato Iniziale: "Qualcuno si avvicina".
Azione: Rilevamento simulato (click start o sensore).
Transizione: Vai a FASE 1.
FASE 1: Greeting & Smistamento (Nodo Centrale)
[TTS]: "Ciao, io sono Lupo! Benvenuto. Sei qui per lavoro, sport o per il buffet? Ah ah ah."
[ANIM]: Greeting / Talk.
[ASCOLTO]: Attesa input utente.
Logica Condizionale:
Se input contiene "Lavoro" -> Vai a FASE 2 (Lavoro).
Se input contiene "Sport" -> Vai a FASE 3 (Sport).
Se input contiene "Buffet" / "Mangiare" -> Vai a FASE 4 (Buffet).
Se input contiene "Chi sei?" -> Vai a FASE 5 (Info Robot).
Se input contiene "Sei carino" / Complimenti -> Vai a FASE 6 (Complimenti).
Se input contiene "Tutto" -> Vai a FASE 7 (Tutto).
Se Silenzio / Non capisce -> [TTS]: "Statistica generata con AI + commento sulla partita" -> Torna a FASE 1.
FASE 2: Ramo LAVORO
Passaggio 2.1:
[TTS]: "Fai bene, ci sono più di 350 aziende qui, puoi far evolvere la tua azienda grazie a partnership strategiche. Di cosa ti occupi?"
[ASCOLTO]: Attesa professione/settore.
Passaggio 2.2 (Analisi Risposta):
Opzione A (Risposta valida):
[TTS]: "Da quello che mi hai detto, secondo me potresti provare a sentire [NOME AZIENDA/PERSONA MOCK DAL DATABASE]."
Opzione B (Rifiuto/Silenzio "Non voglio dirlo"):
[TTS]: "Vabbè, non devi dirmelo per forza..."
Passaggio 2.3 (Chiusura Lavoro - Comune ad A e B):
[TTS]: "Sai che se scarichi l'app del Business Club puoi contattare direttamente altre aziende come la tua in pochissimo tempo? Scaricala subito!"
Transizione: Vai a FASE 8 (Loop Finale).
FASE 3: Ramo SPORT
Passaggio 3.1:
[TTS]: "Che squadra tifi?"
[ASCOLTO]: Attesa squadra.
Passaggio 3.2 (Analisi Risposta):
Opzione A (Tifa squadra di casa es. Roma):
[TTS]: [Genera statistica positiva con AI + Commento sulla partita].
Transizione: Vai a Passaggio 3.3.
Opzione B ("Non mi piace il calcio"):
[TTS]: "Capisco, non a tutti piace. Sicuramente sarai qui per lavoro o per fare compagnia a un tuo collega."
Transizione: Vai a Passaggio 3.3.
Passaggio 3.3 (Chiusura Sport):
[TTS]: "Calcio a parte..." -> Collega logicamente alla chiusura app (vedi Passaggio 2.3) o torna al menu.
FASE 4: Ramo BUFFET
Passaggio 4.1:
[TTS]: "Eh ti capisco! Purtroppo non posso assaggiare il menù di oggi ma sono sicuro sia tutto buonissimo! Oggi puoi mangiare..." -> [Elenco Menu Mock].
Passaggio 4.2:
[TTS]: "Del resto, a stomaco pieno è più facile lavorare e ti godi di più la partita."
Transizione: Questo ramo porta logicamente alla domanda "Che squadra tifi?" (Vai a FASE 3, Passaggio 3.1).
FASE 5, 6, 7: Interazioni "Chiacchiere" (Loop)
FASE 5 (Chi sei?):
[TTS]: "Sono Lupo! Il robot di WTC Robotics per l'Hospitality! Praticamente sono qui per rispondere a ogni tua domanda e far in modo che il tuo soggiorno oggi sia indimenticabile!" -> Torna a FASE 1 (Ascolto).
FASE 6 (Sei carino):
[TTS]: "Lo so!" -> [ANIM]: Happy / Shy -> Torna a FASE 1.
FASE 7 (Tutto/Indeciso):
[TTS]: "Quando ci si trova bene in un posto è sempre per più di un motivo!" -> Torna a FASE 1.
FASE 8: Loop Finale e AI Generativa
Trigger: "Ciao Lupo" o "Posso chiedere qualcosa?" (accessibile da qualsiasi stato di attesa).
[TTS]: "Assolutamente!" o "Se hai bisogno di qualcosa o hai qualche curiosità, dimmi pure!"
[ASCOLTO]: Domanda libera dell'utente.
[ELABORAZIONE]: Chiamata API simulata (o reale se disponibile).
[TTS]: Risposta generata dall'AI.
Transizione: Torna in attesa.
4. Specifiche Animazioni (Mapping)
Gli agenti devono mappare i seguenti file .fbx agli stati logici:
idle.fbx: Loop continuo quando il robot non parla e non ascolta.
talk.fbx: Loop attivato onStart del TTS, fermato onEnd del TTS. (Movimento bocca/braccia).
listen.fbx: Attivato quando il microfono è aperto (il robot si inclina leggermente in avanti o mano all'orecchio).
happy.fbx: Attivato su "Sei carino" o gol/vittoria.
thinking.fbx: Attivato durante l'elaborazione della risposta AI.
5. Istruzioni per l'Integrazione (Prompt per gli Agenti)
Copia e incolla questo prompt agli agenti per avviare il lavoro:
code
Text
Siete incaricati di sviluppare una pagina web interattiva per "WTC Robotics".
Il progetto consiste in un robot 3D renderizzato con Three.js che interagisce vocalmente con l'utente.

BRANDING:
- Colori: Arancione (#FF6600), Nero (#1A1A1A), Bianco.
- Stile: Clean, Corporate Hospitality.

TECNOLOGIA:
- HTML5 / CSS3 / Vanilla JS.
- Three.js per il 3D (caricare modello FBX con texture).
- Web Speech API per STT (Input) e TTS (Output).

COMPITI:
1. Crea una struttura HTML che ospiti un canvas 3D full-screen e un overlay UI in basso.
2. Implementa la "Macchina a Stati" descritta nella sezione "Trascrizione Completa dei Flussi" di questo documento. DEVI seguire la logica condizionale (if/else) basata sulle keyword trascritte (es: se user dice "Lavoro" -> vai allo stato Lavoro).
3. Gestisci le animazioni: Quando il TTS parla -> play 'Talk'. Quando STT ascolta -> play 'Listen'.
4. Inserisci dati Mock per le parti di "Database Aziende" e "Statistiche Partita".
5. Gestisci gli errori: Se l'utente non risponde o il microfono fallisce, fornisci pulsanti di fallback nella UI (Bottoni: "Lavoro", "Sport", "Buffet").

OUTPUT:
Fornire il codice completo diviso in index.html, style.css e script.js (o main.js + moduli logici).