import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

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

async function buscarAlunosTelefoneIgual() {
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

        // Filtrar alunos onde telefone_responsavel é igual a telefone_aluno E habilitado = true
        const alunosComTelefoneIgual = alunos.filter(aluno => {
            const telefoneResponsavel = aluno.telefone_responsavel;
            const telefoneAluno = aluno.telefone_aluno;
            const habilitado = aluno.habilitado;

            // Verificar se ambos os campos existem e são iguais, E se o aluno está habilitado
            return telefoneResponsavel &&
                telefoneAluno &&
                telefoneResponsavel.trim() !== '' &&
                telefoneAluno.trim() !== '' &&
                telefoneResponsavel === telefoneAluno &&
                habilitado === true;
        });

        console.log('\n=== ALUNOS HABILITADOS COM TELEFONE DO RESPONSÁVEL IGUAL AO TELEFONE DO ALUNO ===\n');

        if (alunosComTelefoneIgual.length === 0) {
            console.log('Nenhum aluno habilitado encontrado com telefone do responsável igual ao telefone do aluno.');
        } else {
            console.log(`Total de alunos habilitados encontrados: ${alunosComTelefoneIgual.length}\n`);

            alunosComTelefoneIgual.forEach((aluno, index) => {
                console.log(`${index + 1}. Nome: ${aluno.nome}`);
                console.log(`   Telefone Responsável: ${aluno.telefone_responsavel}`);
                console.log(`   Telefone Aluno: ${aluno.telefone_aluno}`);
                console.log(`   Responsável: ${aluno.responsavel}`);
                console.log(`   Email: ${aluno.email_responsavel}`);
                console.log(`   Habilitado: ${aluno.habilitado}`);
                console.log('---');
            });
        }

        // Estatísticas
        console.log('\n=== ESTATÍSTICAS ===');
        console.log(`Total de alunos no sistema: ${alunos.length}`);
        console.log(`Alunos habilitados com telefone igual: ${alunosComTelefoneIgual.length}`);
        console.log(`Percentual: ${((alunosComTelefoneIgual.length / alunos.length) * 100).toFixed(2)}%`);

    } catch (error) {
        console.error('Erro ao buscar alunos:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

// Executar a função
buscarAlunosTelefoneIgual(); 