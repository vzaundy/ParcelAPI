const db = require('./db');

// CREATE - Add a new menu item
exports.createMenu = (req, res) => {
    const { Name, Rate, PartnerRate, Unit, GroupId, IsAvailable, Code, SortOrder } = req.body;

    const query = `INSERT INTO Menu (Name, Rate, PartnerRate, Unit, GroupId, IsAvailable, Code, SortOrder) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [Name, Rate, PartnerRate, Unit, GroupId, IsAvailable, Code, SortOrder], function(err) {
        if (err) {
            return res.status(500).json({ message: "Error adding menu item", error: err.message });
        }
        res.status(201).json({ message: "Menu item created", id: this.lastID });
    });
};

// READ - Get all menu items
exports.getAllMenuItems = (req, res) => {
    const query = "SELECT * FROM Menu";
    
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching menu items", error: err.message });
        }
        res.status(200).json(rows);
    });
};

// READ - Get a menu item by ID
exports.getMenuItemById = (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM Menu WHERE Id = ?";
    
    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching menu item", error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        res.status(200).json(row);
    });
};

// UPDATE - Update an existing menu item
exports.updateMenuItem = (req, res) => {
    const { id } = req.params;
    const { Name, Rate, PartnerRate, Unit, GroupId, IsAvailable, Code, SortOrder } = req.body;

    const query = `UPDATE Menu SET 
                   Name = ?, Rate = ?, PartnerRate = ?, Unit = ?, GroupId = ?, 
                   IsAvailable = ?, Code = ?, SortOrder = ? WHERE Id = ?`;

    db.run(query, [Name, Rate, PartnerRate, Unit, GroupId, IsAvailable, Code, SortOrder, id], function(err) {
        if (err) {
            return res.status(500).json({ message: "Error updating menu item", error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        res.status(200).json({ message: "Menu item updated" });
    });
};

// DELETE - Delete a menu item
exports.deleteMenuItem = (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM Menu WHERE Id = ?";
    
    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).json({ message: "Error deleting menu item", error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        res.status(200).json({ message: "Menu item deleted" });
    });
};