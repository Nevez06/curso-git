// Servico de Auditoria (convertido de AuditoriaService.cs)
import { prisma } from '@/lib/prisma'
import { getNavegador, getSistemaOperacional } from '@/utils/security'
import { headers } from 'next/headers'

export class AuditoriaService {
  static async registrarAcao(
    tipoEntidade: string,
    entidadeId: number,
    tipoAcao: string,
    descricao: string,
    dadosAntigos?: any,
    dadosNovos?: any,
    sucesso = true,
    mensagemErro?: string
  ) {
    try {
      const headersList = headers()
      const userAgent = headersList.get('user-agent') || ''
      const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'Desconhecido'

      await prisma.auditoria.create({
        data: {
          tipoEntidade,
          entidadeId,
          tipoAcao,
          usuario: 'Sistema', // Será substituído pelo usuário logado
          enderecoIP: ip.substring(0, 45),
          descricao: descricao?.substring(0, 500),
          dadosAntigos: dadosAntigos ? JSON.stringify(dadosAntigos) : null,
          dadosNovos: dadosNovos ? JSON.stringify(dadosNovos) : null,
          navegador: getNavegador(userAgent),
          sistemaOperacional: getSistemaOperacional(userAgent),
          sucesso,
          mensagemErro: mensagemErro?.substring(0, 1000),
        }
      })
    } catch (ex) {
      console.error('Erro ao registrar auditoria:', ex)
    }
  }

  static async registrarLogin(usuario: string, sucesso = true, mensagemErro?: string) {
    await this.registrarAcao('User', 0, 'LOGIN', `Tentativa de login: ${usuario}`, null, null, sucesso, mensagemErro)
  }

  static async registrarLogout(usuario: string) {
    await this.registrarAcao('User', 0, 'LOGOUT', `Logout: ${usuario}`)
  }

  static async registrarVisualizacao(tipoEntidade: string, entidadeId: number, descricao: string) {
    await this.registrarAcao(tipoEntidade, entidadeId, 'VIEW', descricao)
  }

  static async obterTentativasLoginRecentes(userName: string): Promise<number> {
    const vinteMinutosAtras = new Date(Date.now() - 20 * 60 * 1000)
    return await prisma.auditoria.count({
      where: {
        usuario: userName,
        tipoAcao: 'LOGIN',
        dataAcao: { gte: vinteMinutosAtras },
        sucesso: false,
      }
    })
  }
}
