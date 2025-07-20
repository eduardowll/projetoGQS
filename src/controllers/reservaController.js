const Reserva = require('../models/Reserva');
const Cliente = require('../models/Cliente');

class ReservaController {
    static async create(req, res) {
        try {
            const { cliente_id, data_reserva, hora_reserva, numero_pessoas, observacoes, status } = req.body;

            if (!cliente_id || !data_reserva || !hora_reserva || !numero_pessoas) {
                return res.status(400).json({
                    error: 'Cliente, data, hora e número de pessoas são obrigatórios'
                });
            }

            if (isNaN(cliente_id) || cliente_id <= 0) {
                return res.status(400).json({
                    error: 'ID do cliente inválido'
                });
            }

            if (isNaN(numero_pessoas) || numero_pessoas <= 0) {
                return res.status(400).json({
                    error: 'Número de pessoas deve ser maior que zero'
                });
            }

            const cliente = await Cliente.findById(cliente_id);
            if (!cliente) {
                return res.status(400).json({
                    error: 'Cliente não encontrado'
                });
            }

            const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dataRegex.test(data_reserva)) {
                return res.status(400).json({
                    error: 'Data deve estar no formato YYYY-MM-DD'
                });
            }

            const horaRegex = /^\d{2}:\d{2}$/;
            if (!horaRegex.test(hora_reserva)) {
                return res.status(400).json({
                    error: 'Hora deve estar no formato HH:MM'
                });
            }

            const dataReserva = new Date(data_reserva);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            if (dataReserva < hoje) {
                return res.status(400).json({
                    error: 'Data da reserva não pode ser no passado'
                });
            }

            const reserva = await Reserva.create({
                cliente_id,
                data_reserva,
                hora_reserva,
                numero_pessoas,
                observacoes,
                status: status || 'ativa'
            });

            res.status(201).json({
                message: 'Reserva criada com sucesso',
                data: reserva
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
            const reservas = await Reserva.findAll();
            res.status(200).json({
                message: 'Reservas encontradas',
                data: reservas
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

            const reserva = await Reserva.findById(id);
            if (!reserva) {
                return res.status(404).json({
                    error: 'Reserva não encontrada'
                });
            }

            res.status(200).json({
                message: 'Reserva encontrada',
                data: reserva
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
            const { cliente_id, data_reserva, hora_reserva, numero_pessoas, observacoes, status } = req.body;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    error: 'ID inválido'
                });
            }

            if (!cliente_id || !data_reserva || !hora_reserva || !numero_pessoas) {
                return res.status(400).json({
                    error: 'Cliente, data, hora e número de pessoas são obrigatórios'
                });
            }

            if (isNaN(cliente_id) || cliente_id <= 0) {
                return res.status(400).json({
                    error: 'ID do cliente inválido'
                });
            }

            if (isNaN(numero_pessoas) || numero_pessoas <= 0) {
                return res.status(400).json({
                    error: 'Número de pessoas deve ser maior que zero'
                });
            }

            const existingReserva = await Reserva.findById(id);
            if (!existingReserva) {
                return res.status(404).json({
                    error: 'Reserva não encontrada'
                });
            }

            const cliente = await Cliente.findById(cliente_id);
            if (!cliente) {
                return res.status(400).json({
                    error: 'Cliente não encontrado'
                });
            }

            const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dataRegex.test(data_reserva)) {
                return res.status(400).json({
                    error: 'Data deve estar no formato YYYY-MM-DD'
                });
            }

            const horaRegex = /^\d{2}:\d{2}$/;
            if (!horaRegex.test(hora_reserva)) {
                return res.status(400).json({
                    error: 'Hora deve estar no formato HH:MM'
                });
            }

            const reserva = await Reserva.update(id, {
                cliente_id,
                data_reserva,
                hora_reserva,
                numero_pessoas,
                observacoes,
                status: status || 'ativa'
            });

            if (reserva.changes === 0) {
                return res.status(404).json({
                    error: 'Reserva não encontrada'
                });
            }

            res.status(200).json({
                message: 'Reserva atualizada com sucesso',
                data: reserva
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

            const existingReserva = await Reserva.findById(id);
            if (!existingReserva) {
                return res.status(404).json({
                    error: 'Reserva não encontrada'
                });
            }

            const result = await Reserva.delete(id);
            if (result.changes === 0) {
                return res.status(404).json({
                    error: 'Reserva não encontrada'
                });
            }

            res.status(200).json({
                message: 'Reserva deletada com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                error: 'Erro interno do servidor',
                details: error.message
            });
        }
    }
}

module.exports = ReservaController;

