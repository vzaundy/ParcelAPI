const db = require('./db');

// CREATE - Add a new customer
exports.createCustomer = (req, res) => {
    const { Name, Address, DeliveryCharge, PostPaidCustomer, ContactNumber, CustomerLocation } = req.body;

    const query = `INSERT INTO Customer (Name, Address, DeliveryCharge, PostPaidCustomer, ContactNumber, CustomerLocation) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [Name, Address, DeliveryCharge, PostPaidCustomer, ContactNumber, CustomerLocation], function(err) {
        if (err) {
            return res.status(500).json({ message: "Error adding customer", error: err.message });
        }
        res.status(201).json({ message: "Customer created", id: this.lastID });
    });
};

// READ - Get all customers
exports.getAllCustomers = (req, res) => {
    const query = "SELECT * FROM Customer";
    
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching customers", error: err.message });
        }
        res.status(200).json(rows);
    });
};

// READ - Get a customer by ID
exports.getCustomerById = (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM Customer WHERE Id = ?";
    
    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching customer", error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(row);
    });
};

// UPDATE - Update an existing customer
exports.updateCustomer = (req, res) => {
    const { id } = req.params;
    const { Name, Address, DeliveryCharge, PostPaidCustomer, ContactNumber, CustomerLocation } = req.body;

    const query = `UPDATE Customer SET 
                   Name = ?, Address = ?, DeliveryCharge = ?, PostPaidCustomer = ?, 
                   ContactNumber = ?, CustomerLocation = ? WHERE Id = ?`;

    db.run(query, [Name, Address, DeliveryCharge, PostPaidCustomer, ContactNumber, CustomerLocation, id], function(err) {
        if (err) {
            return res.status(500).json({ message: "Error updating customer", error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json({ message: "Customer updated" });
    });
};

// DELETE - Delete a customer
exports.deleteCustomer = (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM Customer WHERE Id = ?";
    
    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).json({ message: "Error deleting customer", error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json({ message: "Customer deleted" });
    });
};