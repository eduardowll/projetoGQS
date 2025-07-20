const db = require('../database/database');

class Cliente {
    constructor(nome, email, telefone, endereco) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.endereco = endereco;
    }

    static create(clienteData) {
        return new Promise((resolve, reject) => {
            const { nome, email, telefone, endereco } = clienteData;
            const sql = `INSERT INTO clientes (nome, email, telefone, endereco) VALUES (?, ?, ?, ?)`;
            
            db.run(sql, [nome, email, telefone, endereco], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...clienteData });
                }
            });
        });
    }

    static findAll() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM clientes ORDER BY created_at DESC`;
            
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
            const sql = `SELECT * FROM clientes WHERE id = ?`;
            
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    static update(id, clienteData) {
        return new Promise((resolve, reject) => {
            const { nome, email, telefone, endereco } = clienteData;
            const sql = `UPDATE clientes SET nome = ?, email = ?, telefone = ?, endereco = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
            
            db.run(sql, [nome, email, telefone, endereco, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, ...clienteData, changes: this.changes });
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM clientes WHERE id = ?`;
            
            db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, changes: this.changes });
                }
            });
        });
    }

    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM clientes WHERE email = ?`;
            
            db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
}

module.exports = Cliente;

