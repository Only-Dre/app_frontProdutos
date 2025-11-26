package api;

import static spark.Spark.*;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Filter;
import dao.CategoriaDAO;
import dao.ProdutoDAO;
import model.Categoria;
import model.Produto;

import com.google.gson.Gson;

public class ApiProduto {

    // instancia do DAO e o GSON
    private static final ProdutoDAO dao = new ProdutoDAO();
    private static final CategoriaDAO categoriaDAO = new CategoriaDAO();
    private static final Gson gson = new Gson();

    // constante para garantir que todas as respostas sejam JSON
    private static final String APPLICATION_JSON = "application/json";

    public static void main(String[] args) {

        // configuração do Servidor
        port(4567); 

        options("/*", 
            (request, response) -> {
                
                String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
                if (accessControlRequestHeaders != null) {
                    response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
                }

                String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
                if (accessControlRequestMethod != null) {
                    response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
                }

                return "OK";
            });

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*"); 
            response.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept"); 
            response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.type("application/json"); 
        });

        // filtro para definir o tipo de conteúdo como JSON
        after(new Filter() {
            @Override
            public void handle(Request request, Response response) {
                response.type(APPLICATION_JSON);
            }
        });

        // GET /produtos - Buscar todos
        get("/produtos", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                return gson.toJson(dao.buscarTodos());
            }
        });

        // GET /produtos/:id - Buscar por ID
        get("/produtos/:id", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                try {
                    // converter o parâmetro da URL (String) para Long, que é o tipo do ID
                    Long id = Long.parseLong(request.params(":id"));

                    Produto produto = dao.buscarPorId(id); // Usa o Long ID

                    if (produto != null) {
                        return gson.toJson(produto);
                    } else {
                        response.status(404); // Not Found
                        return "{\"mensagem\": \"Produto com ID " + id + " não encontrado\"}";
                    }
                } catch (NumberFormatException e) {
                    response.status(400); // Bad Request
                    return "{\"mensagem\": \"Formato de ID inválido.\"}";
                }
            }
        });

        // POST /produtos - Criar novo produto
        post("/produtos", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                try {
                    Produto novoProduto = gson.fromJson(request.body(), Produto.class);
                    dao.inserir(novoProduto);

                    response.status(201); // Created
                    return gson.toJson(novoProduto);
                } catch (Exception e) {
                    response.status(500);
                    System.err.println("Erro ao processar requisição POST: " + e.getMessage());
                    e.printStackTrace();
                    return "{\"mensagem\": \"Erro ao criar produto.\"}";
                }
            }
        });

        // PUT /produtos/:id - Atualizar produto existente
        put("/produtos/:id", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                try {
                    Long id = Long.parseLong(request.params(":id")); // Usa Long

                    if (dao.buscarPorId(id) == null) {
                        response.status(404);
                        return "{\"mensagem\": \"Produto não encontrado para atualização.\"}";
                    }

                    Produto produtoParaAtualizar = gson.fromJson(request.body(), Produto.class);
                    produtoParaAtualizar.setId(id); // garante que o ID da URL seja usado

                    dao.atualizar(produtoParaAtualizar);

                    response.status(200); // OK
                    return gson.toJson(produtoParaAtualizar);

                } catch (NumberFormatException e) {
                    response.status(400); // Bad Request
                    return "{\"mensagem\": \"Formato de ID inválido.\"}";
                } catch (Exception e) {
                    response.status(500);
                    System.err.println("Erro ao processar requisição PUT: " + e.getMessage());
                    e.printStackTrace();
                    return "{\"mensagem\": \"Erro ao atualizar produto.\"}";
                }
            }
        });

        // DELETE /produtos/:id - Deletar um produto
        delete("/produtos/:id", new Route() {
            @Override
            public Object handle(Request request, Response response) {
                try {
                    Long id = Long.parseLong(request.params(":id")); // Usa Long

                    if (dao.buscarPorId(id) == null) {
                        response.status(404);
                        return "{\"mensagem\": \"Produto não encontrado para exclusão.\"}";
                    }

                    dao.deletar(id); // Usa o Long ID

                    response.status(204); // No Content
                    return ""; // Corpo vazio

                } catch (NumberFormatException e) {
                    response.status(400);
                    return "{\"mensagem\": \"Formato de ID inválido.\"}";
                }
            }
        });

        // get categorias
        get("/categorias", (request, response) -> gson.toJson(categoriaDAO.buscarTodos()));

        // GET /categorias/:id - Buscar por ID
        get("/categorias/:id", (Request request, Response response) -> {
            try {
                Long id = Long.parseLong(request.params(":id"));

                Categoria categoria = categoriaDAO.buscarPorId(id);

                if (categoria != null) {
                    return gson.toJson(categoria);
                } else {
                    response.status(404);
                    return "{\"mensagem\": \"categoria com ID " + id + " não encontrado\"}";
                }
            } catch (NumberFormatException e) {
                response.status(400);
                return "{\"mensagem\": \"Formato de ID inválido.\"}";
            }
        });

        // POST /categorias - Criar nova categoria
        post("/categorias", (request, response) -> {
            try {
                Categoria novaCategoria = gson.fromJson(request.body(), Categoria.class);
                categoriaDAO.inserir(novaCategoria);

                response.status(201); // Created
                return gson.toJson(novaCategoria);
            } catch (Exception e) {
                response.status(500);
                System.err.println("Erro ao processar requisição POST: " + e.getMessage());
                e.printStackTrace();
                return "{\"mensagem\": \"Erro ao criar categoria.\"}";
            }
        });

        // PUT /categorias/:id - Atualizar produto existente
        put("/categorias/:id", (request, response) -> {
            try {
                Long id = Long.parseLong(request.params(":id")); // Usa Long

                if (categoriaDAO.buscarPorId(id) == null) {
                    response.status(404);
                    return "{\"mensagem\": \"Categoria não encontrada para atualização.\"}";
                }

                Categoria categoriaParaAtualizar = gson.fromJson(request.body(), Categoria.class);
                categoriaParaAtualizar.setId(id); // garante que o ID da URL seja usado

                categoriaDAO.atualizar(categoriaParaAtualizar);

                response.status(200); // OK
                return gson.toJson(categoriaParaAtualizar);

            } catch (NumberFormatException e) {
                response.status(400); // Bad Request
                return "{\"mensagem\": \"Formato de ID inválido.\"}";
            } catch (Exception e) {
                response.status(500);
                System.err.println("Erro ao processar requisição PUT: " + e.getMessage());
                e.printStackTrace();
                return "{\"mensagem\": \"Erro ao atualizar Categoria.\"}";
            }
        });

        // DELETE /categorias/:id - Deletar uma categoria
        delete("/categorias/:id", (request, response) -> {
            try {
                Long id = Long.parseLong(request.params(":id")); // Usa Long

                if (categoriaDAO.buscarPorId(id) == null) {
                    response.status(404);
                    return "{\"mensagem\": \"Categoria não encontrada para exclusão.\"}";
                }

                categoriaDAO.deletar(id);

                response.status(204);
                return "";

            } catch (NumberFormatException e) {
                response.status(400);
                return "{\"mensagem\": \"Formato de ID inválido.\"}";
            } catch (Exception e) {
                //Pega a causa da exceção, que no caso é violação da chave estrangeira
                if(e.getCause() instanceof java.sql.SQLIntegrityConstraintViolationException) {
                    response.status(409);
                    return "{\"mensagem\": \"Não é possível excluir uma categoria usada por mais produtos.\"}";
                }
            }

            response.status(500);
            return "{\"mensagem\": \"Erro ao deletar categoria.\"}";
        });

        System.out.println("API de Produtos iniciada na porta 4567. Acesse: http://localhost:4567/produtos");
    }
}