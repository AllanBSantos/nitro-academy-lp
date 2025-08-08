import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Função para validar CPF brasileiro
function validarCPF(cpf) {
    // Remove caracteres não numéricos (pontos, traços, barras, espaços, etc.)
    cpf = cpf.toString().replace(/[^\d]/g, '');

    // Se tem 10 dígitos, adiciona zero à esquerda (CPFs podem começar com 0)
    if (cpf.length === 10) {
        cpf = '0' + cpf;
    }

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
        return false;
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digitoVerificador1 = resto < 2 ? 0 : 11 - resto;

    if (parseInt(cpf.charAt(9)) !== digitoVerificador1) {
        return false;
    }

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digitoVerificador2 = resto < 2 ? 0 : 11 - resto;

    if (parseInt(cpf.charAt(10)) !== digitoVerificador2) {
        return false;
    }

    return true;
}

// Função para formatar CPF
function formatarCPF(cpf) {
    // Remove caracteres não numéricos antes de formatar
    cpf = cpf.replace(/[^\d]/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

async function buscarTodosAlunos(baseURL) {
    let todosAlunos = [];
    let pagina = 1;
    const tamanhoPagina = 100; // Máximo por página

    while (true) {
        try {
            const response = await axios.get(`${baseURL}/api/alunos?populate=*&pagination[page]=${pagina}&pagination[pageSize]=${tamanhoPagina}`);

            const alunos = response.data.data;
            const paginacao = response.data.meta.pagination;

            if (!alunos || !Array.isArray(alunos) || alunos.length === 0) {
                break;
            }

            todosAlunos = todosAlunos.concat(alunos);

            // Verificar se é a última página
            if (pagina >= paginacao.pageCount) {
                break;
            }

            pagina++;
        } catch (error) {
            console.error(`❌ Erro ao buscar página ${pagina}:`, error.message);
            break;
        }
    }

    return todosAlunos;
}

async function validarCPFsAlunos() {
    try {
        // URL da API do Strapi usando variável de ambiente
        const baseURL = process.env.STRAPI_API_URL;

        // Verificar se a variável de ambiente está definida
        if (!baseURL) {
            console.error('❌ ERRO: STRAPI_API_URL não está definida no arquivo .env');
            console.error('Por favor, adicione STRAPI_API_URL no arquivo .env');
            return;
        }

        // Buscar todos os alunos usando paginação
        const alunos = await buscarTodosAlunos(baseURL);

        if (!alunos || !Array.isArray(alunos)) {
            console.log('Nenhum aluno encontrado ou estrutura inesperada');
            return;
        }

        // Filtrar apenas alunos habilitados
        const alunosHabilitados = alunos.filter(aluno => aluno.habilitado === true);

        // Validar CPFs dos alunos
        const alunosComCPFInvalido = [];
        const alunosSemCPF = [];

        alunosHabilitados.forEach(aluno => {
            const cpfAluno = aluno.cpf_aluno;
            const nome = aluno.nome;
            const telefone = aluno.telefone_aluno || 'Não informado';

            // Validar CPF do aluno
            if (!cpfAluno || cpfAluno.trim() === '') {
                alunosSemCPF.push({
                    tipo: 'aluno',
                    nome: nome,
                    telefone: telefone,
                    cpf: 'NÃO INFORMADO',
                    campo: 'cpf_aluno'
                });
            } else {
                // Limpar CPF antes de validar
                const cpfLimpo = cpfAluno.replace(/[^\d]/g, '');

                // Validar CPF
                const ehValido = validarCPF(cpfLimpo);

                if (!ehValido) {
                    alunosComCPFInvalido.push({
                        tipo: 'aluno',
                        nome: nome,
                        telefone: telefone,
                        cpf: cpfAluno,
                        cpfFormatado: formatarCPF(cpfAluno),
                        campo: 'cpf_aluno'
                    });
                }
            }
        });

        // Relatório de CPFs inválidos
        if (alunosComCPFInvalido.length === 0) {
            console.log('\n✅ Nenhum CPF de aluno inválido encontrado!');
        } else {
            console.log(`\n🚨 CPFs DE ALUNOS INVÁLIDOS ENCONTRADOS: ${alunosComCPFInvalido.length}\n`);

            alunosComCPFInvalido.forEach((item, index) => {
                console.log(`${index + 1}. ALUNO: ${item.nome}`);
                console.log(`   Telefone: ${item.telefone}`);
                console.log(`   CPF: ${item.cpf} (${item.cpfFormatado})`);
                console.log('---');
            });
        }

        // Relatório de CPFs não informados
        if (alunosSemCPF.length === 0) {
            console.log('\n✅ Todos os CPFs de alunos foram informados!');
        } else {
            console.log(`\n⚠️ CPFs DE ALUNOS NÃO INFORMADOS: ${alunosSemCPF.length}\n`);

            alunosSemCPF.forEach((item, index) => {
                console.log(`${index + 1}. ALUNO: ${item.nome}`);
                console.log(`   Telefone: ${item.telefone}`);
                console.log('---');
            });
        }

        // Estatísticas gerais
        console.log('\n=== ESTATÍSTICAS GERAIS ===');
        console.log(`Total de alunos no sistema: ${alunos.length}`);
        console.log(`Alunos habilitados: ${alunosHabilitados.length}`);
        console.log(`CPFs de alunos inválidos: ${alunosComCPFInvalido.length}`);
        console.log(`CPFs de alunos não informados: ${alunosSemCPF.length}`);
        console.log(`Total de problemas: ${alunosComCPFInvalido.length + alunosSemCPF.length}`);

        if (alunosHabilitados.length > 0) {
            const percentualProblemas = ((alunosComCPFInvalido.length + alunosSemCPF.length) / alunosHabilitados.length) * 100;
            console.log(`Percentual de problemas: ${percentualProblemas.toFixed(2)}%`);
        }

        // Resumo por tipo
        if (alunosComCPFInvalido.length > 0 || alunosSemCPF.length > 0) {
            console.log('\n📊 Resumo por tipo:');

            const cpfAlunoInvalido = alunosComCPFInvalido.filter(item => item.campo === 'cpf_aluno').length;
            const cpfAlunoNaoInformado = alunosSemCPF.filter(item => item.campo === 'cpf_aluno').length;

            console.log(`   CPF do aluno inválido: ${cpfAlunoInvalido}`);
            console.log(`   CPF do aluno não informado: ${cpfAlunoNaoInformado}`);
        }

    } catch (error) {
        console.error('Erro ao validar CPFs:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

// Executar a função
validarCPFsAlunos(); 