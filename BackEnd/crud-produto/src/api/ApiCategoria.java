package api;

import static spark.Spark.*;

import com.google.gson.Gson;
import dao.CategoriaDAO;
import model.Categoria;

public class ApiCategoria {

    private static final CategoriaDAO categoriaDAO = new CategoriaDAO();
    private static final Gson gson = new Gson();

    public static void registrarRotas() {

        // LISTAR TODAS
        get("/categorias", (req, res) -> {
            res.type("application/json");
            return gson.toJson(categoriaDAO.buscarTodos());
        });

        // BUSCAR POR ID
        get("/categorias/:id", (req, res) -> {
            res.type("application/json");
            Long id = Long.parseLong(req.params(":id"));
            return gson.toJson(categoriaDAO.buscarPorId(id));
        });

        // CRIAR
        post("/categorias", (req, res) -> {
            res.type("application/json");
            Categoria c = gson.fromJson(req.body(), Categoria.class);
            categoriaDAO.inserir(c);
            return gson.toJson(c);
        });

        // ATUALIZAR
        put("/categorias/:id", (req, res) -> {
            res.type("application/json");
            Long id = Long.parseLong(req.params(":id"));
            Categoria c = gson.fromJson(req.body(), Categoria.class);
            c.setId(id);
            categoriaDAO.atualizar(c);
            return gson.toJson(c);
        });

        // DELETAR
        delete("/categorias/:id", (req, res) -> {
            res.type("application/json");
            Long id = Long.parseLong(req.params(":id"));
            categoriaDAO.deletar(id);
            return "{}";
        });
    }
}
