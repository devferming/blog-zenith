export interface Fase {
  id: number;
  slug: string;
  nombre: string;
  verbo: string;
  descripcion: string;
  pregunta: string;
}

export interface Post {
  id: number;
  slug: string;
  titulo: string;
  resumen: string;
  contenido: string;
  fase_id: number;
  fecha: string;
  minutos: number;
  etiquetas: string;
  destacado: number;
  fase_nombre?: string;
  fase_slug?: string;
}

export interface Caneca {
  id: 'blanca' | 'negra' | 'verde';
  nombre: string;
  color: string;
  que_va: string;
}

export interface Residuo {
  id: number;
  nombre: string;
  emoji: string;
  caneca_id: Caneca['id'];
  explicacion: string;
}

export interface Comentario {
  id: number;
  post_slug: string;
  autor: string;
  rol: string;
  texto: string;
  fecha: string;
}

export interface Pregunta {
  id: number;
  texto: string;
  dimension: string;
}

export interface Indicador {
  id: number;
  texto: string;
  dimension: string;
}

export interface Miembro {
  id: number;
  nombre: string;
  rol: string;
  aporte: string;
  tipo: 'autora' | 'docente' | 'comunidad';
}

export interface Referencia {
  id: number;
  apa: string;
  url: string | null;
}

export interface RegistroResiduos {
  id: number;
  fecha: string;
  grupo: string;
  semana: number;
  aprovechables_kg: number;
  organicos_kg: number;
  no_aprovechables_kg: number;
  bien_clasificados_pct: number;
  notas: string | null;
}
