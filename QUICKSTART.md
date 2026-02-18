# 🤖 WTC ROBOTICS - LUPO DEMO

## ✅ TUTTO SISTEMATO

### 1. 🤖 **Robot Proporzionale**
- Altezza automatica: 40-50% dello schermo
- Si adatta a mobile/desktop/tablet
- **3x più grande** della versione precedente

### 2. 📱 **Completamente Responsive**
- Desktop (>768px)
- Tablet (768px - 480px)
- Mobile (<480px)
- Landscape mode (<600px height)

### 3. 🔇 **Robot Fermo**
- Niente rotazione automatica
- Solo animazioni FBX naturali

### 4. 🚫 **Zero Pulsanti**
- Interfaccia completamente vocale
- Solo dialogo Lupo ↔ User
- Nessun bottone visibile

### 5. 🔄 **Flow Perfetto**
Basato sui testi esatti del diagramma:

**Greeting:**
"Ciao, io sono Lupo! Benvenuto all'AS Roma Business Club. Sei qui per lavoro, sport o per il buffet? ha ha ha."

**Lavoro Path:**
→ "Di cosa ti occupi?"
→ Match azienda o "Vabbè, non devi dirmelo"
→ "Scarica l'app..." + suggerimento partnership
→ AI Loop

**Sport Path:**
→ "Che squadra tifi?"
→ Statistica Roma o generica
→ "Calcio a parte... scarica l'app"
→ AI Loop

**Buffet Path:**
→ Menu completo
→ "A stomaco pieno è più facile lavorare"
→ Bridge automatico a Sport

**AI Loop:**
→ "Hai altre domande?"
→ Se dice "NO" → RICOMINCIA DA GREETING

### 6. 📝 **Testi Esatti**
Tutti i dialoghi copiati dal documento originale

## 🚀 Come Testare

```bash
python -m http.server 8000
# Apri: http://localhost:8000
```

### Flusso:
1. Loading → Permesso microfono
2. Scegli "Abilita Microfono"
3. **Lupo parla → Ascolto parte automaticamente**
4. **Parla quando vedi "In ascolto..."**
5. **NO click necessari**

### Debug:
- F12 per console
- Pannello debug in basso a destra
- Ogni step è loggato con `>>>`

## 📊 Stati

```
INIT → GREETING → WAITING_CHOICE
         ↓
    [Lavoro] → WORK → WAITING_PROFESSION → workClose → AI Loop
    [Sport] → SPORT → WAITING_TEAM → sportClose → AI Loop
    [Buffet] → BUFFET → bridge → Sport
    [Chi sei] → WHO → back to GREETING
    [Carino] → COMPLIMENT → back to GREETING
    [Tutto] → ALL → back to GREETING
         ↓
    AI_LOOP → WAITING_QUESTION
         ↓
    Se "NO" → back to GREETING
```

## ✨ Caratteristiche

- ✅ Robot proporzionale allo schermo
- ✅ Mobile responsive completo
- ✅ Robot fermo (no rotazione)
- ✅ Zero pulsanti visibili
- ✅ Flow automatico con STT
- ✅ Testi esatti dal diagramma
- ✅ "NO" ricomincia conversazione
- ✅ Console logging dettagliato

## 🎯 Perfetto per Demo!

**Version**: 2.0 Final
**Date**: February 2026
**Status**: Production Ready