import { prisma } from "../config/prisma.js";

interface CriarRestauranteDTO {
  admin_usuario_id: string;
  nome: string;
  slug: string;
  descricao?: string;
  logo_base64?: string;
  whatsapp: string;
  email?: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado?: string;
  cep?: string;
  ativo?: boolean;
}

interface AtualizarRestauranteDTO {
  admin_usuario_id?: string;
  nome?: string;
  slug?: string;
  descricao?: string;
  logo_base64?: string;
  whatsapp?: string;
  email?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  ativo?: boolean;
}

export class RestauranteService {
  async obterTodos(filtros?: { cidade?: string; ativo?: boolean; admin_usuario_id?: string }) {
    return await prisma.restaurante.findMany({
      where: {
        ...(filtros?.admin_usuario_id && { admin_usuario_id: filtros.admin_usuario_id }),
        ...(filtros?.cidade && { cidade: filtros.cidade }),
        ...(filtros?.ativo !== undefined && { ativo: filtros.ativo }),
      },
      include: {
        horarios: {
          orderBy: { dia_semana: "asc" },
        },
      },
    });
  }

  async obterPorId(id: string) {
    return await prisma.restaurante.findUnique({
      where: { id },
      include: {
        horarios: {
          orderBy: { dia_semana: "asc" },
        },
      },
    });
  }

  async obterPorSlug(slug: string) {
    return await prisma.restaurante.findUnique({
      where: { slug },
      include: {
        horarios: {
          orderBy: { dia_semana: "asc" },
        },
      },
    });
  }

  async criar(dados: CriarRestauranteDTO) {
    const data = {
      admin_usuario_id: dados.admin_usuario_id,
      nome: dados.nome,
      slug: dados.slug,
      whatsapp: dados.whatsapp,
      rua: dados.rua,
      numero: dados.numero,
      bairro: dados.bairro,
      cidade: dados.cidade,
      ativo: dados.ativo ?? true,
      ...(dados.descricao !== undefined ? { descricao: dados.descricao } : {}),
      ...(dados.logo_base64 !== undefined
        ? { logo_base64: dados.logo_base64 }
        : {}),
      ...(dados.email !== undefined ? { email: dados.email } : {}),
      ...(dados.estado !== undefined ? { estado: dados.estado } : {}),
      ...(dados.cep !== undefined ? { cep: dados.cep } : {}),
    };

    return await prisma.restaurante.create({
      data,
      include: {
        horarios: true,
      },
    });
  }

  async atualizar(id: string, dados: AtualizarRestauranteDTO) {
    const data = {
      ...(dados.admin_usuario_id !== undefined
        ? { admin_usuario_id: dados.admin_usuario_id }
        : {}),
      ...(dados.nome !== undefined ? { nome: dados.nome } : {}),
      ...(dados.slug !== undefined ? { slug: dados.slug } : {}),
      ...(dados.descricao !== undefined ? { descricao: dados.descricao } : {}),
      ...(dados.logo_base64 !== undefined
        ? { logo_base64: dados.logo_base64 }
        : {}),
      ...(dados.whatsapp !== undefined ? { whatsapp: dados.whatsapp } : {}),
      ...(dados.email !== undefined ? { email: dados.email } : {}),
      ...(dados.rua !== undefined ? { rua: dados.rua } : {}),
      ...(dados.numero !== undefined ? { numero: dados.numero } : {}),
      ...(dados.bairro !== undefined ? { bairro: dados.bairro } : {}),
      ...(dados.cidade !== undefined ? { cidade: dados.cidade } : {}),
      ...(dados.estado !== undefined ? { estado: dados.estado } : {}),
      ...(dados.cep !== undefined ? { cep: dados.cep } : {}),
      ...(dados.ativo !== undefined ? { ativo: dados.ativo } : {}),
    };

    return await prisma.restaurante.update({
      where: { id },
      data,
      include: {
        horarios: {
          orderBy: { dia_semana: "asc" },
        },
      },
    });
  }

  async deletar(id: string) {
    return await prisma.restaurante.delete({
      where: { id },
    });
  }

  async verificarSlugExistente(slug: string, idExcluir?: string): Promise<boolean> {
    const restaurante = await prisma.restaurante.findUnique({
      where: { slug },
    });

    if (!restaurante) return false;
    if (idExcluir && restaurante.id === idExcluir) return false;

    return true;
  }
}
