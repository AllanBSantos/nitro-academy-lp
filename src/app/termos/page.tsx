export default function TermsPage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <div className="min-h-screen bg-[#1e1b4b] text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-gilroy-extrabold sm:text-6xl mb-8 text-orange-600">
          Termos de Uso da Nitro Academy
        </h1>
        <p className="text-lg mb-8">Última atualização: 7 de abril 2025</p>

        <div className="prose prose-invert max-w-none">
          <p className="mb-8">
            Estes Termos de Uso (&ldquo;Termo&rdquo;) regulam a utilização da
            plataforma Nitro Academy, de titularidade da Digniti Ltda, sociedade
            limitada, com sede no Brasil, doravante denominada
            &ldquo;Plataforma&rdquo; ou &ldquo;Nitro Academy&rdquo;.
          </p>
          <p className="mb-8">
            Ao acessar ou utilizar a Plataforma, você concorda com os termos
            aqui descritos. Se você não concordar com qualquer parte deste
            Termo, por favor, não utilize a Nitro Academy.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. OBJETO</h2>
          <p className="mb-4">
            A Nitro Academy é uma plataforma online de intermediação entre
            professores independentes e clientes responsáveis por menores de
            idade, com foco em cursos educacionais destinados a crianças e
            adolescentes, geralmente com idade entre 12 e 17 anos.
          </p>
          <p className="mb-8">
            A Digniti Ltda não é autora, produtora ou responsável pelo conteúdo
            dos cursos oferecidos, sendo sua função exclusivamente facilitar o
            acesso e a transação entre as partes.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. CADASTRO E CONTA</h2>
          <p className="mb-4">
            2.1. Apenas maiores de 18 anos, pais ou responsáveis legais, podem
            contratar cursos para menores.
          </p>
          <p className="mb-4">
            2.2. O uso da plataforma por menores de idade é permitido somente
            com supervisão e consentimento expresso dos responsáveis legais.
          </p>
          <p className="mb-8">
            2.3. O responsável legal se compromete a fornecer informações
            corretas, completas e atualizadas durante o cadastro.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. CURSOS E CONTEÚDO</h2>
          <p className="mb-4">
            3.1. Os cursos são elaborados por professores independentes, que têm
            total responsabilidade pelo conteúdo, métodos, materiais didáticos,
            linguagem e qualidade das aulas.
          </p>
          <p className="mb-4">
            3.2. A Nitro Academy não se responsabiliza por danos, prejuízos ou
            insatisfações causadas pelo conteúdo dos cursos.
          </p>
          <p className="mb-8">
            3.3. A Plataforma pode realizar uma curadoria básica para garantir
            que os cursos estejam em conformidade com suas diretrizes de
            comunidade, mas não garante a veracidade, adequação pedagógica ou
            resultados de qualquer curso.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            4. PAGAMENTOS E GARANTIA DE SATISFAÇÃO
          </h2>
          <p className="mb-4">
            4.1. O pagamento dos cursos é feito diretamente pela plataforma,
            utilizando os meios de pagamento disponíveis no momento da compra.
          </p>
          <p className="mb-4">
            4.2. A Nitro Academy oferece uma garantia de satisfação de 30 dias,
            contados a partir da data de confirmação da compra. Caso o cliente
            não esteja satisfeito, poderá solicitar o reembolso integral do
            valor pago.
          </p>
          <p className="mb-4">4.3. O reembolso está condicionado a:</p>
          <ul className="list-disc pl-8 mb-8">
            <li>Solicitação dentro do prazo de 30 dias;</li>
            <li>Curso não ter sido integralmente concluído;</li>
            <li>Pedido ser feito via canal oficial de atendimento.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            5. CONDUTA DOS USUÁRIOS
          </h2>
          <p className="mb-4">5.1. É proibido aos usuários:</p>
          <ul className="list-disc pl-8 mb-4">
            <li>Utilizar linguagem ofensiva ou discriminatória;</li>
            <li>Compartilhar conteúdos que violem direitos autorais;</li>
            <li>Gravar ou redistribuir as aulas sem autorização;</li>
            <li>Ceder ou compartilhar contas com terceiros.</li>
          </ul>
          <p className="mb-8">
            5.2. O descumprimento das regras poderá resultar em suspensão ou
            exclusão da conta, sem reembolso.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            6. PRIVACIDADE E PROTEÇÃO DE DADOS
          </h2>
          <p className="mb-4">
            6.1. Os dados fornecidos serão tratados de acordo com a nossa
            Política de Privacidade, em conformidade com legislações como LGPD
            (Brasil), GDPR (Europa), COPPA (EUA), no que couber.
          </p>
          <p className="mb-8">
            6.2. O responsável legal autoriza a coleta e o tratamento de dados
            do menor para fins de acesso aos cursos e suporte.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            7. LIMITAÇÃO DE RESPONSABILIDADE
          </h2>
          <p className="mb-4">
            7.1. A Nitro Academy não se responsabiliza por:
          </p>
          <ul className="list-disc pl-8 mb-8">
            <li>Resultados ou expectativas em relação ao aprendizado;</li>
            <li>Interações entre alunos e professores;</li>
            <li>Eventuais erros ou omissões nos cursos;</li>
            <li>
              Perdas decorrentes de falhas técnicas, interrupções ou
              indisponibilidade da plataforma.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            8. CANCELAMENTO E RESCISÃO
          </h2>
          <p className="mb-4">
            8.1. O cliente poderá cancelar sua conta a qualquer momento,
            mediante solicitação via suporte.
          </p>
          <p className="mb-8">
            8.2. A Plataforma poderá suspender ou excluir contas em casos de
            violação deste Termo.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            9. LEGISLAÇÃO APLICÁVEL E FORO
          </h2>
          <p className="mb-4">
            9.1. Este Termo será regido pelas leis da República Federativa do
            Brasil.
          </p>
          <p className="mb-8">
            9.2. Fica eleito o foro da Comarca de São Paulo/SP, Brasil, para
            dirimir quaisquer controvérsias, salvo disposição legal obrigatória
            em contrário no país do usuário.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            10. ALTERAÇÕES DO TERMO
          </h2>
          <p className="mb-4">
            10.1. A Nitro Academy poderá alterar este Termo a qualquer momento.
          </p>
          <p className="mb-8">
            10.2. Os usuários serão notificados por e-mail ou pela própria
            plataforma, e a continuidade do uso representa a aceitação das
            alterações.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">11. CONTATO</h2>
          <p className="mb-8">
            Para dúvidas, suporte ou solicitações, entre em contato com nossa
            equipe pelo e-mail: barbara@nitro.academy
          </p>

          <h1 className="text-4xl font-bold mt-16 mb-8">
            Política de Privacidade da Nitro Academy
          </h1>
          <p className="text-lg mb-8">Última atualização: 7 de Abril de 2025</p>

          <p className="mb-8">
            A presente Política de Privacidade tem como objetivo demonstrar o
            compromisso da Nitro Academy, operada pela empresa Digniti Ltda, com
            a privacidade e a proteção dos dados pessoais de seus usuários, em
            especial de menores de idade, conforme as legislações aplicáveis:
            Lei Geral de Proteção de Dados (LGPD – Brasil), General Data
            Protection Regulation (GDPR – Europa), Children&apos;s Online
            Privacy Protection Act (COPPA – EUA), entre outras normas
            internacionais de proteção de dados.
          </p>
          <p className="mb-8">
            Ao utilizar nossa plataforma, você concorda com os termos desta
            Política.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Quem Somos</h2>
          <p className="mb-4">
            A Nitro Academy é uma plataforma online que conecta professores
            independentes a clientes (responsáveis legais) que contratam cursos
            educacionais para adolescentes e crianças.
          </p>
          <p className="mb-4">
            Razão Social: Digniti Ltda
            <br />
            Sede: Estrada de São Mateus KM7, 01 Bairro: Distrito de São Mateus
            Camanducaia-MG
            <br />
            CNPJ: 45.506.720/0001-61
            <br />
            Contato: barbara@nitro.academy
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Dados Coletados</h2>
          <p className="mb-4">Coletamos os seguintes tipos de dados:</p>

          <h3 className="text-xl font-bold mt-4 mb-2">
            a. Dados do Responsável Legal
          </h3>
          <ul className="list-disc pl-8 mb-4">
            <li>Nome completo</li>
            <li>E-mail</li>
            <li>Número de telefone</li>
            <li>País e cidade</li>
            <li>Informações de pagamento</li>
          </ul>

          <h3 className="text-xl font-bold mt-4 mb-2">
            b. Dados do Aluno (menor de idade)
          </h3>
          <ul className="list-disc pl-8 mb-4">
            <li>Nome</li>
            <li>Idade</li>
            <li>Gênero (opcional)</li>
            <li>Progresso e participação nos cursos</li>
          </ul>

          <h3 className="text-xl font-bold mt-4 mb-2">c. Dados de Navegação</h3>
          <ul className="list-disc pl-8 mb-8">
            <li>Endereço IP</li>
            <li>Geolocalização aproximada</li>
            <li>Dispositivo e navegador utilizado</li>
            <li>Cookies e preferências de uso</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            3. Finalidade do Uso dos Dados
          </h2>
          <p className="mb-4">Utilizamos os dados para:</p>
          <ul className="list-disc pl-8 mb-8">
            <li>Criar e manter contas de usuários;</li>
            <li>Permitir o acesso aos cursos;</li>
            <li>Realizar cobranças e processar pagamentos;</li>
            <li>Oferecer suporte e comunicação;</li>
            <li>Enviar atualizações e informações relevantes;</li>
            <li>Melhorar a experiência da plataforma;</li>
            <li>Cumprir obrigações legais.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            4. Consentimento Parental
          </h2>
          <p className="mb-8">
            Em conformidade com leis como a COPPA e a LGPD, dados de menores de
            idade são coletados apenas com o consentimento explícito dos pais ou
            responsáveis legais.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            5. Compartilhamento de Dados
          </h2>
          <p className="mb-4">Seus dados não são vendidos a terceiros.</p>
          <p className="mb-4">Podemos compartilhá-los com:</p>
          <ul className="list-disc pl-8 mb-8">
            <li>
              Prestadores de serviço essenciais (meios de pagamento, hospedagem,
              suporte);
            </li>
            <li>Autoridades legais, mediante solicitação judicial;</li>
            <li>
              Professores, limitados apenas ao necessário para acompanhar o
              progresso dos alunos.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            6. Armazenamento e Segurança dos Dados
          </h2>
          <p className="mb-4">
            Adotamos medidas técnicas e organizacionais adequadas para proteger
            os dados, incluindo:
          </p>
          <ul className="list-disc pl-8 mb-4">
            <li>Criptografia em repouso e em trânsito;</li>
            <li>Acesso restrito a colaboradores autorizados;</li>
            <li>Monitoramento contínuo de segurança.</li>
          </ul>
          <p className="mb-8">
            Os dados são armazenados em servidores seguros localizados no
            [Brasil/países com legislação equivalente em proteção de dados].
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            7. Direitos dos Usuários
          </h2>
          <p className="mb-4">Você pode, a qualquer momento:</p>
          <ul className="list-disc pl-8 mb-4">
            <li>Acessar os dados que temos sobre você e seu filho(a);</li>
            <li>Corrigir informações incorretas;</li>
            <li>
              Solicitar a exclusão de dados (quando permitido legalmente);
            </li>
            <li>Revogar o consentimento de uso;</li>
            <li>Solicitar portabilidade dos dados.</li>
          </ul>
          <p className="mb-8">
            Para exercer esses direitos, entre em contato pelo e-mail:
            barbara@nitro.academy
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            8. Cookies e Tecnologias de Rastreamento
          </h2>
          <p className="mb-8">
            Utilizamos cookies e tecnologias semelhantes para melhorar a
            navegação e personalizar conteúdos. Você pode configurar seu
            navegador para recusar cookies, mas isso pode limitar algumas
            funcionalidades da plataforma.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            9. Transferência Internacional de Dados
          </h2>
          <p className="mb-8">
            Como operamos globalmente, seus dados poderão ser transferidos e
            armazenados em servidores fora do seu país de residência, sempre em
            conformidade com as legislações de proteção de dados aplicáveis.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            10. Alterações nesta Política
          </h2>
          <p className="mb-8">
            Podemos atualizar esta Política de tempos em tempos. Em caso de
            mudanças relevantes, notificaremos os usuários cadastrados por
            e-mail ou pela própria plataforma.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            11. Dúvidas e Contato
          </h2>
          <p className="mb-8">
            Em caso de dúvidas sobre esta Política de Privacidade ou sobre o
            tratamento de seus dados, entre em contato com nosso Encarregado de
            Proteção de Dados (DPO):
          </p>
          <p className="mb-8">E-mail: barbara@nitro.academy</p>
        </div>
      </div>
    </div>
  );
}
