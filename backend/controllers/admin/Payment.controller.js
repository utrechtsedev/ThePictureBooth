const { models } = require('../../models/index')

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await models.Payment.findAll();
        res.json(payments);
    } catch (error) {
        res.status(500).json({error: "Kon betalingen niet ophalen"})
    }
};

exports.getOnePayment = async(req, res) => {
    try {
        const payment = await models.Payment.findOne({where: {id: req.params.id}})
        if (!payment) {
            return res.status(404).json({error: "Kon betaling niet ophalen"})
        }
        res.json({payment})
    } catch (error) {
        return res.status(500).json({error: "Kon betaling niet ophalen"})
    }
};

exports.createPayment = async (req, res) => {
    try {
        const payment = await models.Payment.create(req.body);
        res.status(201).json(payment);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
};

exports.modifyPayment = async (req, res) => {
    try {
        const [rowsUpdated] = await models.Payment.update(req.body, {
          where: { id: req.body.id }
        });
        if (rowsUpdated === 0) {
          return res.status(404).json({ error: 'Payment niet geüpdate' });
        }
        const updatedPayment = await models.Payment.findOne({where: {id: req.body.id}});
        res.json(updatedPayment);
      } catch (err) {
        res.status(400).json({ error: "Kon betaling niet ophalen" });
      }
};

exports.deletePayment = async (req, res) => {
    try {
        const payment = await models.Payment.findOne({where: {id: req.body.id}});
        if (!payment) {
            return res.status(404).json({error: "Kon betaling niet ophalen"})
        };
        await payment.destroy();
        res.json({success: true})
    } catch (error) {
        res.status(500).json({error: "Kon betaling niet verwijderen"});
    }
};