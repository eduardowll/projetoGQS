const Cliente = require('../models/Cliente');

class ClienteController {
    static async create(req, res) {
        try {
            const { nome, email, telefone, endereco } = req.body;

            if (!nome || !email || !telefone) {
                return res.status(400).json({
                    error: 'Nome, email e telefone são obrigatórios'
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    error: 'Email inválido'
                });
            }

            const existingCliente = await Cliente.findByEmail(email);
            if (existingCliente) {
                return res.status(400).json({
                    error: 'Email já cadastrado'
                });
            }

            const cliente = await Cliente.create({ nome, email, telefone, endereco });
            res.status(201).json({
                message: 'Cliente criado com sucesso',
                data: cliente
            });
        } catch (error) {
            res.status(500).json({
                error: 'Erro interno do servidor',
                details: error.message
            });
        }
    }

    static async findAll(req, res) {
        try {
            const clientes = await Cliente.findAll();
            res.status(200).json({
                message: 'Clientes encontrados',
                data: clientes
            });
        } catch (error) {
            res.status(500).json({
                error: 'Erro interno do servidor',
                details: error.message
            });
        }
    }

    static async findById(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    error: 'ID inválido'
                });
            }

            const cliente = await Cliente.findById(id);
            if (!cliente) {
                return res.status(404).json({
                    error: 'Cliente não encontrado'
                });
            }

            res.status(200).json({
                message: 'Cliente encontrado',
                data: cliente
            });
        } catch (error) {
            res.status(500).json({
                error: 'Erro interno do servidor',
                details: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, telefone, endereco } = req.body;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    error: 'ID inválido'
                });
            }

            if (!nome || !email || !telefone) {
                return res.status(400).json({
                    error: 'Nome, email e telefone são obrigatórios'
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    error: 'Email inválido'
                });
            }

            const existingCliente = await Cliente.findById(id);
            if (!existingCliente) {
                return res.status(404).json({
                    error: 'Cliente não encontrado'
                });
            }

            const emailCliente = await Cliente.findByEmail(email);
            if (emailCliente && emailCliente.id != id) {
                return res.status(400).json({
                    error: 'Email já cadastrado para outro cliente'
                });
            }

            const cliente = await Cliente.update(id, { nome, email, telefone, endereco });
            if (cliente.changes === 0) {
                return res.status(404).json({
                    error: 'Cliente não encontrado'
                });
            }

            res.status(200).json({
                message: 'Cliente atualizado com sucesso',
                data: cliente
            });
        } catch (error) {
            res.status(500).json({
                error: 'Erro interno do servidor',
                details: error.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    error: 'ID inválido'
                });
            }

            const existingCliente = await Cliente.findById(id);
            if (!existingCliente) {
                return res.status(404).json({
                    error: 'Cliente não encontrado'
                });
            }

            const result = await Cliente.delete(id);
            if (result.changes === 0) {
                return res.status(404).json({
                    error: 'Cliente não encontrado'
                });
            }

            res.status(200).json({
                message: 'Cliente deletado com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                error: 'Erro interno do servidor',
                details: error.message
            });
        }
    }
}

module.exports = ClienteController;

