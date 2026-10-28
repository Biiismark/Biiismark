# MarkFit — aplicativo pessoal de treinos

Versão adaptada do projeto livre NoBS, com interface PWA mobile-first, treinos, histórico, recordes e uma biblioteca pesquisável de vídeos públicos de Isabella Duarte Personal Online.

## Base e licença

O código é adaptado de [NoBS — Workout Log](https://github.com/Defcons/no-bs), distribuído sob **GNU AGPL-3.0**. O arquivo LICENSE mantém a licença original. Modificações MarkFit e os arquivos de catálogo novos também estão sob AGPL-3.0. O MarkFit não é afiliado ao autor do projeto-base, à Isabella Duarte ou ao YouTube.

Código-fonte: https://github.com/Biiismark/Biiismark/tree/main/markfit

## Executar localmente

Requisitos: Node.js 22 ou superior.

~~~bash
npm install
npm run dev
npm run build
~~~

## Catálogo Isabella

A coleta usa yt-dlp para consultar metadados públicos das abas de vídeos, Shorts e transmissões. Não baixa arquivos de vídeo e não precisa de chave da API oficial do YouTube. O workflow .github/workflows/markfit-catalog.yml atualiza o JSON semanalmente e também pode ser iniciado manualmente em GitHub Actions.

Os registros incluem título, URL, data/duração quando disponível, miniatura e categoria preliminar estimada por palavras do título. A classificação pode errar e não é uma avaliação médica nem substitui a orientação profissional.

A extração depende do funcionamento atual do YouTube e do yt-dlp. Em caso de bloqueio ou mudança da plataforma, a ação pode falhar; se nenhuma entrada for coletada, o arquivo anterior é preservado. A reprodução ocorre no player incorporado do YouTube; vídeos e miniaturas continuam hospedados no YouTube.

## Privacidade e custos

O histórico de treinos permanece no armazenamento local do navegador na configuração padrão. O coletor roda com GitHub Actions e usa software livre; não há chave de API paga nem serviço de IA cobrado configurado. GitHub Actions e YouTube têm limites de utilização e a coleta pode falhar temporariamente.

## Recursos MarkFit

- PWA mobile-first com tema escuro e gráficos de treino.
- Rotinas, séries, cargas, tempo de descanso, histórico e recordes.
- Área Vídeos com pesquisa, filtros, categorias estimadas e player incorporado.
- Catálogo automático de metadados públicos, sem download de vídeos.

## Atribuição

Preserve este arquivo, a licença e os créditos em redistribuições. A AGPL-3.0 exige disponibilizar o código-fonte da versão modificada quando ela é oferecida como serviço pela rede.
