import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Função para normalizar nome (remover acentos e converter para minúsculas)
function normalizarNome(nome) {
    return nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .trim();
}

async function buscarTodosAlunos(baseURL) {
    let todosAlunos = [];
    let pagina = 1;
    const tamanhoPagina = 100; // Máximo por página

    while (true) {
        try {
            console.log(`📄 Buscando página ${pagina}...`);
            const response = await axios.get(`${baseURL}/api/alunos?populate=*&pagination[page]=${pagina}&pagination[pageSize]=${tamanhoPagina}`);

            const alunos = response.data.data;
            const paginacao = response.data.meta.pagination;

            if (!alunos || !Array.isArray(alunos) || alunos.length === 0) {
                break;
            }

            todosAlunos = todosAlunos.concat(alunos);
            console.log(`✅ Página ${pagina}: ${alunos.length} alunos encontrados`);

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

async function buscarAlunosDuplicados() {
    try {
        // URL da API do Strapi usando variável de ambiente
        const baseURL = process.env.STRAPI_API_URL;

        // Verificar se a variável de ambiente está definida
        if (!baseURL) {
            console.error('❌ ERRO: STRAPI_API_URL não está definida no arquivo .env');
            console.error('Por favor, adicione STRAPI_API_URL no arquivo .env');
            return;
        }

        console.log(`🔗 Usando baseURL: ${baseURL}`);

        // Buscar todos os alunos usando paginação
        const alunos = await buscarTodosAlunos(baseURL);

        if (!alunos || !Array.isArray(alunos)) {
            console.log('Nenhum aluno encontrado ou estrutura inesperada');
            return;
        }

        console.log(`\n📊 Total de alunos retornados: ${alunos.length}`);

        // Filtrar apenas alunos habilitados
        const alunosHabilitados = alunos.filter(aluno => aluno.habilitado === true);
        console.log(`🎯 Alunos habilitados: ${alunosHabilitados.length}`);

        // Agrupar alunos por nome normalizado
        const alunosPorNome = {};

        alunosHabilitados.forEach(aluno => {
            const nomeNormalizado = normalizarNome(aluno.nome);

            if (!alunosPorNome[nomeNormalizado]) {
                alunosPorNome[nomeNormalizado] = [];
            }

            alunosPorNome[nomeNormalizado].push(aluno);
        });

        // Filtrar apenas grupos com mais de 1 aluno (duplicados)
        const alunosDuplicados = Object.entries(alunosPorNome)
            .filter(([nomeNormalizado, alunos]) => alunos.length > 1)
            .sort((a, b) => b[1].length - a[1].length); // Ordenar por quantidade de duplicados

        console.log('\n=== ALUNOS DUPLICADOS (NOME NORMALIZADO) ===\n');

        if (alunosDuplicados.length === 0) {
            console.log('Nenhum aluno duplicado encontrado.');
        } else {
            console.log(`Total de nomes duplicados encontrados: ${alunosDuplicados.length}\n`);

            alunosDuplicados.forEach(([nomeNormalizado, alunos], index) => {
                console.log(`${index + 1}. Nome normalizado: "${nomeNormalizado}" (${alunos.length} ocorrências)`);

                alunos.forEach((aluno, alunoIndex) => {
                    console.log(`   ${alunoIndex + 1}. Nome original: ${aluno.nome}`);
                    console.log(`      ID: ${aluno.id}`);
                    console.log(`      Document ID: ${aluno.documentId}`);
                    console.log(`      Email: ${aluno.email_responsavel}`);
                    console.log(`      Responsável: ${aluno.responsavel}`);
                    console.log(`      Telefone: ${aluno.telefone_responsavel}`);
                    console.log(`      Habilitado: ${aluno.habilitado}`);
                    console.log(`      Criado em: ${new Date(aluno.createdAt).toLocaleDateString('pt-BR')}`);
                    console.log('');
                });
                console.log('---');
            });
        }

        // Estatísticas
        console.log('\n=== ESTATÍSTICAS ===');
        console.log(`Total de alunos no sistema: ${alunos.length}`);
        console.log(`Alunos habilitados: ${alunosHabilitados.length}`);
        console.log(`Nomes duplicados encontrados: ${alunosDuplicados.length}`);
        console.log(`Total de alunos duplicados: ${alunosDuplicados.reduce((total, [_, alunos]) => total + alunos.length, 0)}`);

        if (alunosDuplicados.length > 0) {
            console.log(`Percentual de nomes duplicados: ${((alunosDuplicados.length / Object.keys(alunosPorNome).length) * 100).toFixed(2)}%`);
        }

    } catch (error) {
        console.error('Erro ao buscar alunos:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

// Executar a função
buscarAlunosDuplicados(); 