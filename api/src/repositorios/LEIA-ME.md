# Camada de repositórios

Todo o SQL do sistema vive aqui. Um módulo por agregado.

Duas regras valem para qualquer arquivo desta pasta:

1. **Repositório não conhece regra de negócio.** Ele não decide se um cuidador
   pode ser removido nem se um plantão pode mudar de estado. Ele lê e escreve.
2. **Repositório não lança `AppError` e não conhece HTTP.** Quando não encontra,
   devolve `undefined`. Transformar ausência em 404 é decisão do serviço, porque
   "não encontrado" é resposta de aplicação, não de armazenamento.

O caminho de uma requisição é sempre o mesmo:

```
rotas/  →  serviços/  →  repositórios/  →  banco
   ↑          ↑              ↑
 HTTP      regras          SQL
```

É isso que torna reversível a escolha de SQLite do ADR-09: trocar de banco mexe
nesta pasta, e os testes das regras continuam valendo sem alteração.
