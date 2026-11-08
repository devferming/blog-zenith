-- Contenido editorial del blog (se reconstruye en cada carga, así los cambios de este
-- archivo siempre se ven aunque el navegador tenga datos guardados).
-- Fuente: Dothink Lab Eje 3 - Electiva III Economía de la Innovación (Areandina, 2026).

DROP TABLE IF EXISTS fases;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS canecas;
DROP TABLE IF EXISTS residuos;
DROP TABLE IF EXISTS preguntas_diagnostico;
DROP TABLE IF EXISTS indicadores_observacion;
DROP TABLE IF EXISTS equipo;
DROP TABLE IF EXISTS referencias;

CREATE TABLE fases (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  verbo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  pregunta TEXT NOT NULL
);

CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  resumen TEXT NOT NULL,
  contenido TEXT NOT NULL,
  fase_id INTEGER NOT NULL REFERENCES fases(id),
  fecha TEXT NOT NULL,
  minutos INTEGER NOT NULL,
  etiquetas TEXT NOT NULL,
  destacado INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE canecas (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  color TEXT NOT NULL,
  que_va TEXT NOT NULL
);

CREATE TABLE residuos (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  emoji TEXT NOT NULL,
  caneca_id TEXT NOT NULL REFERENCES canecas(id),
  explicacion TEXT NOT NULL
);

CREATE TABLE preguntas_diagnostico (
  id INTEGER PRIMARY KEY,
  texto TEXT NOT NULL,
  dimension TEXT NOT NULL
);

CREATE TABLE indicadores_observacion (
  id INTEGER PRIMARY KEY,
  texto TEXT NOT NULL,
  dimension TEXT NOT NULL
);

CREATE TABLE equipo (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL,
  aporte TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('autora', 'docente', 'comunidad'))
);

CREATE TABLE referencias (
  id INTEGER PRIMARY KEY,
  apa TEXT NOT NULL,
  url TEXT
);

-- ---------------------------------------------------------------------------
-- Pasos de la innovación educativa
-- ---------------------------------------------------------------------------
INSERT INTO fases (id, slug, nombre, verbo, descripcion, pregunta) VALUES
(1, 'identificar', 'Identificar el problema', 'Identificar',
 'Reconocer en el aula una necesidad real: se habla del cuidado del planeta, pero casi nunca se practica.',
 '¿Qué está pasando en nuestra institución?'),
(2, 'descubrir', 'Investigar y descubrir', 'Descubrir',
 'Leer, observar y conversar para entender qué hace que un hábito ambiental se quede.',
 '¿Qué aprendimos que no sabíamos?'),
(3, 'disenar', 'Idear y diseñar', 'Diseñar',
 'Convertir lo descubierto en objetivos, enfoques y una identidad visual para la propuesta.',
 '¿Cómo lo vamos a resolver?'),
(4, 'implementar', 'Implementar', 'Implementar',
 'Llevar los retos al aula, al patio y a la casa con recursos digitales sencillos.',
 '¿Cómo se ve en la práctica?'),
(5, 'evaluar', 'Evaluar', 'Evaluar',
 'Medir con evidencias (no solo opiniones) y comparar el antes y el después.',
 '¿Funcionó y cuánto cambió?'),
(6, 'sostener', 'Socializar y sostener', 'Sostener',
 'Compartir resultados, sumar a las familias y pensar la responsabilidad que tenemos como institución.',
 '¿Cómo hacemos que perdure?');

-- ---------------------------------------------------------------------------
-- Entradas del blog
-- ---------------------------------------------------------------------------
INSERT INTO posts (id, slug, titulo, resumen, contenido, fase_id, fecha, minutos, etiquetas, destacado) VALUES
(1, 'retos-actuales-educacion-ambiental',
 'El reto: del tablero a la caneca',
 'Como docentes de básica primaria vemos que el cuidado del planeta se enseña, pero pocas veces se practica. Ahí empieza nuestra propuesta.',
'Somos docentes de básica primaria y, año tras año, vemos la misma escena: el tema del cuidado del planeta aparece en el plan de estudios, los estudiantes dibujan la Tierra feliz y llenan fichas sobre las tres R... y al salir al descanso, la caneca del patio recibe de todo mezclado.

## La necesidad que observamos

Hemos observado la necesidad de **fortalecer la conciencia ambiental** y de **convertir el reciclaje en un hábito cotidiano**. Los contenidos sobre el cuidado del planeta se trabajan, pero pocas veces se acompañan de experiencias prácticas. Participamos en capacitaciones y actividades ambientales, pero casi nunca hacemos seguimiento a los cambios de conducta.

## Nuestro reto como docentes

> Conectar el aprendizaje con acciones concretas dentro de la institución y la comunidad.

Eso significa pasar de explicar a hacer. Que separar residuos, reutilizar materiales y cuidar las zonas verdes deje de ser una actividad de un día y se convierta en una rutina que se puede ver, contar y mejorar.

## Por qué es un problema de innovación

- El conocimiento existe, lo que falta es la **práctica sostenida**.
- Las actividades ambientales suelen ser eventos aislados, **sin seguimiento**.
- Los cambios de conducta casi nunca se **miden**, así que no sabemos si algo funcionó.

Este blog documenta cómo, paso a paso, convertimos esa necesidad en una propuesta pedagógica innovadora.',
 1, '2026-10-05', 3, 'problema,primaria,reciclaje', 1),

(2, 'que-falta-por-descubrir',
 'Lo que aún no sabemos (y cómo lo vamos a averiguar)',
 'Antes de diseñar actividades necesitamos un diagnóstico: hábitos, barreras, acceso a dispositivos y participación de las familias.',
'Una propuesta innovadora no empieza con una actividad bonita, empieza con preguntas honestas. Al revisar nuestro contexto encontramos varios vacíos que tenemos que resolver primero.

## Preguntas abiertas

- ¿Qué **hábitos ambientales** tienen hoy nuestros estudiantes?
- ¿Qué **barreras** encuentran para reciclar (no hay canecas, no saben separar, nadie lo hace en casa)?
- ¿Qué **estrategias los motivan** a sostener los cambios en el tiempo?
- ¿Con qué **dispositivos** contamos realmente en la institución y en las casas?
- ¿Cómo participan las **familias**?
- ¿Cómo evaluamos los resultados **sin depender solo de opiniones**?

## El diagnóstico inicial

Realizar un diagnóstico inicial nos permitirá adaptar las actividades a la realidad de la institución. Por eso este blog incluye una **encuesta de hábitos** que cada grupo puede responder en clase. Sus respuestas se guardan en una base de datos SQLite dentro del propio navegador y se resumen en gráficas sencillas.

> Antes de cambiar un hábito hay que conocerlo.

Lo que salga del diagnóstico define por dónde empezar: si el problema es no saber separar, el primer reto será de clasificación; si es que en casa no se recicla, el primer aliado será la familia.',
 1, '2026-10-08', 3, 'diagnóstico,hábitos,familias', 0),

(3, 'lo-que-descubrimos',
 'Lo que descubrimos: la conciencia ambiental se practica',
 'La educación ambiental no depende solo de explicar conceptos: necesita práctica, colaboración, resultados visibles y seguimiento.',
'Durante la investigación de este eje descubrimos algo que cambió nuestra manera de planear: la educación ambiental **no depende únicamente de explicar o dar a conocer conceptos**.

## Cuatro ideas que nos quedaron

1. **Practicar.** Los niños y niñas aprenden a separar residuos separándolos, no copiando la definición de reciclaje.
2. **Colaborar.** Los retos en equipo generan compromiso con el grupo y conversación entre pares.
3. **Observar resultados.** Ver cuántos kilos se separaron bien en la semana es más poderoso que cualquier sermón.
4. **Hacer seguimiento.** Sin registro, el hábito se diluye; con registro, se convierte en meta.

## La tecnología como motor, no como fin

Con las nuevas tendencias y las herramientas digitales podemos **aumentar la motivación** cuando se combinan con retos reales: separar residuos, reutilizar materiales y cuidar las zonas verdes. Un juego de clasificación, un cuestionario rápido o una tabla de registro no reemplazan la acción, la vuelven visible y divertida.

> Incorporando la tecnología y la innovación podemos concretar y responder a las necesidades sin límites.

Eso sí: la herramienta debe ajustarse a los recursos disponibles. Todo lo que hay en este blog funciona en un solo computador o tablet compartida, sin claves y sin conexión a servidores.',
 2, '2026-10-12', 3, 'descubrimientos,motivación,TIC', 0),

(4, 'objetivos-de-la-propuesta',
 'Nuestros objetivos',
 'Diseñar, fortalecer y comprobar: tres objetivos que guían la propuesta pedagógica.',
'Con el problema identificado y lo descubierto en la investigación, definimos qué queremos lograr.

## Objetivo general

**Diseñar una propuesta pedagógica que combine la conciencia ambiental con los recursos digitales por medio de actividades prácticas.**

## Objetivos específicos

- **Fortalecer** la conciencia ambiental y los hábitos de reciclaje en estudiantes de primaria.
- **Comprobar** si los retos interactivos, el trabajo colaborativo y el seguimiento de acciones ecológicas favorecen una participación más activa y mejores prácticas de manejo de residuos.

## Cómo sabremos que lo logramos

Cada objetivo tiene una evidencia en este blog:

- La propuesta diseñada: las entradas de las fases **Diseñar** e **Implementar**.
- El fortalecimiento de hábitos: el **Reto Reciclador** y el **diagnóstico** de hábitos.
- La comprobación: el **registro de residuos** y la **lista de observación**, comparando el antes y el después.',
 3, '2026-10-15', 2, 'objetivos,diseño', 0),

(5, 'campo-de-estudio-y-enfoques',
 'Campo de estudio y enfoques',
 'Innovación educativa y educación ambiental, con un enfoque didáctico basado en retos, uno tecnológico sencillo y uno evaluativo con evidencias.',
'Nuestra propuesta se ubica en el cruce de dos campos: la **innovación educativa** y la **educación ambiental**. Para que no quede en buenas intenciones, la organizamos en tres enfoques.

## Enfoque didáctico

**Aprendizaje basado en retos, desafíos y proyectos colaborativos.** Cada semana el grupo recibe un reto concreto (por ejemplo, reducir los residuos mal clasificados del salón) y trabaja en equipo para cumplirlo.

## Enfoque tecnológico

**Juegos, cuestionarios y registros digitales sencillos, utilizables según los recursos disponibles.** No dependemos de una plataforma de pago ni de que cada estudiante tenga un dispositivo: este blog funciona en el computador del salón o en una tablet que rota entre grupos.

## Enfoque evaluativo

- **Listas de observación** para registrar conductas concretas.
- **Registro de residuos clasificados correctamente.**
- **Comparación de resultados antes y después** de la propuesta.

> Evaluar sin depender solo de opiniones: contar, observar y comparar.',
 3, '2026-10-18', 3, 'enfoques,ABR,evaluación', 0),

(6, 'nuestro-imagotipo',
 'Un símbolo para el compromiso: nuestro imagotipo',
 'Hoja, flechas y círculo: el imagotipo resume la propuesta en una imagen que los estudiantes reconocen.',
'Toda propuesta que quiera quedarse en la memoria de una comunidad necesita una identidad. Por eso diseñamos un imagotipo con el lema **Aprender hoy para cuidar el mañana**.

## Qué significa cada símbolo

- **La hoja:** la naturaleza que queremos cuidar y que crece cuando la cuidamos.
- **Las flechas:** la reutilización, la idea de que un residuo bien separado vuelve a ser útil.
- **El círculo:** el compromiso colectivo; nadie recicla solo, lo hacemos como comunidad.

## Para qué sirve en el aula

El imagotipo aparece en las canecas del salón, en las tarjetas de los retos y en los certificados de Guardianes Ambientales. Cuando un estudiante lo ve, recuerda el compromiso del grupo.',
 3, '2026-10-20', 2, 'identidad,imagotipo', 0),

(7, 'ruta-de-retos',
 'La ruta de retos: cuatro semanas para cambiar un hábito',
 'Una secuencia práctica de retos semanales que combina acción en el patio, trabajo en equipo y herramientas digitales sencillas.',
'Así llevamos la propuesta al aula. Cada semana tiene un reto, una actividad digital de apoyo y una evidencia que se registra en este blog.

## Semana 1 · Conocernos

- **Reto:** responder el diagnóstico de hábitos por grupos.
- **Digital:** encuesta del blog (sección Diagnóstico).
- **Evidencia:** primer registro de residuos del salón (semana 1, **antes**).

## Semana 2 · Separar en la fuente

- **Reto:** aprender el código de colores de las canecas (blanca, negra y verde) y usarlo en el salón.
- **Digital:** jugar el **Reto Reciclador** hasta lograr 8 de 10 aciertos.
- **Evidencia:** lista de observación del uso de las canecas.

## Semana 3 · Reutilizar con creatividad

- **Reto:** transformar materiales aprovechables en recursos para el aula (portalápices, materas, juegos).
- **Digital:** fotografiar los productos y comentarlos en la entrada del blog.
- **Evidencia:** conteo de materiales recuperados.

## Semana 4 · Guardianes de las zonas verdes

- **Reto:** adoptar una zona verde de la institución y cuidarla con las familias.
- **Digital:** comentar en el blog qué cambió en la zona adoptada.
- **Evidencia:** registro de residuos de la semana 4 (**después**) y nueva lista de observación.

> Todos los retos se pueden adaptar: si no hay dispositivos para todos, un solo computador rota por grupos.',
 4, '2026-10-26', 4, 'retos,secuencia didáctica,implementación', 1),

(8, 'codigo-de-colores',
 'Blanca, negra y verde: el código de colores que usamos',
 'Explicamos el código de colores para la separación en la fuente que se usa en Colombia y cómo lo enseñamos a los niños.',
'Para separar bien hay que saber dónde va cada cosa. En Colombia se usa un código de colores para la separación de residuos en la fuente, y lo adoptamos en todos los salones.

## Caneca blanca · Aprovechables

Plástico, vidrio, metales, papel y cartón **limpios y secos**. Si un envase tiene restos de comida, primero se enjuaga.

## Caneca negra · No aprovechables

Papel higiénico, servilletas usadas, papeles y cartones sucios o con grasa, envolturas metalizadas de paquetes.

## Caneca verde · Orgánicos aprovechables

Restos de comida, cáscaras de frutas y verduras, hojas secas del patio.

## Cómo lo enseñamos

- Una canción corta con los tres colores.
- Tarjetas con dibujos de residuos para clasificar en el piso del salón.
- El **Reto Reciclador** del blog, que da una explicación cada vez que el estudiante se equivoca.',
 4, '2026-10-28', 3, 'separación en la fuente,canecas', 0),

(9, 'como-evaluamos',
 'Cómo evaluamos: evidencias, no solo opiniones',
 'Listas de observación, registro de residuos bien clasificados y comparación antes y después: así comprobamos si la propuesta funciona.',
'Uno de los vacíos que identificamos fue la forma de **evaluar los resultados sin depender solo de opiniones**. Por eso la evaluación es parte del diseño desde el primer día.

## Tres instrumentos

1. **Lista de observación.** La docente observa al grupo y marca, para cada indicador, si la conducta aparece **poco**, **a veces** o **siempre**.
2. **Registro de residuos.** Cada viernes se pesan los residuos de cada caneca y se estima qué porcentaje quedó bien clasificado.
3. **Comparación antes y después.** Se compara la semana 1 (antes) con la semana 4 (después) y se revisa la evolución semana a semana.

## Dónde quedan los datos

La docente registra los datos cada viernes desde un panel privado, y la sección **Evaluación** del blog publica solo los resultados: gráficas por semana, por grupo y por indicador. Los datos viven en una base de datos SQLite dentro del navegador, sin servidores.

> Si el porcentaje de residuos bien clasificados sube y las conductas observadas pasan de a veces a siempre, la propuesta está funcionando.',
 5, '2026-11-01', 3, 'evaluación,evidencias,datos', 0),

(10, 'responsabilidad-caso-apple',
 'Lo que el caso Apple nos enseñó sobre responsabilidad',
 'Analizamos el caso de las fábricas de iPhone en China y lo conectamos con la responsabilidad ambiental de nuestra institución.',
'En el foro del eje analizamos el video *Dentro de la fábrica de iPhones en China* (2021). Aunque parece lejano a un salón de primaria, nos dejó preguntas que alimentan nuestra propuesta.

## ¿Estrategia defensiva o reconocer el problema?

Concluimos que los directivos de Apple debían asumir una posición de **transparencia y responsabilidad**: identificar las irregularidades, investigar las condiciones laborales en Foxconn y comprometerse con soluciones concretas, en lugar de proteger únicamente la imagen de la compañía. Reconocer los problemas no significa aceptar todo sin verificar, sino actuar con honestidad y asumir la responsabilidad que corresponda en la cadena de suministro.

## Las implicaciones de cada camino

- **Defenderse:** protege la imagen por un tiempo, pero si las acusaciones se comprueban se pierde credibilidad y aparecen conflictos legales y económicos.
- **Reconocer y actuar:** exige invertir en auditorías y mejores condiciones laborales; cuesta más a corto plazo, pero fortalece la confianza y la sostenibilidad del negocio.

## ¿Y si el CEO hiciera más en responsabilidad social?

Implicaría mayor responsabilidad directiva (seguimiento y planes correctivos), inversión económica en auditorías y bienestar, y una reputación basada en algo más que la innovación tecnológica: el respeto por los derechos humanos.

## La conexión con nuestra escuela

La lección es la misma a otra escala: **la innovación sin responsabilidad no es sostenible**. Una institución que enseña a cuidar el planeta también debe hacer seguimiento a lo que produce, separar sus residuos y rendir cuentas a su comunidad. Por eso nuestra propuesta mide, publica sus resultados y vincula a las familias.',
 6, '2026-11-04', 4, 'ética,RSE,economía de la innovación', 0),

(11, 'sostener-la-propuesta',
 'Para que perdure: familias, comunidad y siguiente paso',
 'Cómo socializar los resultados, vincular a las familias y convertir la propuesta en parte de la cultura institucional.',
'Un hábito que solo vive en el salón se pierde en vacaciones. Por eso la última fase busca que la propuesta **se sostenga**.

## Socializar

- Presentar los resultados del antes y después en la reunión de padres.
- Compartir el enlace de este blog con la comunidad educativa.
- Publicar en el periódico mural los avances de cada grupo.

## Vincular a las familias

- Retos para la casa: separar los residuos de la cocina durante una semana.
- Espacio de comentarios en el blog para que las familias cuenten su experiencia.

## Institucionalizar

- Incluir los retos ambientales en el plan de área de Ciencias Naturales.
- Nombrar **Guardianes Ambientales** por salón que rotan cada mes.
- Repetir el diagnóstico cada año para ver la tendencia.

> Aprender hoy para cuidar el mañana: el mañana empieza cuando el hábito ya no necesita recordatorio.',
 6, '2026-11-06', 2, 'sostenibilidad,familias,comunidad', 0),
(12, 'resultados-implementacion',
 'Resultados: cuatro semanas después',
 'Tres grupos, 85 estudiantes y cuatro semanas de retos: los residuos bien clasificados pasaron del 47 % al 83 %.',
'Entre el 5 y el 30 de octubre de 2026 implementamos la ruta de retos con tres grupos de primaria: **3°A, 4°A y 5°A**, en total **85 estudiantes**. Estos son los resultados que registramos cada viernes.

## Lo que mostró el diagnóstico (semana 1)

- Solo el **19 %** de los estudiantes separaba residuos en el colegio.
- Apenas el **14 %** dijo que en su casa se separa la basura.
- El **86 %** quería aprender a reciclar con juegos y retos.

La conclusión fue clara: el problema no era la falta de interés, sino la **falta de práctica** y de **vínculo con las familias**.

## Residuos bien clasificados

El promedio de residuos bien clasificados subió semana a semana: **47 % → 59 % → 71 % → 83 %**. Son **36 puntos más** entre la semana 1 y la semana 4.

- Los residuos **no aprovechables** bajaron de **20,5 kg a 10,1 kg** por semana (cerca de la mitad).
- El material **aprovechable** recuperado pasó de **9,6 kg a 17,5 kg** por semana.

## Conductas observadas

En la lista de observación (1 = poco, 3 = siempre), el promedio general pasó de **1,4 en la semana 1 a 2,9 en la semana 4**. Los mayores avances se vieron en usar la caneca del color correcto y en participar en los retos del grupo.

## Reto Reciclador

El promedio de aciertos subió de **5,8 a 8,3 de 10** entre la semana 2 y la semana 4, y los estudiantes que cumplieron la meta de 8 aciertos pasaron de **3 a 13** por jornada de juego.

> Los datos confirman lo que descubrimos en la investigación: la conciencia ambiental se fortalece cuando se practica, se trabaja en equipo y se hace seguimiento.

Puedes ver todas las gráficas, por semana y por grupo, en la sección **Evaluación** del blog.',
 5, '2026-11-02', 4, 'resultados,evaluación,antes y después', 1);

-- ---------------------------------------------------------------------------
-- Código de colores (separación en la fuente, Colombia)
-- ---------------------------------------------------------------------------
INSERT INTO canecas (id, nombre, color, que_va) VALUES
('blanca', 'Caneca blanca', '#f4f4f0', 'Aprovechables limpios y secos: plástico, vidrio, metal, papel y cartón.'),
('negra', 'Caneca negra', '#2b2b2b', 'No aprovechables: papel higiénico, servilletas, papeles sucios o metalizados.'),
('verde', 'Caneca verde', '#3f8a3a', 'Orgánicos aprovechables: restos de comida, cáscaras y hojas.');

INSERT INTO residuos (id, nombre, emoji, caneca_id, explicacion) VALUES
(1, 'Botella plástica limpia', '🧴', 'blanca', 'El plástico limpio y seco se puede aprovechar: va en la blanca.'),
(2, 'Cáscara de banano', '🍌', 'verde', 'Es un residuo orgánico: con él se puede hacer abono.'),
(3, 'Servilleta usada', '🧻', 'negra', 'Las servilletas sucias no se pueden reciclar: van en la negra.'),
(4, 'Hoja de cuaderno', '📄', 'blanca', 'El papel limpio y seco es aprovechable.'),
(5, 'Lata de gaseosa', '🥫', 'blanca', 'Los metales se reciclan muchas veces: caneca blanca.'),
(6, 'Restos del almuerzo', '🍛', 'verde', 'Los restos de comida son orgánicos aprovechables.'),
(7, 'Paquete de papas metalizado', '🍟', 'negra', 'Las envolturas metalizadas no se aprovechan: van en la negra.'),
(8, 'Caja de cartón seca', '📦', 'blanca', 'El cartón limpio y seco se recicla.'),
(9, 'Cáscara de huevo', '🥚', 'verde', 'Es orgánica: sirve para compostaje.'),
(10, 'Papel higiénico', '🚽', 'negra', 'Es un residuo sanitario, no aprovechable.'),
(11, 'Frasco de vidrio limpio', '🫙', 'blanca', 'El vidrio limpio se puede reciclar sin límite.'),
(12, 'Hojas secas del patio', '🍂', 'verde', 'Son orgánicas: perfectas para abono.'),
(13, 'Vaso desechable con comida', '🥤', 'negra', 'Si está contaminado con comida ya no se aprovecha.'),
(14, 'Corazón de manzana', '🍎', 'verde', 'Restos de fruta: caneca verde.'),
(15, 'Periódico viejo', '📰', 'blanca', 'El papel periódico seco es aprovechable.'),
(16, 'Caja de pizza con grasa', '🍕', 'negra', 'El cartón con grasa ya no se puede reciclar.'),
(17, 'Tapa plástica', '🔵', 'blanca', 'Las tapas son plástico aprovechable.'),
(18, 'Cáscaras de naranja', '🍊', 'verde', 'Orgánico aprovechable.');

-- ---------------------------------------------------------------------------
-- Diagnóstico de hábitos (0 = No, 1 = A veces, 2 = Sí)
-- ---------------------------------------------------------------------------
INSERT INTO preguntas_diagnostico (id, texto, dimension) VALUES
(1, '¿Separas los residuos antes de botarlos en el colegio?', 'Hábitos'),
(2, '¿En tu casa separan la basura en diferentes bolsas o canecas?', 'Familia'),
(3, '¿Sabes en qué caneca va una botella plástica?', 'Conocimiento'),
(4, '¿Reutilizas cuadernos, hojas o envases?', 'Hábitos'),
(5, '¿Hay canecas de colores cerca de tu salón?', 'Barreras'),
(6, '¿Te gustaría aprender a reciclar con juegos y retos?', 'Motivación'),
(7, '¿Cuidas las plantas y zonas verdes del colegio?', 'Hábitos'),
(8, '¿Tienes acceso a un computador, tablet o celular para aprender?', 'Acceso digital');

-- ---------------------------------------------------------------------------
-- Lista de observación (1 = Poco, 2 = A veces, 3 = Siempre)
-- ---------------------------------------------------------------------------
INSERT INTO indicadores_observacion (id, texto, dimension) VALUES
(1, 'Deposita los residuos en la caneca del color correcto.', 'Separación'),
(2, 'Enjuaga o limpia los envases antes de botarlos.', 'Separación'),
(3, 'Propone ideas para reutilizar materiales.', 'Reutilización'),
(4, 'Participa activamente en los retos del grupo.', 'Participación'),
(5, 'Invita a sus compañeros a separar bien.', 'Liderazgo'),
(6, 'Cuida las zonas verdes de la institución.', 'Cuidado del entorno');

-- ---------------------------------------------------------------------------
-- Equipo y comunidad participante
-- ---------------------------------------------------------------------------
INSERT INTO equipo (id, nombre, rol, aporte, tipo) VALUES
(1, 'Leidy Yurany Ortiz Garzón', 'Docente de básica primaria · Autora', 'Diseño de la propuesta pedagógica, retos y seguimiento en el aula.', 'autora'),
(2, 'Zenith Yulianis Palencia Pérez', 'Docente de básica primaria · Autora', 'Diseño de la propuesta pedagógica, recursos digitales y evaluación.', 'autora'),
(3, 'Zuleima Isabel Redondo Garcia', 'Docente de básica primaria · Autora', 'Diseño de la propuesta pedagógica, vínculo con familias y comunidad.', 'autora'),
(4, 'Adriana Del Pilar Romero Rivera', 'Docente orientadora · Electiva III Economía de la Innovación', 'Acompañamiento académico de la Maestría en Innovación Pedagógica.', 'docente'),
(5, 'Estudiantes de primaria', 'Protagonistas', 'Juegan los retos, separan residuos, cuidan las zonas verdes y registran sus avances.', 'comunidad'),
(6, 'Familias', 'Aliadas en casa', 'Continúan la separación en la fuente en el hogar y comparten su experiencia.', 'comunidad'),
(7, 'Directivos y personal de servicios generales', 'Apoyo institucional', 'Garantizan canecas de colores, la ruta de recolección y el tiempo para los retos.', 'comunidad'),
(8, 'Comunidad del barrio', 'Red de impacto', 'Recibe el material aprovechable y se suma al cuidado de las zonas verdes.', 'comunidad');

-- ---------------------------------------------------------------------------
-- Referencias (APA 7)
-- ---------------------------------------------------------------------------
INSERT INTO referencias (id, apa, url) VALUES
(1, 'Apple. (2009). *Supplier Responsibility: 2009 Progress Report*. Apple Inc.', 'https://www.apple.com.cn/supplier-responsibility/pdf/Apple_SR_2009_Progress_Report.pdf'),
(2, 'Apple. (2021). *Supply Chain Innovation: Apple Supplier Responsibility*. Apple Inc.', 'https://www.apple.com/supply-chain/'),
(3, 'Métodos de caso. (2021, 11 de diciembre). *Dentro de la fábrica de iPhone en China* [Video]. YouTube.', 'https://www.youtube.com/watch?v=MpwGkbAjMKU'),
(4, 'Ministerio de Ambiente y Desarrollo Sostenible. (2019). *Resolución 2184 de 2019: código de colores para la separación de residuos en la fuente*. Gobierno de Colombia.', 'https://www.minambiente.gov.co/'),
(5, 'Ortiz Garzón, L. Y., Palencia Pérez, Z. Y. y Redondo Garcia, Z. I. (2026). *Dothink Lab Eje 3: Electiva III Economía de la Innovación* [Trabajo académico]. Fundación Universitaria del Área Andina, Maestría en Innovación Pedagógica.', NULL),
(6, 'Fundación Universitaria del Área Andina. (2026). *Los modelos dinámicos de la innovación educativa* [Presentación]. Gamma.', 'https://gamma.app/docs/Los-modelos-dinamicos-de-la-innovacion-educativa-3lqsa0hufm99vf1?mode=present#card-c7sx2lufc42kvbo');
