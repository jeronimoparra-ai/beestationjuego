# ENVIRONMENT ART BIBLE (ARTE DE ESCENARIOS Y FLORA)
# BeeStation: Misión Néctar

---

## 1. CONCEPTO DEL JARDÍN MÁGICO DE BEEStation

El entorno visual no es un prado genérico, sino un **Ecosistema Botánico Encantado** inspirado en la flora apícola colombiana y tropical (flores melíferas reales estilizadas para un videojuego premium: botón de oro, trébol carmesí, orquídeas nativas, flor de guayabo y lavandas).

### 1.1 Atmósfera y Estilo Gráfico
- **Estilo:** Ilustración vectorial 2.5D con capas de profundidad, sombras suaves de contacto, iluminación difusa de sol matutino y niebla de rocío luminoso.
- **Sensación:** Un mundo minúsculo a escala de abeja (*Bee's Eye View*), donde las gotas de rocío en las hojas parecen perlas gigantes y los pétalos transmiten calidez y vitalidad.

---

## 2. ARQUITECTURA DE CAPAS Y PARALLAX (TV 16:9)

Para garantizar profundidad escénica cinematográfica en la pantalla grande del stand, el fondo del juego se estructura en 5 planos independientes:

```
[ Capa 5: Cielo Matutino y Gradiente Solar (#FFF8E9 -> #E2F6FD) ]
      |
[ Capa 4: Colinas Lejanas y Siluetas de Bosque (#BCE5C8 / #9EDDF1) ]
      |
[ Capa 3: Árbol Guardián, Colmena Colosal BeeStation y Celdillas ]
      |
[ Capa 2: Plano Medio — Tallos Principales y Banco de Flores Interactivas ]
      |
[ Capa 1: Primer Plano — Hojas Gigantes con Rocío y Partículas de Polen Bokeh ]
```

### 2.1 Especificaciones de Cada Capa
1. **Capa 5 (Fondo Profundo - Skybox):**
   - Gradiente cenital suave: De beige miel (`#FFF8E9`) en el horizonte a azul cielo limpio (`#E2F6FD`) en la parte superior.
   - Sol matutino con rayos crepusculares suaves (*God rays*) estilizados como conos de luz al 15% de opacidad.
2. **Capa 4 (Paisaje Distante):**
   - Siluetas redondeadas de colinas cubiertas de vegetación pastel, moviéndose a velocidad $V \times 0.1$ durante oscilaciones de viento.
3. **Capa 3 (La Gran Colmena BeeStation):**
   - Situada a la derecha de la composición televisiva.
   - Construcción de madera pulida cálida (`#76563D`) con ribetes metálicos dorados modernos inspirados en el diseño de la caja Langstroth tecnificada.
   - Centro translúcido de acrílico amigable donde se acumula la miel en tiempo real.
4. **Capa 2 (El Campo de Flores Jugables):**
   - 6 a 12 pedestales florales sobre ramas verdes ondeantes.
   - Iluminación focal cuando una flor entra en fase *Brillante* o *Dorada*.
5. **Capa 1 (Bokeh y Partículas Delanteras):**
   - Círculos de luz desenfocada dorada y verde que flotan lentamente, simulando polvo de polen suspendido en el aire frente a la cámara del televisor.

---

## 3. CATÁLOGO BOTÁNICO DE FLORES Y ESTADOS INTERACTIVOS

Se han concebido 6 variedades botánicas estilizadas, cada una con una identidad geométrica y cromática clara:

| Especie de Flor | Forma de Pétalos | Color Predominante | Personalidad Botánica |
|---|---|---|---|
| **Margarita Sol** | 8 pétalos ovalados concéntricos | Amarillo Miel (`#FFC94F`) | Vital, vibrante, siempre orientada al sol |
| **Campanilla Azul** | Cáliz acampanado con borde ondulado | Azul Cielo (`#9EDDF1`) | Delicada, produce un tintineo sutil al tocarse |
| **Lirio Coral** | 5 pétalos lanceolados con centro rojo | Coral Bloom (`#FF8C80`) | Aromática, néctar denso y brillante |
| **Orquídea Lavanda** | 3 sépalos y labelo abombado violeta | Lavanda Mist (`#B8A4E5`) | Mística y armónica, favorita de Lavanda |
| **Flor de Guayabo** | Estambres largos y pétalos suaves | Durazno Suave (`#FFD0AD`) | Tierna, polen esponjoso |
| **Loto Celestial Dorado** | Pétalos de cristal dorado en capas dobles | Oro Brillante (`#FFE9A8` & `#F59E0B`) | **Flor Especial (30 pts)**; brota con destellos de estrella |

### 3.1 Los 6 Estados Interactivos de una Flor
1. **Estado 1: Brote (Sprout):** Tallo en crecimiento con botón floral cerrado verde/amarillo.
2. **Estado 2: Inactiva (Resting):** Flor abierta pero en reposo, opacidad 75%, sin brillo.
3. **Estado 3: Anuncio Brillante (Glow Warning):** El centro de la flor pulsa rítmicamente con una aureola luminosa dorada; avisa a los jugadores que está por madurar su néctar.
4. **Estado 4: Activa / Disponible (Harvest Ready):** Flor en plenitud, balanceándose, aureola expandida, corona de destellos y néctar listo para tocar.
5. **Estado 5: Cosechada (Harvested):** En el milisegundo del toque, la flor se comprime ligeramente (*squash & stretch*) y libera una explosión de partículas de polen mientras la gota asciende.
6. **Estado 6: Recuperación (Regrowing):** Anillo de progreso verde translúcido o pétalos regenerándose hasta el próximo ciclo.

---

## 4. SISTEMA DE LA COLMENA COLECTIVA Y FÍSICA DE NÉCTAR

### 4.1 Comportamiento del Nivel de Miel
- **0% a 25%:** Base de la colmena iluminándose; zumbido tenue de agradecimiento.
- **26% a 50%:** Primer tercio alcanzado; hexágonos interiores se van encendiendo con luz ámbar pulsante.
- **51% a 75%:** La miel alcanza la mitad del ánfora; las abejitas en pantalla aumentan su velocidad de vuelo.
- **76% a 99%:** Nivel crítico; advertencia festiva de "¡Casi lo logramos!".
- **100% (Meta Lograda):** El tarro estalla en una cascada de miel dorada brillante, fuegos artificiales de polen y vítores de Mielita.
- **>100% (Modo Excedente / Reserva Real):** Frascos auxiliares hexagonales a los lados del televisor se van llenando con la miel adicional, mostrando el logro épico de la partida ("¡124% de Néctar Colectivo!").
