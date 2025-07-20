const db = require('../database/database');

class Reserva {
    constructor(cliente_id, data_reserva, hora_reserva, numero_pessoas, observacoes, status = 'ativa') {
        this.cliente_id = cliente_id;
        this.data_reserva = data_reserva;
        this.hora_reserva = hora_reserva;
        this.numero_pessoas = numero_pessoas;
        this.observacoes = observacoes;
        this.status = status;
    }

    static create(reservaData) {
        return new Promise((resolve, reject) => {
            const { cliente_id, data_reserva, hora_reserva, numero_pessoas, observacoes, status } = reservaData;
            const sql = `INSERT INTO reservas (cliente_id, data_reserva, hora_reserva, numero_pessoas, observacoes, status) VALUES (?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [cliente_id, data_reserva, hora_reserva, numero_pessoas, observacoes, status || 'ativa'], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...reservaData });
                }
            });
        });
    }

    static findAll() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT r.*, c.nome as cliente_nome, c.email as cliente_email 
                FROM reservas r 
                LEFT JOIN clientes c ON r.cliente_id = c.id 
                ORDER BY r.data_reserva DESC, r.hora_reserva DESC
            `;
            
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT r.*, c.nome as cliente_nome, c.email as cliente_email 
                FROM reservas r 
                LEFT JOIN clientes c ON r.cliente_id = c.id 
                WHERE r.id = ?
            `;
            
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    static update(id, reservaData) {
        return new Promise((resolve, reject) => {
            const { cliente_id, data_reserva, hora_reserva, numero_pessoas, observacoes, status } = reservaData;
            const sql = `UPDATE reservas SET cliente_id = ?, data_reserva = ?, hora_reserva = ?, numero_pessoas = ?, observacoes = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
            
            db.run(sql, [cliente_id, data_reserva, hora_reserva, numero_pessoas, observacoes, status, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, ...reservaData, changes: this.changes });
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM reservas WHERE id = ?`;
            
            db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, changes: this.changes });
                }
            });
        });
    }

    static findByClienteId(cliente_id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT r.*, c.nome as cliente_nome, c.email as cliente_email 
                FROM reservas r 
                LEFT JOIN clientes c ON r.cliente_id = c.id 
                WHERE r.cliente_id = ? 
                ORDER BY r.data_reserva DESC, r.hora_reserva DESC
            `;
            
            db.all(sql, [cliente_id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static findByStatus(status) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT r.*, c.nome as cliente_nome, c.email as cliente_email 
                FROM reservas r 
                LEFT JOIN clientes c ON r.cliente_id = c.id 
                WHERE r.status = ? 
                ORDER BY r.data_reserva DESC, r.hora_reserva DESC
            `;
            
            db.all(sql, [status], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = Reserva;

