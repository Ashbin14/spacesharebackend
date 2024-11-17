const mongoose = require('mongoose');

const flatSchema=new mongoose.Schema({
    createdby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    Image:{

    },
    bathrooms: {
        type: String,
        required: true,
      },
      bedrooms: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      landSpace: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      parking: {
        type: String,
        enum: ['Yes', 'No'],
        default:'No',
        required: true,
      },
      rent: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      mappoint: {
        type: {
          latitude: {
            type: Number,
            required: true,
          },
          longitude: {
            type: Number,
            required: true,
          },
        },
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model("Flat",flatSchema);