# IRON Purple

Aplicativo pessoal de treino, pensado para uso no celular, com foco em hipertrofia de pernas e glúteos, definição de membros superiores, acompanhamento de evolução e recuperação.

## Organização da semana

| Dia | Treino | Objetivo |
| --- | --- | --- |
| Segunda-feira | Quadríceps, glúteos e panturrilhas | Força e volume de pernas |
| Terça-feira | Costas, bíceps e abdômen | Definição de superiores e core |
| Quarta-feira | Posterior, glúteos e panturrilhas | Hipertrofia da cadeia posterior |
| Quinta-feira | Ombros, peito, tríceps e abdômen | Definição e equilíbrio muscular |
| Sexta-feira | Glúteos e pernas completas | Volume, estabilidade e acabamento |
| Sábado | Caminhada, mobilidade e alongamento | Recuperação ativa opcional |
| Domingo | Descanso | Recuperação muscular |

Todos os exercícios incluem séries, repetições, intervalo sugerido, grupo muscular, explicação da execução, alternativas e orientação para progressão da carga. A carga inicial fica zerada para que cada pessoa ajuste ao próprio nível.

## Funcionalidades

- Calendário com os 12 meses de qualquer ano e navegação entre anos.
- Seleção por data, semana, mês e ano, sem depender de julho ou de um ano específico.
- Programa completo de segunda a sexta, sábado opcional e domingo de recuperação.
- Demonstrações animadas, no estilo GIF, com as posições inicial e final de todos os exercícios.
- Movimento mais lento nas demonstrações, para facilitar a observação da execução.
- Validação completa dos 40 exercícios do plano: 37 movimentos únicos, todos com os dois quadros da execução.
- Rodapé integrado ao final da página: não acompanha o scroll e não cobre exercícios ou botões.
- Toque na animação para pausar ou continuar; abra os detalhes para visualizar o movimento em tamanho maior.
- Ilustrações animadas próprias, disponíveis imediatamente e mesmo sem internet.
- Fotos reais carregadas por dois endereços independentes e armazenadas offline após a primeira visualização.
- Carga, repetições e descanso editáveis individualmente em cada série.
- Marcação de séries, conclusão de exercícios e acompanhamento percentual do treino.
- Exercícios concluídos são recolhidos automaticamente e podem ser reabertos com um toque.
- Cronômetro de treino com iniciar, pausar e continuar; o botão de finalizar só é liberado depois que o treino começa.
- Navegação mais clara, com as abas “Treino do dia” e “Treinos”.
- Cronômetro de descanso com opções de 45 segundos a 3 minutos.
- Descanso automático opcional ao concluir uma série.
- Inclusão, edição e remoção de exercícios no treino selecionado.
- Instruções de execução, exercícios alternativos e busca de demonstrações em vídeo.
- Histórico com duração, séries concluídas, volume movimentado e observações.
- Indicadores mensais, gráfico das últimas seis semanas e melhores cargas registradas.
- Controle diário de água e metas pessoais editáveis.
- Backup e restauração do histórico, cargas e configurações em arquivo JSON.
- Migração automática do histórico e das cargas compatíveis da versão anterior.
- Instalação como aplicativo no celular e funcionamento offline após o primeiro acesso.
- Nenhum cadastro, servidor, mensalidade, biblioteca externa ou instalação de dependências.

## IRON Coach — painel do professor

O pacote também inclui a pasta `professor`, com um protótipo navegável do painel profissional. Depois da publicação, ele pode ser aberto em `https://jessicagouveah.github.io/iron-purple/professor/`.

O protótipo inclui visão geral, alunos, avaliações recebidas, confirmação de maioridade, fotos opcionais, biblioteca de exercícios, montagem de treinos e indicadores de evolução. Os dados exibidos são demonstrativos. Fotos selecionadas na prévia não são enviadas nem armazenadas; o uso com dados reais dependerá da conexão segura com login, banco de dados e armazenamento privado.

## Demonstrações dos exercícios

Cada exercício inclui uma ilustração animada própria, carregada junto com o aplicativo e disponível sem depender de conexão externa. Quando houver internet, a ilustração é substituída pelas imagens reais da [Free Exercise DB](https://github.com/yuhonas/free-exercise-db), uma base pública distribuída sob [Unlicense](https://github.com/yuhonas/free-exercise-db/blob/main/LICENSE.md). O aplicativo alterna automaticamente entre as posições inicial e final para reproduzir o movimento continuamente, com efeito visual semelhante a um GIF.

As fotos são solicitadas primeiro a uma CDN e, se ela falhar, diretamente ao repositório de origem. Depois de carregadas, ficam armazenadas no cache e podem continuar disponíveis offline. Caso ambos os endereços estejam indisponíveis, a ilustração do exercício continua animada normalmente. Exercícios personalizados também recebem uma animação quando o nome ou o grupo muscular corresponde a um movimento conhecido.

## Atualizar o GitHub Pages

**Nesta atualização:** envie todos os arquivos do pacote, incluindo a pasta `professor`. O `index.html` continua incluindo o código e o visual completos do aplicativo do aluno. Depois do commit, abra o endereço do aplicativo acrescentando `?v=20260821-coach-1` para evitar a versão antiga guardada pelo navegador.

Para atualizar também os arquivos de suporte e o funcionamento offline:

1. Abra o repositório `iron-purple` no GitHub.
2. Envie ou substitua os dez arquivos do pacote na raiz do repositório e envie também a pasta `professor`, contendo o arquivo `index.html` do painel.
3. Confirme a atualização dos arquivos.
4. Em **Settings > Pages**, mantenha **Deploy from a branch**, a branch `main` e a pasta `/(root)`.
5. Aguarde a publicação e abra novamente o endereço do aplicativo.
6. O HTML identifica a nova versão dos arquivos automaticamente. Se aparecer a versão antiga, abra o endereço com `?v=20260821-coach-1` no final ou atualize com `Ctrl + Shift + R` no computador.

Ao atualizar o mesmo domínio, o aplicativo procura os dados da versão anterior e preserva o histórico disponível. Faça um backup antes de limpar dados do navegador ou trocar de aparelho.

## Instalar no celular

**iPhone:** abra o link no Safari, toque em **Compartilhar** e escolha **Adicionar à Tela de Início**.

**Android:** abra o link no Chrome e toque em **Instalar app** quando a opção aparecer, ou use **Adicionar à tela inicial** no menu do navegador.

## Observações importantes

Os dados ficam salvos apenas no navegador e no aparelho utilizado. Apagar os dados do navegador pode remover o histórico se não houver backup. As sugestões de treino são gerais; ajuste cargas, movimentos e alimentação com profissionais habilitados e interrompa qualquer exercício que cause dor.
