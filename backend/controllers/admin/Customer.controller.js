const { models } = require('../../models/index')

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await models.Customer.findAll();
        res.json(customers);
      } catch (error) {
        res.status(500).json({ error: "Kan klanten niet ophalen" });
      }
}

exports.getOneCustomer = async (req, res) => {
  try {
    const customer = await models.Customer.findOne({where: {id: req.params.id}})
    res.json(customer)
  } catch (error) {
    res.status(500).json({error: "Kan klant niet ophalen"})
  }
}

exports.createCustomer = async (req, res) => {
    try {
      const customer = await models.Customer.create(req.body);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
}

exports.modifyCustomer = async(req, res) => {
    try {
      const customer = await models.Customer.findOne({where: {id: req.params.id}});
      if (!customer) {
        return res.status(404).json({ error: "Klant niet gevonden" });
      }
      await customer.update(req.body);
      res.json({ message: "Klantgegevens succesvol bijgewerkt", customer });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
}

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({where: {id: req.params.id}});
    if (!customer) {
      return res.status(404).json({ error: "Klant niet gevonden" });
    }

    await customer.destroy();
    res.json({ message: "Klant succesvol verwijderd" });
  } catch (error) {
    res.status(500).json({ error: "Fout bij verwijderen van klant" });
  }
}