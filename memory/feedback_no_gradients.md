---
name: Sin gradientes en iconos/UI — solo #1d0cdf sólido
description: El usuario rechaza gradientes en iconos, botones y texto. El color principal debe ser #1d0cdf puro en todo el sitio Tache Technology.
type: feedback
---

No usar gradientes en iconos, botones, fondos de tarjetas ni texto destacado del sitio Tache Technology. El color principal es `#1d0cdf` sólido (hover `#1709b8`, light `#eef0ff`).

**Why:** El usuario dijo literalmente "no me gusta que cambies los colores porque hay mucho gradiente en los iconos. recuerda que el color principal es este #1d0cdf". Los gradientes (btn-primary `linear-gradient(135deg, #1d0cdf → #4f46e5)`, text-gradient `#1d0cdf → #6366f1`, bg-gradient-brand, chart bars con `from-[#1d0cdf] to-[#6366f1]`, CtaBanner fondo multicolor, ContactFormPro sidebar `from-[#1d0cdf] to-[#4f46e5]`) diluían la identidad de marca y el azul puro.

**How to apply:**
- Botones primarios → fondo sólido `#1d0cdf`, hover `#1709b8`, sin `linear-gradient`.
- Iconos → color `#1d0cdf` sobre fondo `#eef0ff`; en hover sólido `#1d0cdf` con icono blanco.
- Palabras destacadas en H1/titulares → `color: #1d0cdf` sólido (no `text-gradient`).
- Barras de gráficos, chips de marca, halos, acentos → un solo tono `#1d0cdf` (o su variante light `#eef0ff`).
- CtaBanner y secciones brand-heavy → fondo sólido `#1d0cdf` (opcionalmente con textura/grid blanco sutil, pero sin mezclar otros azules).
- Mantener el gradiente SOLO si el usuario lo pide explícitamente para un elemento concreto.
