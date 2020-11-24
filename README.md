# Microsservices Logs Management

Aplicação para extrair informaçõs de logs de um ecossistema de microsserviços open-source denominado [online boutique](https://github.com/GoogleCloudPlatform/microservices-demo). O projeto visa o desenvolvimento de competencias técnicas relacionadas ao gerenciamento de logs em aplicações distribuídas, bem como estimular a criatividade na extração de informações a partir de dados não estruturados com o objetivo de obter insights de negócio.

## Arquitetura do projeto

O ecossistema de microserviços do online boutique foi hospedado em um serviço de gerenciamento de kubernets no google cloud (GKE).

Dentro do cluster criado, foi incluído um pod do kubectl, que é uma aplicação responsável por ler o terminal de outputs (stderr) das outras aplicações do cluster.
Dessa forma, todos os logs gerados pelos componentes da arquitetura são capturados.
