const db = require("../models");
const axios = require("axios");
const validateAnnouncementInput = require("../validation/announcement");

// Defining methods for the booksController
module.exports = {
    create: function(req, res) {
        console.log(req.body)
        const { errors, isValid } = validateAnnouncementInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
        db.Announcement
          .create({ announcement: req.body.announcement, user:req.body.user })
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err));
      
    },
    findAll: function(req, res) {
        db.Announcement
          .find(req.query)
          .sort({ createdAt: 'desc' })
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err));
    },
    remove: function(req, res) {
        db.Announcement
          .findById({ _id: req.params.id })
          .then(dbModel => dbModel.remove())
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err));
    }
}