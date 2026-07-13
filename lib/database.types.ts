export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          auth_id: string | null
          email: string
          nombre: string
          apellidos: string | null
          telefono: string | null
          avatar_url: string | null
          rol: 'admin' | 'editor' | 'usuario'
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id?: string | null
          email: string
          nombre: string
          apellidos?: string | null
          telefono?: string | null
          avatar_url?: string | null
          rol?: 'admin' | 'editor' | 'usuario'
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string | null
          email?: string
          nombre?: string
          apellidos?: string | null
          telefono?: string | null
          avatar_url?: string | null
          rol?: 'admin' | 'editor' | 'usuario'
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      socios: {
        Row: {
          id: string
          usuario_id: string | null
          numero_socio: string
          nombre: string
          apellidos: string
          email: string
          telefono: string | null
          dni: string | null
          fecha_nacimiento: string | null
          direccion: string | null
          codigo_postal: string | null
          localidad: string | null
          tipo: 'Adulto' | 'Juvenil' | 'Infantil' | 'Veterano' | 'Honorario'
          estado: 'activo' | 'pendiente' | 'inactivo' | 'baja'
          fecha_alta: string
          fecha_baja: string | null
          cuota_anual: number | null
          forma_pago: 'transferencia' | 'domiciliacion' | 'efectivo' | null
          iban: string | null
          notas: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          usuario_id?: string | null
          numero_socio: string
          nombre: string
          apellidos: string
          email: string
          telefono?: string | null
          dni?: string | null
          fecha_nacimiento?: string | null
          direccion?: string | null
          codigo_postal?: string | null
          localidad?: string | null
          tipo: 'Adulto' | 'Juvenil' | 'Infantil' | 'Veterano' | 'Honorario'
          estado?: 'activo' | 'pendiente' | 'inactivo' | 'baja'
          fecha_alta?: string
          fecha_baja?: string | null
          cuota_anual?: number | null
          forma_pago?: 'transferencia' | 'domiciliacion' | 'efectivo' | null
          iban?: string | null
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          usuario_id?: string | null
          numero_socio?: string
          nombre?: string
          apellidos?: string
          email?: string
          telefono?: string | null
          dni?: string | null
          fecha_nacimiento?: string | null
          direccion?: string | null
          codigo_postal?: string | null
          localidad?: string | null
          tipo?: 'Adulto' | 'Juvenil' | 'Infantil' | 'Veterano' | 'Honorario'
          estado?: 'activo' | 'pendiente' | 'inactivo' | 'baja'
          fecha_alta?: string
          fecha_baja?: string | null
          cuota_anual?: number | null
          forma_pago?: 'transferencia' | 'domiciliacion' | 'efectivo' | null
          iban?: string | null
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "socios_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          }
        ]
      }
      categorias_equipo: {
        Row: {
          id: string
          nombre: string
          orden: number
          activo: boolean
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          orden?: number
          activo?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          orden?: number
          activo?: boolean
          created_at?: string
        }
        Relationships: []
      }
      equipos: {
        Row: {
          id: string
          categoria_id: string
          nombre: string
          temporada: string
          descripcion: string | null
          imagen_url: string | null
          entrenador: string | null
          delegado: string | null
          grupo_liga: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          categoria_id: string
          nombre: string
          temporada: string
          descripcion?: string | null
          imagen_url?: string | null
          entrenador?: string | null
          delegado?: string | null
          grupo_liga?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          categoria_id?: string
          nombre?: string
          temporada?: string
          descripcion?: string | null
          imagen_url?: string | null
          entrenador?: string | null
          delegado?: string | null
          grupo_liga?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_equipo"
            referencedColumns: ["id"]
          }
        ]
      }
      jugadores: {
        Row: {
          id: string
          socio_id: string | null
          equipo_id: string | null
          nombre: string
          apellidos: string
          fecha_nacimiento: string | null
          dorsal: number | null
          posicion: 'Portero' | 'Defensa' | 'Centrocampista' | 'Delantero' | null
          foto_url: string | null
          ficha_federativa: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          socio_id?: string | null
          equipo_id?: string | null
          nombre: string
          apellidos: string
          fecha_nacimiento?: string | null
          dorsal?: number | null
          posicion?: 'Portero' | 'Defensa' | 'Centrocampista' | 'Delantero' | null
          foto_url?: string | null
          ficha_federativa?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          socio_id?: string | null
          equipo_id?: string | null
          nombre?: string
          apellidos?: string
          fecha_nacimiento?: string | null
          dorsal?: number | null
          posicion?: 'Portero' | 'Defensa' | 'Centrocampista' | 'Delantero' | null
          foto_url?: string | null
          ficha_federativa?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jugadores_socio_id_fkey"
            columns: ["socio_id"]
            isOneToOne: false
            referencedRelation: "socios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jugadores_equipo_id_fkey"
            columns: ["equipo_id"]
            isOneToOne: false
            referencedRelation: "equipos"
            referencedColumns: ["id"]
          }
        ]
      }
      categorias_noticia: {
        Row: {
          id: string
          nombre: string
          slug: string
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          slug: string
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          slug?: string
          color?: string | null
          created_at?: string
        }
        Relationships: []
      }
      noticias: {
        Row: {
          id: string
          categoria_id: string | null
          autor_id: string | null
          titulo: string
          slug: string
          extracto: string | null
          contenido: string
          imagen_principal: string | null
          galeria_imagenes: string[] | null
          destacada: boolean
          publicada: boolean
          fecha_publicacion: string | null
          vistas: number
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          categoria_id?: string | null
          autor_id?: string | null
          titulo: string
          slug: string
          extracto?: string | null
          contenido: string
          imagen_principal?: string | null
          galeria_imagenes?: string[] | null
          destacada?: boolean
          publicada?: boolean
          fecha_publicacion?: string | null
          vistas?: number
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          categoria_id?: string | null
          autor_id?: string | null
          titulo?: string
          slug?: string
          extracto?: string | null
          contenido?: string
          imagen_principal?: string | null
          galeria_imagenes?: string[] | null
          destacada?: boolean
          publicada?: boolean
          fecha_publicacion?: string | null
          vistas?: number
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "noticias_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_noticia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "noticias_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          }
        ]
      }
      contacto_mensajes: {
        Row: {
          id: string
          nombre: string
          email: string
          telefono: string | null
          asunto: string
          mensaje: string
          leido: boolean
          respondido: boolean
          fecha_respuesta: string | null
          notas_internas: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          email: string
          telefono?: string | null
          asunto: string
          mensaje: string
          leido?: boolean
          respondido?: boolean
          fecha_respuesta?: string | null
          notas_internas?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          email?: string
          telefono?: string | null
          asunto?: string
          mensaje?: string
          leido?: boolean
          respondido?: boolean
          fecha_respuesta?: string | null
          notas_internas?: string | null
          created_at?: string
        }
        Relationships: []
      }
      eventos: {
        Row: {
          id: string
          titulo: string
          slug: string
          descripcion: string | null
          descripcion_larga: string | null
          imagen_url: string | null
          fecha_inicio: string
          fecha_fin: string | null
          lugar: string | null
          precio: number | null
          capacidad: number | null
          inscripcion_requerida: boolean
          url_inscripcion: string | null
          publicado: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          slug: string
          descripcion?: string | null
          descripcion_larga?: string | null
          imagen_url?: string | null
          fecha_inicio: string
          fecha_fin?: string | null
          lugar?: string | null
          precio?: number | null
          capacidad?: number | null
          inscripcion_requerida?: boolean
          url_inscripcion?: string | null
          publicado?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          slug?: string
          descripcion?: string | null
          descripcion_larga?: string | null
          imagen_url?: string | null
          fecha_inicio?: string
          fecha_fin?: string | null
          lugar?: string | null
          precio?: number | null
          capacidad?: number | null
          inscripcion_requerida?: boolean
          url_inscripcion?: string | null
          publicado?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      galeria: {
        Row: {
          id: string
          titulo: string
          descripcion: string | null
          imagen_url: string
          miniatura_url: string | null
          tipo: 'imagen' | 'video'
          album: string | null
          fecha: string | null
          destacada: boolean
          publicada: boolean
          orden: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          descripcion?: string | null
          imagen_url: string
          miniatura_url?: string | null
          tipo?: 'imagen' | 'video'
          album?: string | null
          fecha?: string | null
          destacada?: boolean
          publicada?: boolean
          orden?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          descripcion?: string | null
          imagen_url?: string
          miniatura_url?: string | null
          tipo?: 'imagen' | 'video'
          album?: string | null
          fecha?: string | null
          destacada?: boolean
          publicada?: boolean
          orden?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      configuracion_web: {
        Row: {
          id: string
          clave: string
          valor: string | null
          tipo: 'text' | 'number' | 'boolean' | 'json' | 'html'
          descripcion: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          clave: string
          valor?: string | null
          tipo?: 'text' | 'number' | 'boolean' | 'json' | 'html'
          descripcion?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          clave?: string
          valor?: string | null
          tipo?: 'text' | 'number' | 'boolean' | 'json' | 'html'
          descripcion?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
