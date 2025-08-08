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

async function buscarAlunosMultiplosCursos() {
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

        // Filtrar alunos com mais de um curso
        const alunosComMultiplosCursos = alunosHabilitados.filter(aluno => {
            const cursos = aluno.cursos || [];
            return cursos.length > 1;
        });

        // Ordenar por quantidade de cursos (maior para menor)
        alunosComMultiplosCursos.sort((a, b) => {
            const cursosA = a.cursos ? a.cursos.length : 0;
            const cursosB = b.cursos ? b.cursos.length : 0;
            return cursosB - cursosA;
        });

        console.log('\n=== ALUNOS COM MÚLTIPLOS CURSOS ===\n');

        if (alunosComMultiplosCursos.length === 0) {
            console.log('Nenhum aluno com múltiplos cursos encontrado.');
        } else {
            console.log(`Total de alunos com múltiplos cursos encontrados: ${alunosComMultiplosCursos.length}\n`);

            alunosComMultiplosCursos.forEach((aluno, index) => {
                const cursos = aluno.cursos || [];
                console.log(`${index + 1}. Nome: ${aluno.nome}`);
                console.log(`   ID: ${aluno.id}`);
                console.log(`   Document ID: ${aluno.documentId}`);
                console.log(`   Email: ${aluno.email_responsavel}`);
                console.log(`   Responsável: ${aluno.responsavel}`);
                console.log(`   Telefone: ${aluno.telefone_responsavel}`);
                console.log(`   Habilitado: ${aluno.habilitado}`);
                console.log(`   Criado em: ${new Date(aluno.createdAt).toLocaleDateString('pt-BR')}`);
                console.log(`   📚 Cursos (${cursos.length}):`);

                if (cursos.length > 0) {
                    cursos.forEach((curso, cursoIndex) => {
                        console.log(`      ${cursoIndex + 1}. ${curso.titulo || 'Título não disponível'}`);
                        if (curso.slug) {
                            console.log(`         Slug: ${curso.slug}`);
                        }
                        if (curso.nivel) {
                            console.log(`         Nível: ${curso.nivel}`);
                        }
                    });
                } else {
                    console.log(`      Nenhum curso encontrado`);
                }
                console.log('---');
            });
        }

        // Estatísticas detalhadas
        console.log('\n=== ESTATÍSTICAS ===');
        console.log(`Total de alunos no sistema: ${alunos.length}`);
        console.log(`Alunos habilitados: ${alunosHabilitados.length}`);
        console.log(`Alunos com múltiplos cursos: ${alunosComMultiplosCursos.length}`);

        if (alunosHabilitados.length > 0) {
            console.log(`Percentual de alunos com múltiplos cursos: ${((alunosComMultiplosCursos.length / alunosHabilitados.length) * 100).toFixed(2)}%`);
        }

        // Distribuição por quantidade de cursos
        const distribuicaoCursos = {};
        alunosComMultiplosCursos.forEach(aluno => {
            const quantidadeCursos = aluno.cursos ? aluno.cursos.length : 0;
            distribuicaoCursos[quantidadeCursos] = (distribuicaoCursos[quantidadeCursos] || 0) + 1;
        });

        if (Object.keys(distribuicaoCursos).length > 0) {
            console.log('\n📊 Distribuição por quantidade de cursos:');
            Object.entries(distribuicaoCursos)
                .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
                .forEach(([quantidade, alunos]) => {
                    console.log(`   ${quantidade} curso(s): ${alunos} aluno(s)`);
                });
        }

        // Total de matrículas em cursos
        const totalMatriculas = alunosComMultiplosCursos.reduce((total, aluno) => {
            return total + (aluno.cursos ? aluno.cursos.length : 0);
        }, 0);

        console.log(`\n🎓 Total de matrículas em cursos: ${totalMatriculas}`);

    } catch (error) {
        console.error('Erro ao buscar alunos:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

// Executar a função
buscarAlunosMultiplosCursos(); 