const mongoose = require('mongoose');

const CmsDataSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'main' },
    destinations: { type: [mongoose.Schema.Types.Mixed], default: [] },
    homePage: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CmsData', CmsDataSchema);
