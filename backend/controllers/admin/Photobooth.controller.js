const { models } = require('../../models/index')

exports.getAllPhotobooths = async (req, res) => {
    try {
        const photobooths = await models.Photobooth.findAll();
        res.json(photobooths);
    } catch (error) {
        res.status(500).json({error: "Kon photobooths niet ophalen."});
    }
};

exports.getOnePhotobooth = async (req, res) => {
    try {
        const photobooth = await models.Photobooth.findOne({where: {id: req.params.id}})
        if (!photobooth) {
            return res.status(404).json({error: "Kon photobooth niet vinden"})
        }
        res.json({photobooth})
    } catch (error) {
        res.status(500).json({error: "Kon photobooth niet ophalen"})
    }
};

exports.modifyPhotobooth = async (req, res) => {
    try {
        const [rowsUpdated] = await models.Photobooth.update(req.body, {
          where: { id: req.body.id }
        });
        if (rowsUpdated === 0) {
          return res.status(404).json({ error: 'Photobooth niet geüpdate' });
        }
        const updatedPhotobooth = await models.Photobooth.findOne({where: {id: req.body.id}});
        res.json(updatedPhotobooth);
      } catch (err) {
        res.status(400).json({ error: "Kon photobooth niet ophalen" });
      }
}

exports.createPhotobooth = async (req, res) => {
    try {
        const photobooth = await models.Photobooth.create(req.body);
        res.status(201).json(photobooth);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
};

